using System.Net.Mail; // Namespace for email-related classes like SmtpClient and MailMessage.
using System.Net;
using backend.DTOs.Email;
using backend.Settings; // Namespace for network credentials and related functionality.
using Microsoft.Extensions.Options;

namespace backend.Services
{
    public sealed class EmailSenderService(IOptions<EmailSettings> options)
    {
        private readonly EmailSettings _emailSettings = options.Value;

        public Task SendEmailAsync(SendEmailDto sendEmailDto)
        {

            string? MailServer = _emailSettings.MailServer;

            string? FromEmail = _emailSettings.FromEmail;

            string? Password = _emailSettings.Password;

            string? SenderName = _emailSettings.SenderName;

            int Port = Convert.ToInt32(_emailSettings.MailPort);

            var client = new SmtpClient(MailServer, Port)
            {
                Credentials = new NetworkCredential(FromEmail, Password),
                EnableSsl = true,
            };
            MailAddress fromAddress = new MailAddress(FromEmail, SenderName);
            
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
    }
}