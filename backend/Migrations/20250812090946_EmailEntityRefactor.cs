using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class EmailEntityRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Emails_UserId_IsRead",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "ToAddresses",
                table: "Emails");

            migrationBuilder.AddColumn<DateTime>(
                name: "HeaderDate",
                table: "Emails",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Emails_UserId_HeaderDate",
                table: "Emails",
                columns: new[] { "UserId", "HeaderDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Emails_UserId_HeaderDate",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "HeaderDate",
                table: "Emails");

            migrationBuilder.AddColumn<string>(
                name: "ToAddresses",
                table: "Emails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Emails_UserId_IsRead",
                table: "Emails",
                columns: new[] { "UserId", "IsRead" });
        }
    }
}
