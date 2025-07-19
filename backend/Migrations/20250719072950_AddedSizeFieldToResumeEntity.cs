using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedSizeFieldToResumeEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "resumeUrl",
                table: "Resumes",
                newName: "ResumeUrl");

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "Resumes",
                type: "bigint",
                maxLength: 32,
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Size",
                table: "Resumes");

            migrationBuilder.RenameColumn(
                name: "ResumeUrl",
                table: "Resumes",
                newName: "resumeUrl");
        }
    }
}
