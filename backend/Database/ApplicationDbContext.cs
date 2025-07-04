using backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<User, IdentityRole, string>(options)
{
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<Contact> Contacts { get; set; }
    public DbSet<Resume> Resumes { get; set; }
    public DbSet<CoverLetter> CoverLetters { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
