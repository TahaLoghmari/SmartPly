using backend.Settings;
using Microsoft.Extensions.Options;
using Supabase.Storage;


namespace backend.Services.Shared;

public class SupabaseService
{
    private readonly Supabase.Client _client;
    private readonly string _supabaseUrl;

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

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        var ext        = Path.GetExtension(file.FileName); 
        var objectPath = $"resume_{Guid.NewGuid():N}{ext}";

        byte[] buffer;
        await using (var ms = new MemoryStream())
        {
            await file.CopyToAsync(ms);
            buffer = ms.ToArray();
        }

        var bucket = _client.Storage.From("resumes");
        await bucket.Upload(
            buffer,          
            objectPath,        
            new Supabase.Storage.FileOptions
            {
                CacheControl = "3600",
                Upsert       = false,
                ContentType  = file.ContentType
            });
        return $"{_supabaseUrl}/storage/v1/object/public/resumes/{objectPath}";
    }
}