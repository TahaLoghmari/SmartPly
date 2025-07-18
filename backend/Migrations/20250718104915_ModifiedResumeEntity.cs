using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ModifiedResumeEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApplicationsCount",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "InterviewsCount",
                table: "Resumes");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Resumes",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Resumes",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "resumeUrl",
                table: "Resumes",
                type: "character varying(512)",
                maxLength: 512,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Resumes");

            migrationBuilder.DropColumn(
                name: "resumeUrl",
                table: "Resumes");

            migrationBuilder.AddColumn<int>(
                name: "ApplicationsCount",
                table: "Resumes",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "InterviewsCount",
                table: "Resumes",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
