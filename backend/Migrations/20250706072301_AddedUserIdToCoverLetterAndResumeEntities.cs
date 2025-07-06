using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedUserIdToCoverLetterAndResumeEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "CoverLetters",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Resumes_UserId",
                table: "Resumes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CoverLetters_UserId",
                table: "CoverLetters",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_CoverLetters_AspNetUsers_UserId",
                table: "CoverLetters",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Resumes_AspNetUsers_UserId",
                table: "Resumes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CoverLetters_AspNetUsers_UserId",
                table: "CoverLetters");

            migrationBuilder.DropForeignKey(
                name: "FK_Resumes_AspNetUsers_UserId",
                table: "Resumes");

            migrationBuilder.DropIndex(
                name: "IX_Resumes_UserId",
                table: "Resumes");

            migrationBuilder.DropIndex(
                name: "IX_CoverLetters_UserId",
                table: "CoverLetters");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "CoverLetters");
        }
    }
}
