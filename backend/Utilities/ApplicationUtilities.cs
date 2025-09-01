using backend.Entities;
using backend.Enums;

namespace backend.Utilities;

public static class ApplicationUtilities
{
    public static ApplicationStatus MapCategoryToStatusType(string? category)
    {
        switch (category.Trim().ToLowerInvariant())
        {
            case "interview":
                return ApplicationStatus.interview;
            case "offer":
                return ApplicationStatus.offer;
            case "applied":
                return ApplicationStatus.applied;
            case "rejected":
                return ApplicationStatus.rejected;
            default:
                return ApplicationStatus.offer;
        }
    }

    public static void UpdateApplicationStatusDate(
        Application application, 
        string? category,
        bool? opposite = false)
    {
        var cat = string.IsNullOrWhiteSpace(category) ? string.Empty : category.Trim().ToLowerInvariant();

        switch (cat)
        {
            case "wishlist":
                if ( opposite == true )
                {
                    application.WishListDate = null;
                    break;
                }
                if (application.WishListDate != null && application.WishListDate <= DateTime.Now) break;
                application.WishListDate = DateTime.UtcNow;
                break;
            case "interview":
                if ( opposite == true ) 
                {
                    application.InterviewDate = null;
                    break;
                }
                if (application.InterviewDate != null && application.InterviewDate <= DateTime.Now) break;
                application.InterviewDate = DateTime.UtcNow;
                break;
            case "offer":
                if (opposite == true)
                {
                    application.OfferDate = null;
                    break;
                }
                if (application.OfferDate != null && application.OfferDate <= DateTime.Now) break;
                application.OfferDate = DateTime.UtcNow;
                break;
            case "applied":
                if ( opposite == true ) 
                {
                    application.AppliedDate = null;
                    break;
                }
                if (application.AppliedDate != null && application.AppliedDate <= DateTime.Now) break;
                application.AppliedDate = DateTime.UtcNow;
                break;
            case "rejected":
                if ( opposite == true ) 
                {
                    application.RejectedDate = null;
                    break;
                }
                if (application.RejectedDate != null && application.RejectedDate <= DateTime.Now) break;
                application.RejectedDate = DateTime.UtcNow;
                break;
        }
    }
}