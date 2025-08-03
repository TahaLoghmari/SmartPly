namespace backend.DTOs;

public record DownloadResultDto
{
    public byte[] Bytes { get; set; }
    public string Name { get; set; }
}