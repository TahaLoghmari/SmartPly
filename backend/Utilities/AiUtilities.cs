namespace backend.Utilities;

public static class AiUtilities
{
    public static string CleanJsonResponse(string rawResponse)
    {
        if (string.IsNullOrWhiteSpace(rawResponse))
            return rawResponse;

        rawResponse = rawResponse.Trim();

        // If wrapped in ```json ... ```
        if (rawResponse.StartsWith("```"))
        {
            int firstNewline = rawResponse.IndexOf('\n');
            int lastFence = rawResponse.LastIndexOf("```");

            if (firstNewline != -1 && lastFence != -1)
            {
                rawResponse = rawResponse.Substring(firstNewline + 1, lastFence - firstNewline - 1).Trim();
            }
        }

        return rawResponse;
    }
}