using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedCoverLetterEntityAndAdjustedResumeEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ResumeUrl",
                table: "Resumes",
                newName: "Url");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoverLetters",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "CoverLetters",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<long>(
                name: "Size",
                table: "CoverLetters",
                type: "bigint",
                maxLength: 32,
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "CoverLetters",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "CoverLetters",
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
                table: "CoverLetters");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "CoverLetters");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "CoverLetters");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "CoverLetters");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "Resumes",
                newName: "ResumeUrl");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "CoverLetters",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
