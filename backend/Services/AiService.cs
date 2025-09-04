using System.Text.Json;
using backend.DTOs;
using backend.Entities;
using backend.Enums;
using backend.Utilities;
using FluentValidation;
using Hangfire;
using Microsoft.EntityFrameworkCore;
using Mscc.GenerativeAI;
using Message = Google.Apis.Gmail.v1.Data.Message;

namespace backend.Services;

public class AiService(
    ILogger<AiService> logger,
    ApplicationDbContext dbContext,
    NotificationService notificationService,
    EmailService emailService,
    CacheService cacheService,
    IBackgroundJobClient backgroundJobClient,
    IValidator<JobDetectionPromptResult> jobDetectionValidator,
    IValidator<JobMatchingPromptResult> jobMatchingValidator)
{
    public async Task<JobDetectionPromptResult?> ClassifyEmailAsync(
        Email existingEmail,
        GenerativeModel model,
        string decodedBody)
    {
        var promptText = $@"
You are an AI email classifier. Your task is to analyze email content and determine if it is 
directly related to a job application process involving the recipient.

CLASSIFICATION RULES:
- Classify as job-related ONLY if the email is a direct communication about the recipient's personal application, such as:
    - Applying for a job.
    - Scheduling or conducting an interview.
    - Receiving an offer.
    - Receiving a rejection or status update.
    - Direct outreach from a recruiter about a specific role for the recipient.
- DO NOT classify as job-related if the email is generic, promotional, or not specific to the recipient's application. Examples include:
    - General job market newsletters or career advice.
    - Job board updates or promotional alerts.
    - General networking or business-related emails.

CATEGORIES:
- interview: For scheduling, confirming, or providing details about an interview.
- offer: For job offers or related discussions.
- applied: For confirmations of a submitted application.
- rejected: For rejection notices.
- emailUpdate: For any other direct status updates (e.g., ""application under review"").

INSTRUCTIONS:
1. Read the EMAIL INFO and EMAIL TEXT provided below.
2. First, decide if the email matches ANY job-related case (applied, interview, offer, rejection, status update, recruiter outreach).  
   - If yes, you MUST set `""isJobRelated"": true`.  
   - If no, set `""isJobRelated"": false`.  
3. VERY IMPORTANT:  
   - If `""isJobRelated"": true` :
     - `""category""` MUST be one of the provided categories
     - `""summary""` MUST be a concise 1–2 sentence summary .
     - ""companyName"" MUST be set to the company's name. If the company name cannot be determined from the email, use the literal string ""N/A"".
     - `""position"" must be set to the job's position`. If the position cannot be determined from the email, use the literal string ""N/A"".
   - If `""isJobRelated"": false`:
     -`""category""` MUST be null.
     - `""summary""` MUST be null.
     -`""companyName""` MUST be null.
     - `""position""` MUST be null.
   - Do not output anything else in these fields. 
4.  Provide a concise, 1-2 sentence summary of the email's content.

RESPOND ONLY with a valid JSON object. Do not include any extra text, commentary, or markdown formatting like ```json.

EMAIL INFO:
{{
    ""subject"": {existingEmail.Subject},
    ""from_address"": {existingEmail.FromAddress},
    ""from_name"": {existingEmail.FromName},
    ""snippet"": {existingEmail.Snippet}
}}

EMAIL TEXT:
{decodedBody}

OUTPUT JSON FORMAT:
{{
  ""isJobRelated"": boolean,
  ""category"": string|null,
  ""summary"": string|null,
  ""companyName"": string|null,
  ""position"": string|null
}}
";
        
        GenerateContentResponse result = await model.GenerateContent(promptText);

        var cleanedText = AiUtilities.CleanJsonResponse(result.Text);
    
        JobDetectionPromptResult? aiJsonResult = JsonSerializer.Deserialize<JobDetectionPromptResult>(
            cleanedText,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        if (aiJsonResult is not null)
        {
            await jobDetectionValidator.ValidateAndThrowAsync(aiJsonResult);
            logger.LogInformation(
                "AI classification for email {EmailId}: isJobRelated={IsJobRelated}, category={Category}, position={Position}, companyName={CompanyName}",
                existingEmail.Id, aiJsonResult.IsJobRelated, aiJsonResult.Category, aiJsonResult.Position, aiJsonResult.CompanyName);
        }
    
        return aiJsonResult;
    }

    public async Task HandleClassificationAsync(
        GenerativeModel model,
        string userId,
        JobDetectionPromptResult previousAiJsonResult,
        Email existingEmail,
        string decodedBody,
        List<ApplicationAiPromptDto> userApplications,
        CancellationToken cancellationToken)
    {
        var userApplicationsJson = JsonSerializer.Serialize(userApplications);
        var promptText = $@"
You are an AI designed to match an incoming email to a specific job application from a user's tracked list.
INPUTS:
1. Email content (subject, from_address, from_name, snippet, and body).
2. A JSON array of job applications previously entered by the user.
   Each object in the array has the following structure:
   - id (unique identifier, keep exactly as provided)
   - companyName
   - companyEmail
   - jobType
   - level
   - link
   - location
   - notes
   - position
   - status
   - type

TASK:
- Determine if this email most likely relates to one of the job applications in the list.
- Matching priority:
  1. **Company name or position title** explicitly mentioned in the email.
  2. **Sender email (from_address)** matching or strongly resembling the company's `companyEmail`.
  3. **Contextual clues** such as recruiter names, interview scheduling, references to application/resume, or product/project names mentioned in `notes` .
- If multiple jobs match, choose the **single best match** based on the strongest overlap of company name + position.
- If no job can be reasonably matched, return `null`.

OUTPUT:
- Respond ONLY with a valid JSON object.
- Do not include extra text, commentary, or markdown formatting.

EMAIL INFO:
{{
  subject: {existingEmail.Subject},
  from_address: {existingEmail.FromAddress},
  from_name: {existingEmail.FromName},
  snippet: {existingEmail.Snippet}
}}

EMAIL CONTENT:
{decodedBody}

JOB LIST:
{userApplicationsJson}

OUTPUT JSON FORMAT:
{{
  id: string|null
}}

RULES:
- Always return exactly one field: `id`.
- Use the `id` exactly as provided in the job list.
- Return id as null if no reliable match exists.
";

        GenerateContentResponse result = await model.GenerateContent(promptText);
        
        var newCleanedText = AiUtilities.CleanJsonResponse(result.Text);
        
        JobMatchingPromptResult? aiJsonResult = JsonSerializer.Deserialize<JobMatchingPromptResult>(
            newCleanedText,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        
        await jobMatchingValidator.ValidateAndThrowAsync(aiJsonResult!,cancellationToken);

        if ( aiJsonResult?.Id is not null && aiJsonResult.Id != Guid.Empty )
        {
            logger.LogInformation(
                "An Application match was found for email {EmailId}: MatchedJobId={MatchedJobId}, category={Category}, companyName={CompanyName}",
                existingEmail.Id,
                aiJsonResult!.Id,
                previousAiJsonResult.Category,
                previousAiJsonResult.CompanyName
            );
            existingEmail.MatchedJobId = aiJsonResult.Id;
            existingEmail.Category = previousAiJsonResult.Category;
            
            Application? matchedApplication = await dbContext.Applications
                .FirstOrDefaultAsync(a => a.Id == aiJsonResult.Id && a.UserId == userId, cancellationToken);
            
            if (matchedApplication is null)
            {
                logger.LogWarning("Get current application failed - application not found for Id: {applicationId}", existingEmail.Id);
            }
            else
            {
                matchedApplication.Status = ApplicationUtilities.MapCategoryToStatusType(previousAiJsonResult.Category);
                foreach (ApplicationStatus status in Enum.GetValues(typeof(ApplicationStatus)))
                {
                    if (status <= matchedApplication.Status)
                    {
                        ApplicationUtilities.UpdateApplicationStatusDate(matchedApplication, status.ToString());
                    }
                }
                foreach (ApplicationStatus status in Enum.GetValues(typeof(ApplicationStatus)))
                {
                    if (status > matchedApplication.Status)
                    {
                        ApplicationUtilities.UpdateApplicationStatusDate(matchedApplication, status.ToString(),true);
                    }
                }
            }
            
            var notificationType = NotificationUtilities.MapCategoryToNotificationType(previousAiJsonResult.Category);
            
            var notificationRequestDto = new NotificationRequestDto
            {
                Title = "Application Match Found",
                Message = $"An incoming email (\"{existingEmail.Subject}\") was matched to your application (companyName: {previousAiJsonResult.CompanyName}). Category: {previousAiJsonResult.Category ?? "N/A"}.",
                Type = notificationType, 
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                ApplicationId = matchedApplication!.Id
            };

            await notificationService.AddNotificationAsync(userId, notificationRequestDto,cancellationToken);
        }
        else
        {
            logger.LogInformation(
                "An Application match was not found for email {EmailId}",
                existingEmail.Id
            );

            Application newApplication = new Application
            {
                UserId = userId,
                CompanyName = previousAiJsonResult.CompanyName,
                CompanyEmail = existingEmail.FromAddress,
                Position = previousAiJsonResult.Position,
                Link = "N/A",
                Status = ApplicationUtilities.MapCategoryToStatusType(previousAiJsonResult.Category),
                Type = ApplicationType.onSite,
                JobType = ApplicationJobType.fullTime,
                Level = ApplicationLevel.mid,
                Location = "N/A",
                StartSalary = 0,
                EndSalary = 0,
            };
            
            foreach (ApplicationStatus status in Enum.GetValues(typeof(ApplicationStatus)))
            {
                if (status <= newApplication.Status)
                {
                    ApplicationUtilities.UpdateApplicationStatusDate(newApplication, status.ToString());
                }
            }
            
            dbContext.Applications.Add(newApplication);
            cacheService.InvalidateUserApplicationCache(newApplication.UserId);
            
            existingEmail.MatchedJobId = newApplication.Id;
            existingEmail.Category = previousAiJsonResult.Category;
            
            var notificationType = NotificationUtilities.MapCategoryToNotificationType(previousAiJsonResult.Category);
            
            var notificationRequestDto = new NotificationRequestDto
            {
                Title = "New Application Created",
                Message = $"An email ('{existingEmail.Subject}') was received. Since no match was found, a new application was automatically created for you with the status: {previousAiJsonResult.Category}.",
                Type = notificationType,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                ApplicationId = newApplication.Id
            };

            await notificationService.AddNotificationAsync(userId, notificationRequestDto,cancellationToken);
        }
    }

    public async Task ClassifyAndMatchEmailAsync(
        string userId,
        string id,
        GenerativeModel model,
        List<ApplicationAiPromptDto> userApplications,
        CancellationToken cancellationToken)
    {
        var existingEmail = await dbContext.Emails
            .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId, cancellationToken);
        
        if (existingEmail is null)
        {
            logger.LogWarning("Email with ID {EmailId} not found for user {UserId}.", id, userId);
            return;
        }
        
        try
        {
            Message? fullEmail = await emailService.GetEmailByIdAsync(id, userId, cancellationToken);
                
            var decodedBody = EmailUtilities.GetDecodedEmailBody(fullEmail);

            JobDetectionPromptResult? aiJsonResult = await ClassifyEmailAsync(existingEmail, model, decodedBody);

            if (aiJsonResult is null) throw new InvalidOperationException("AI classification returned a null or invalid result for email {id}.");
            
            existingEmail.IsJobRelated = aiJsonResult.IsJobRelated;

            if (existingEmail.IsJobRelated)
            {
                existingEmail.Category = aiJsonResult.Category;
                existingEmail.Summary = aiJsonResult.Summary;
                
                await Task.Delay(1000, cancellationToken);
                
                existingEmail.UpdatedAt = DateTime.UtcNow;
                
                await HandleClassificationAsync(model,userId,aiJsonResult,existingEmail,decodedBody,userApplications,cancellationToken);
                
                cacheService.InvalidateUserEmailCache(userId);
            }
            
            await dbContext.SaveChangesAsync(cancellationToken);
            
            logger.LogInformation("Email {EmailId} processed successfully.", id);
            
            await Task.Delay(2000, cancellationToken);
        }
        catch (Exception e)
        {
            logger.LogError(e, "Unexpected error while processing email {EmailId}. Will retry tomorrow.", id);
            if ( existingEmail.AiProcessingRetryCount == 0)
            {
                var jobId = backgroundJobClient.Schedule<AiService>(
                    s => 
                        s.ClassifyAndMatchEmailAsync(userId, id,model,userApplications,CancellationToken.None),
                    TimeSpan.FromDays(1));
                
                HangfireJob hangfireJob = new HangfireJob
                {
                    HangfireJobId = jobId,
                    UserId = userId,
                };
                
                existingEmail.AiProcessingRetryCount++;
                dbContext.HangfireJobs.Add(hangfireJob);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }
}