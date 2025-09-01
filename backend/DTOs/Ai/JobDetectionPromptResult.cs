namespace backend.DTOs;

public class JobDetectionPromptResult
{
    [Newtonsoft.Json.JsonProperty("isJobRelated")]
    public bool IsJobRelated { get; set; }

    [Newtonsoft.Json.JsonProperty("category")]
    public string Category { get; set; } = string.Empty;

    [Newtonsoft.Json.JsonProperty("summary")]
    public string Summary { get; set; } = string.Empty;
    
    [Newtonsoft.Json.JsonProperty("companyName")]
    public string CompanyName { get; set; } = "Unknown";
}