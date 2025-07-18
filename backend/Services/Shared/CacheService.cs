using System.Collections.Concurrent;
using backend.DTOs.Application;
using backend.DTOs.Resume;
using backend.DTOs.Shared;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services.Shared;

public sealed class CacheService(
    IMemoryCache cache,
    ILogger<ApplicationService> logger)
{
    private const string USER_APPLICATIONS_PREFIX = "UserApplications_";
    private const string USER_CACHE_KEYS_PREFIX = "UserCacheKeys_";
    private const string APPLICATION_STATS_PREFIX = "ApplicationStats_";
    private const string USER_RESUMES_PREFIX = "UserResumes_";
    
    public string GenerateApplicationsCacheKey(string userId, ApplicationQueryParameters query)
    {
        return $"{USER_APPLICATIONS_PREFIX}{userId}_{query.Search}_{query.Status}_{query.Level}_{query.Type}_{query.JobType}_{query.Page}_{query.PageSize}";
    }
    
    public string GenerateResumesCacheKey(string userId, ResumeQueryParameters query)
    {
        return $"{USER_RESUMES_PREFIX}{userId}_{query.Search}";
    }
    
    public void CacheApplicationsResult(string cacheKey, PaginationResult<ApplicationResponseDto> result, string userId)
    {
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(10))
            .SetSlidingExpiration(TimeSpan.FromMinutes(5))
            .SetPriority(CacheItemPriority.Normal);

        TrackCacheKey(userId, cacheKey);

        cache.Set(cacheKey, result, cacheOptions);
        
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

    public void CacheApplicationStats(string cacheKey, ApplicationStatsDto stats, string userId)
    {
        var cacheOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromMinutes(5))
            .SetSlidingExpiration(TimeSpan.FromMinutes(2))
            .SetPriority(CacheItemPriority.Normal);
        
        TrackCacheKey(userId, cacheKey);

        cache.Set(cacheKey, stats, cacheOptions);
        
        logger.LogDebug("Cached application stats with key: {CacheKey}", cacheKey);
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
            .Where(key => key.StartsWith(USER_APPLICATIONS_PREFIX) || 
                         key.StartsWith(APPLICATION_STATS_PREFIX))
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