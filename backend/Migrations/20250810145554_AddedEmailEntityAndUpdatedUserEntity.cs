using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedEmailEntityAndUpdatedUserEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "GoogleEmail",
                table: "AspNetUsers",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsInitialSyncComplete",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "LastHistoryId",
                table: "AspNetUsers",
                type: "numeric(20,0)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastSyncedAt",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Emails",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true),
                    HistoryId = table.Column<decimal>(type: "numeric(20,0)", nullable: true),
                    ThreadId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    InternalDate = table.Column<long>(type: "bigint", nullable: true),
                    LabelIds = table.Column<string>(type: "text", nullable: true),
                    SizeEstimate = table.Column<int>(type: "integer", nullable: true),
                    Snippet = table.Column<string>(type: "character varying(10000)", maxLength: 10000, nullable: false),
                    Etag = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Emails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Emails_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Emails_UserId",
                table: "Emails",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Emails");

            migrationBuilder.DropColumn(
                name: "IsInitialSyncComplete",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LastHistoryId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LastSyncedAt",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "GoogleEmail",
                table: "AspNetUsers",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(200)",
                oldMaxLength: 200,
                oldNullable: true);
        }
    }
}
