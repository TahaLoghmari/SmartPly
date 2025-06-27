using System.Net.Mail; 
using System.Net;
using System.Text.Encodings.Web;
using backend.DTOs.Email;
using backend.Entities;
using backend.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace backend.Services
{
    public sealed class EmailSenderService(
        IOptions<EmailSettings> options,
        UserManager<User> userManager)
    {
        private readonly EmailSettings _emailSettings = options.Value;

        private Task SendEmailAsync(SendEmailDto sendEmailDto)
        {

            string? mailServer = _emailSettings.MailServer;

            string? fromEmail = _emailSettings.FromEmail;

            string? password = _emailSettings.Password;

            string? senderName = _emailSettings.SenderName;

            int port = Convert.ToInt32(_emailSettings.MailPort);

            var client = new SmtpClient(mailServer, port)
            {
                Credentials = new NetworkCredential(fromEmail, password),
                EnableSsl = true,
            };
            MailAddress fromAddress = new MailAddress(fromEmail, senderName);
            
            MailMessage mailMessage = new MailMessage
            {
                From = fromAddress, 
                Subject = sendEmailDto.Subject, 
                Body = sendEmailDto.Body, 
                IsBodyHtml = sendEmailDto.IsBodyHtml 
            };

            mailMessage.To.Add(sendEmailDto.ToEmail);

            return client.SendMailAsync(mailMessage);
        }
        public async Task SendForgotPasswordEmail(string email, User user, HttpContext httpContext, IUrlHelper url)
        {
            var token = await userManager.GeneratePasswordResetTokenAsync(user);

            var passwordResetLink = url.Action("ResetPassword", "Auth",
                new { Email = email, Token = token }, protocol: httpContext.Request.Scheme);
            
            if (passwordResetLink is null)
            {
                var problem = new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Password reset link generation failed",
                    Detail = "Could not generate a valid reset password link."
                };
                throw new Exception(problem.Detail);
            }

            var safeLink = HtmlEncoder.Default.Encode(passwordResetLink);

            var subject = "Reset Your Password";

            var messageBody = $@"
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=""utf-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Reset Your SmartPly Password</title>
    </head>
    <body style=""margin: 0; padding: 0; background-color: #f8f9fa;"">
        <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"">
            
            <!-- Header -->
            <div style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;"">
                <h1 style=""color: #ffffff; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 28px; font-weight: 300;"">
                    Password Reset Request
                </h1>
                <p style=""color: #e8ecff; margin: 10px 0 0 0; font-size: 16px;"">
                    Let's get you back in
                </p>
            </div>

            <!-- Content -->
            <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #2c3e50;"">
                
                <p style=""font-size: 18px; margin: 0 0 25px 0;"">
                    Hi <strong style=""color: #667eea;"">{user.Name}</strong>,
                </p>

                <p style=""font-size: 16px; margin: 0 0 30px 0;"">
                    We received a request to reset your password for your <strong>SmartPly</strong> account. 
                    If you made this request, please click the button below to reset your password:
                </p>

                <!-- CTA Button -->
                <div style=""text-align: center; margin: 40px 0;"">
                    <a href=""{safeLink}"" 
                       style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: #ffffff;
                              padding: 16px 32px;
                              text-decoration: none;
                              font-weight: 600;
                              font-size: 16px;
                              border-radius: 8px;
                              display: inline-block;
                              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                              transition: all 0.3s ease;"">
                        🔑 Reset Password
                    </a>
                </div>

                <!-- Alternative Link -->
                <div style=""background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 30px 0;"">
                    <p style=""margin: 0 0 10px 0; font-size: 14px; color: #6c757d;"">
                        <strong>Button not working?</strong> Copy and paste this link into your browser:
                    </p>
                    <p style=""margin: 0; word-break: break-all;"">
                        <a href=""{safeLink}"" style=""color: #667eea; text-decoration: none; font-size: 14px;"">
                            {safeLink}
                        </a>
                    </p>
                </div>

                <!-- Security Note -->
                <div style=""margin: 30px 0; padding: 15px; background-color: #fff3cd; border-radius: 6px; border: 1px solid #ffeaa7;"">
                    <p style=""margin: 0; font-size: 14px; color: #856404;"">
                        🔒 <strong>Security Note:</strong> If you didn't request a password reset, you can safely ignore this email or contact support if you have concerns.
                    </p>
                </div>

            </div>

            <!-- Footer -->
            <div style=""background-color: #2c3e50; padding: 30px; text-align: center;"">
                <p style=""color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">
                    Best regards,
                </p>
                <p style=""color: #bdc3c7; margin: 0; font-size: 14px;"">
                    The SmartPly Team
                </p>
                
                <div style=""margin-top: 20px; padding-top: 20px; border-top: 1px solid #34495e;"">
                    <p style=""color: #95a5a6; margin: 0; font-size: 12px;"">
                        This email was sent to you because you requested a password reset for SmartPly.<br>
                        © 2025 SmartPly. All rights reserved.
                    </p>
                </div>
            </div>

        </div>
    </body>
    </html>
    ";

            SendEmailDto sendEmailDto = new SendEmailDto(email, subject, messageBody, true);
            await SendEmailAsync(sendEmailDto);
        }
        public async Task SendConfirmationEmail(string email, User user, HttpContext httpContext, IUrlHelper url)
        {
            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

            var confirmationLink = url.Action("ConfirmEmail", "Auth",
                new { UserId = user.Id, Token = token }, protocol: httpContext.Request.Scheme);

            if (confirmationLink is null)
            {
                var problem = new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Email confirmation link generation failed",
                    Detail = "Could not generate a valid email confirmation link."
                };
                throw new Exception(problem.Detail);
            }

            var safeLink = HtmlEncoder.Default.Encode(confirmationLink);

            var subject = "Welcome to SmartPly! Please Confirm Your Email";

            var messageBody = $@"
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset=""utf-8"">
        <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
        <title>Welcome to SmartPly</title>
    </head>
    <body style=""margin: 0; padding: 0; background-color: #f8f9fa;"">
        <div style=""max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"">
            
            <!-- Header -->
            <div style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;"">
                <h1 style=""color: #ffffff; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 28px; font-weight: 300;"">
                    Welcome to <strong>SmartPly</strong>
                </h1>
                <p style=""color: #e8ecff; margin: 10px 0 0 0; font-size: 16px;"">
                    Let's get you started
                </p>
            </div>

            <!-- Content -->
            <div style=""padding: 40px 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.7; color: #2c3e50;"">
                
                <p style=""font-size: 18px; margin: 0 0 25px 0;"">
                    Hi <strong style=""color: #667eea;"">{user.Name}</strong>,
                </p>

                <p style=""font-size: 16px; margin: 0 0 30px 0;"">
                    Thank you for creating an account with us! We're excited to have you join the SmartPly community. 
                    To unlock all of our amazing features, please confirm your email address.
                </p>

                <!-- CTA Button -->
                <div style=""text-align: center; margin: 40px 0;"">
                    <a href=""{safeLink}"" 
                       style=""background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                              color: #ffffff;
                              padding: 16px 32px;
                              text-decoration: none;
                              font-weight: 600;
                              font-size: 16px;
                              border-radius: 8px;
                              display: inline-block;
                              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                              transition: all 0.3s ease;"">
                        ✓ Confirm Your Email
                    </a>
                </div>

                <!-- Alternative Link -->
                <div style=""background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 30px 0;"">
                    <p style=""margin: 0 0 10px 0; font-size: 14px; color: #6c757d;"">
                        <strong>Button not working?</strong> Copy and paste this link into your browser:
                    </p>
                    <p style=""margin: 0; word-break: break-all;"">
                        <a href=""{safeLink}"" style=""color: #667eea; text-decoration: none; font-size: 14px;"">
                            {safeLink}
                        </a>
                    </p>
                </div>

                <!-- Security Note -->
                <div style=""margin: 30px 0; padding: 15px; background-color: #fff3cd; border-radius: 6px; border: 1px solid #ffeaa7;"">
                    <p style=""margin: 0; font-size: 14px; color: #856404;"">
                        🔒 <strong>Security Note:</strong> If you didn't create this account, you can safely ignore this email.
                    </p>
                </div>

            </div>

            <!-- Footer -->
            <div style=""background-color: #2c3e50; padding: 30px; text-align: center;"">
                <p style=""color: #ffffff; margin: 0 0 10px 0; font-size: 16px; font-weight: 500;"">
                    Best regards,
                </p>
                <p style=""color: #bdc3c7; margin: 0; font-size: 14px;"">
                    The SmartPly Team
                </p>
                
                <div style=""margin-top: 20px; padding-top: 20px; border-top: 1px solid #34495e;"">
                    <p style=""color: #95a5a6; margin: 0; font-size: 12px;"">
                        This email was sent to you because you signed up for SmartPly.<br>
                        © 2025 SmartPly. All rights reserved.
                    </p>
                </div>
            </div>

        </div>
    </body>
    </html>
    ";
            SendEmailDto sendEmailDto = new SendEmailDto(email, subject, messageBody, true);

            await SendEmailAsync(sendEmailDto);
        }
        
    }
}