using System.Collections.Concurrent;
using backend.DTOs;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;

//For each user, there is a cache entry with a key like UserCacheKeys_123.
// The value for this key is a ConcurrentDictionary<string, byte>.
// The dictionary's keys are all the cache keys (e.g. UserApplications_123_search_status_level_type_jobtype_page_pagesize) that reference the actual cached data.
// The actual data is stored in the cache under those cache keys.
// The dictionary only tracks which cache keys exist for that user; it does not store the data itself.
//To retrieve the actual cached data, you only need the specific cacheKey and can directly use cache.TryGetValue(cacheKey, out ...).
// Accessing the user key set (UserCacheKeys_123) is only necessary if you want to enumerate or invalidate all cache entries for a user, not for reading a single cached value

public sealed class CacheService(
    IMemoryCache cache,
    ILogger<ApplicationService> logger)
{
    private const string USER_APPLICATIONS_PREFIX = "UserApplications_";
    private const string USER_CACHE_KEYS_PREFIX = "UserCacheKeys_";
    private const string USER_RESUMES_PREFIX = "UserResumes_";
    
    public string GenerateApplicationsCacheKey(string userId, ApplicationQueryParameters query)
    {
        return $"{USER_APPLICATIONS_PREFIX}{userId}_{query.Search}_{query.Status}_{query.Level}_{query.Type}_{query.JobType}_{query.Page}_{query.PageSize}";
    }
    
    public string GenerateResumesCacheKey(string userId, ResumeQueryParameters query)
    {
        return $"{USER_RESUMES_PREFIX}{userId}_{query.Search}";
    }
    
    public void CacheApplicationsResult(string cacheKey, PaginationResultDto<ApplicationResponseDto> resultDto, string userId)
    {
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(10))
            .SetSlidingExpiration(TimeSpan.FromMinutes(5))
            .SetPriority(CacheItemPriority.Normal);

        TrackCacheKey(userId, cacheKey);

        cache.Set(cacheKey, resultDto, cacheOptions);
        
        logger.LogDebug("Cached application results with key: {CacheKey}", cacheKey);
    }

    public void CacheResumesResult(string cacheKey, ICollection<ResumeResponseDto> result, string userId)
    {
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(10))
            .SetSlidingExpiration(TimeSpan.FromMinutes(5))
            .SetPriority(CacheItemPriority.Normal);

        TrackCacheKey(userId, cacheKey);

        cache.Set(cacheKey, result, cacheOptions);

        logger.LogDebug("Cached resume results with key: {CacheKey}", cacheKey);
    }

    public void TrackCacheKey(string userId, string cacheKey)
    {
        string userKeySet = $"{USER_CACHE_KEYS_PREFIX}{userId}";
        var keys = cache.GetOrCreate<ConcurrentDictionary<string, byte>>(userKeySet, 
            entry => {
                entry.SetAbsoluteExpiration(TimeSpan.FromHours(1));
                return new ConcurrentDictionary<string, byte>();
            });
        
        keys.TryAdd(cacheKey, 0);
    }

    public void InvalidateUserApplicationCache(string userId)
    {
        string userKeySet = $"{USER_CACHE_KEYS_PREFIX}{userId}";
        
        if (!cache.TryGetValue(userKeySet, out ConcurrentDictionary<string, byte>? userKeys))
        {
            logger.LogDebug("No cache keys found for user: {UserId}", userId);
            return;
        }

        var keysToRemove = userKeys.Keys
            .Where(key => key.StartsWith(USER_APPLICATIONS_PREFIX))
            .ToList();

        foreach (var key in keysToRemove)
        {
            cache.Remove(key);
            userKeys.TryRemove(key, out _);
            logger.LogDebug("Removed cache key: {CacheKey}", key);
        }

        logger.LogInformation("Invalidated {Count} application cache entries for user: {UserId}", 
            keysToRemove.Count, userId);

        if (userKeys.IsEmpty)
        {
            cache.Remove(userKeySet);
            logger.LogDebug("Removed empty cache key set for user: {UserId}", userId);
        }
    }
    public void InvalidateUserResumeCache(string userId)
    {
        string userKeySet = $"{USER_CACHE_KEYS_PREFIX}{userId}";

        if (!cache.TryGetValue(userKeySet, out ConcurrentDictionary<string, byte>? userKeys))
        {
            logger.LogDebug("No cache keys found for user: {UserId}", userId);
            return;
        }

        var keysToRemove = userKeys.Keys
            .Where(key => key.StartsWith(USER_RESUMES_PREFIX))
            .ToList();

        foreach (var key in keysToRemove)
        {
            cache.Remove(key);
            userKeys.TryRemove(key, out _);
            logger.LogDebug("Removed cache key: {CacheKey}", key);
        }

        logger.LogInformation("Invalidated {Count} resume cache entries for user: {UserId}",
            keysToRemove.Count, userId);

        if (userKeys.IsEmpty)
        {
            cache.Remove(userKeySet);
            logger.LogDebug("Removed empty cache key set for user: {UserId}", userId);
        }
    }
}