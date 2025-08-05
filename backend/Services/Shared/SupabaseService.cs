using backend.Settings;
using Microsoft.Extensions.Options;
using Supabase.Storage;


namespace backend.Services;

public class SupabaseService
{
    public readonly Supabase.Client _client;
    public readonly string _supabaseUrl;

    public SupabaseService(IOptions<SupabaseSettings> options)
    {
        var supabaseOptions = new Supabase.SupabaseOptions
        {
            AutoConnectRealtime = true
        };
        _supabaseUrl = options.Value.Url;
        _client = new Supabase.Client(
            options.Value.Url,
            options.Value.ServiceRoleKey,
            supabaseOptions
        );
    }
    
    public async Task InitializeAsync()
    {
        await _client.InitializeAsync();
    }

    public async Task<string> UploadFileAsync(
        IFormFile file,
        string name,
        string bucketName,
        CancellationToken cancellationToken)
    {
        var ext        = Path.GetExtension(file.FileName); 
        var objectPath = $"{name}_{Guid.NewGuid():N}{ext}";

        byte[] buffer;
        await using (var ms = new MemoryStream())
        {
            await file.CopyToAsync(ms,cancellationToken);
            buffer = ms.ToArray();
        }

        var bucket = _client.Storage.From($"{bucketName}");
        await bucket.Upload(
            buffer,          
            objectPath,        
            new Supabase.Storage.FileOptions
            {
                CacheControl = "3600",
                Upsert       = false,
                ContentType  = file.ContentType
            });
        return $"{_supabaseUrl}/storage/v1/object/public/{bucketName}/{objectPath}";
    }

    public async Task<byte[]> DownloadFileAsync(string url, string bucketName)
    {
        var objectPath = url.Replace($"{_supabaseUrl}/storage/v1/object/public/{bucketName}/", "");
        return await _client.Storage.From($"{bucketName}").Download(objectPath, (TransformOptions?)null, (EventHandler<float>?)null);
    }
    
    public async Task DeleteFileAsync(string url, string bucketName)
    {
        var objectPath = url.Replace($"{_supabaseUrl}/storage/v1/object/public/{bucketName}/", "");
        await _client.Storage.From($"{bucketName}").Remove(new List<string> { objectPath });
    }
}