namespace backend.Settings;

public class EmailSettings
{
    public string MailServer { get; set; }
    public int MailPort { get; set; }
    public string SenderName { get; set; }
    public string Password { get; set; }
    public string FromEmail { get; set; }
}