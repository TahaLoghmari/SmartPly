using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class addedApplicationContactResumeCoverLetterEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Contacts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Contacts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CoverLetters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoverLetters", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Resumes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resumes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Applications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ResumeId = table.Column<Guid>(type: "uuid", nullable: false),
                    CoverLetterId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    CompanyName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    CompanyEmail = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Position = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Link = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    Notes = table.Column<string>(type: "character varying(5000)", maxLength: 5000, nullable: true),
                    Location = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    StartSalary = table.Column<int>(type: "integer", nullable: true),
                    EndSalary = table.Column<int>(type: "integer", nullable: true),
                    Deadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    JobDescription = table.Column<string>(type: "character varying(10000)", maxLength: 10000, nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    JobType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Level = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    TechnologiesUsed = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Applications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Applications_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Applications_CoverLetters_CoverLetterId",
                        column: x => x.CoverLetterId,
                        principalTable: "CoverLetters",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Applications_Resumes_ResumeId",
                        column: x => x.ResumeId,
                        principalTable: "Resumes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ApplicationContact",
                columns: table => new
                {
                    ApplicationsId = table.Column<Guid>(type: "uuid", nullable: false),
                    ContactsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApplicationContact", x => new { x.ApplicationsId, x.ContactsId });
                    table.ForeignKey(
                        name: "FK_ApplicationContact_Applications_ApplicationsId",
                        column: x => x.ApplicationsId,
                        principalTable: "Applications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ApplicationContact_Contacts_ContactsId",
                        column: x => x.ContactsId,
                        principalTable: "Contacts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ApplicationContact_ContactsId",
                table: "ApplicationContact",
                column: "ContactsId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_CoverLetterId",
                table: "Applications",
                column: "CoverLetterId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_ResumeId",
                table: "Applications",
                column: "ResumeId");

            migrationBuilder.CreateIndex(
                name: "IX_Applications_UserId",
                table: "Applications",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ApplicationContact");

            migrationBuilder.DropTable(
                name: "Applications");

            migrationBuilder.DropTable(
                name: "Contacts");

            migrationBuilder.DropTable(
                name: "CoverLetters");

            migrationBuilder.DropTable(
                name: "Resumes");
        }
    }
}
