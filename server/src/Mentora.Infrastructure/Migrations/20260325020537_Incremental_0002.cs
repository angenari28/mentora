using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mentora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Incremental_0002 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseSlides_Courses_CourseId1",
                table: "CourseSlides");

            migrationBuilder.DropIndex(
                name: "IX_CourseSlides_CourseId1",
                table: "CourseSlides");

            migrationBuilder.DropColumn(
                name: "CourseId1",
                table: "CourseSlides");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CourseId1",
                table: "CourseSlides",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CourseSlides_CourseId1",
                table: "CourseSlides",
                column: "CourseId1");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseSlides_Courses_CourseId1",
                table: "CourseSlides",
                column: "CourseId1",
                principalTable: "Courses",
                principalColumn: "Id");
        }
    }
}
