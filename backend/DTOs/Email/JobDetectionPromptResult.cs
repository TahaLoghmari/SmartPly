namespace backend.Entities;

public class JobDetectionPromptResult
{
    [Newtonsoft.Json.JsonProperty("isJobRelated")]
    public bool IsJobRelated { get; set; }

    [Newtonsoft.Json.JsonProperty("category")]
    public string Category { get; set; } = string.Empty;

    [Newtonsoft.Json.JsonProperty("summary")]
    public string Summary { get; set; } = string.Empty;
}