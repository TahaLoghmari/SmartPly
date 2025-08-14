namespace backend.Entities;

public class EmailAIResult
{
    [Newtonsoft.Json.JsonProperty("is_job_related")]
    public bool IsJobRelated { get; set; }

    [Newtonsoft.Json.JsonProperty("category")]
    public string? Category { get; set; }

    [Newtonsoft.Json.JsonProperty("summary")]
    public string? Summary { get; set; }

    [Newtonsoft.Json.JsonProperty("confidence")]
    public float Confidence { get; set; }
}