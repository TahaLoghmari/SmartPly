using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedEmailAndUserEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Emails_MessageId",
                table: "Emails");

            migrationBuilder.DropIndex(
                name: "IX_Emails_ReceivedDate",
                table: "Emails");

            migrationBuilder.DropIndex(
                name: "IX_Emails_SentDate",
                table: "Emails");

            migrationBuilder.DropIndex(
                name: "IX_Emails_ThreadId",
                table: "Emails");

            migrationBuilder.DropIndex(
                name: "IX_Emails_UserId_HasAttachments",
                table: "Emails");

            migrationBuilder.DropIndex(
                name: "IX_Emails_UserId_IsImportant",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "AttachmentCount",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "AttachmentIds",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "AttachmentNames",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "AttachmentsTotalSize",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "BccAddresses",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "CcAddresses",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "DeliveredTo",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "Encoding",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "HasAttachments",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "HistoryId",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "HtmlBody",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "Importance",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "InReplyTo",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "ListId",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "MessageId",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "MimeType",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "ReceivedDate",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "References",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "ReplyToAddress",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "ReturnPath",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "SentDate",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "SizeEstimate",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "TextBody",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "ThreadId",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "XMailer",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "LastHistoryId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "Subject",
                table: "Emails",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);

            migrationBuilder.AddColumn<long>(
                name: "InternalDate",
                table: "Emails",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Emails_InternalDate",
                table: "Emails",
                column: "InternalDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Emails_InternalDate",
                table: "Emails");

            migrationBuilder.DropColumn(
                name: "InternalDate",
                table: "Emails");

            migrationBuilder.AlterColumn<string>(
                name: "Subject",
                table: "Emails",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000);

            migrationBuilder.AddColumn<int>(
                name: "AttachmentCount",
                table: "Emails",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "AttachmentIds",
                table: "Emails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AttachmentNames",
                table: "Emails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<long>(
                name: "AttachmentsTotalSize",
                table: "Emails",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<string>(
                name: "BccAddresses",
                table: "Emails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CcAddresses",
                table: "Emails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "Emails",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DeliveredTo",
                table: "Emails",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Encoding",
                table: "Emails",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "HasAttachments",
                table: "Emails",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "HistoryId",
                table: "Emails",
                type: "numeric(20,0)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HtmlBody",
                table: "Emails",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Importance",
                table: "Emails",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "InReplyTo",
                table: "Emails",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ListId",
                table: "Emails",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MessageId",
                table: "Emails",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "MimeType",
                table: "Emails",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Priority",
                table: "Emails",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReceivedDate",
                table: "Emails",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "References",
                table: "Emails",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ReplyToAddress",
                table: "Emails",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ReturnPath",
                table: "Emails",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "SentDate",
                table: "Emails",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SizeEstimate",
                table: "Emails",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TextBody",
                table: "Emails",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThreadId",
                table: "Emails",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "XMailer",
                table: "Emails",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "LastHistoryId",
                table: "AspNetUsers",
                type: "numeric(20,0)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Emails_MessageId",
                table: "Emails",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Emails_ReceivedDate",
                table: "Emails",
                column: "ReceivedDate");

            migrationBuilder.CreateIndex(
                name: "IX_Emails_SentDate",
                table: "Emails",
                column: "SentDate");

            migrationBuilder.CreateIndex(
                name: "IX_Emails_ThreadId",
                table: "Emails",
                column: "ThreadId");

            migrationBuilder.CreateIndex(
                name: "IX_Emails_UserId_HasAttachments",
                table: "Emails",
                columns: new[] { "UserId", "HasAttachments" });

            migrationBuilder.CreateIndex(
                name: "IX_Emails_UserId_IsImportant",
                table: "Emails",
                columns: new[] { "UserId", "IsImportant" });
        }
    }
}
