using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mentora.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Incremental_0001 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SlideTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Icon = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SlideTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Workspaces",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Logo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PrimaryColor = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    SecondaryColor = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    BigBanner = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SmallBanner = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    Url = table.Column<string>(type: "varchar", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workspaces", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkspaceId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Categories_Workspaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "Workspaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    WorkspaceId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Workspaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "Workspaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkspaceId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ShowCertificate = table.Column<bool>(type: "boolean", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    FaceImage = table.Column<string>(type: "varchar", nullable: false),
                    CertificateImage = table.Column<string>(type: "varchar", nullable: false),
                    WorkloadHours = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Courses_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Courses_Workspaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "Workspaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Classes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    WorkspaceId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    DateStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Classes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Classes_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Classes_Workspaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "Workspaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CourseSlides",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    SlideTypeId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Content = table.Column<string>(type: "varchar", nullable: false),
                    Ordering = table.Column<int>(type: "integer", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseSlides", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseSlides_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CourseSlides_SlideTypes_SlideTypeId",
                        column: x => x.SlideTypeId,
                        principalTable: "SlideTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClassStudents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClassId = table.Column<Guid>(type: "uuid", nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClassStudents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ClassStudents_Classes_ClassId",
                        column: x => x.ClassId,
                        principalTable: "Classes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClassStudents_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CourseSlidesTimes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseSlideId = table.Column<Guid>(type: "uuid", nullable: false),
                    DateStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseSlidesTimes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseSlidesTimes_CourseSlides_CourseSlideId",
                        column: x => x.CourseSlideId,
                        principalTable: "CourseSlides",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "SlideTypes",
                columns: new[] { "Id", "Active", "CreatedAt", "Icon", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("a1b2c3d4-0001-0000-0000-000000000001"), true, new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc), "", "Texto", new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("a1b2c3d4-0001-0000-0000-000000000002"), true, new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc), "", "Imagem", new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("a1b2c3d4-0001-0000-0000-000000000003"), true, new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc), "", "PPT", new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("a1b2c3d4-0001-0000-0000-000000000004"), true, new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc), "", "Vídeo", new DateTime(2026, 3, 11, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Workspaces",
                columns: new[] { "Id", "Active", "BigBanner", "CreatedAt", "Logo", "Name", "PrimaryColor", "SecondaryColor", "SmallBanner", "UpdatedAt", "Url" },
                values: new object[] { new Guid("0097e236-eb5d-4858-9f23-4522833c865c"), true, "", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), "", "Mentora Workspace", "", "", "", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), "" });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Active", "CreatedAt", "Name", "UpdatedAt", "WorkspaceId" },
                values: new object[] { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"), true, new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), "Tecnologia", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("0097e236-eb5d-4858-9f23-4522833c865c") });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "IsActive", "LastLoginAt", "Name", "PasswordHash", "Role", "UpdatedAt", "WorkspaceId" },
                values: new object[,]
                {
                    { new Guid("935580d8-2fd7-4113-ba2b-b5034bf64112"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), "master@email.com", true, null, "Master Administrador", "AAAAAAAAAAAAAAAAAAAAAA==.Su9Ho03CNSLtGNeCDZyJlSdYk1UEJ0BXEy5uTE8cKXo=", 3, new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("0097e236-eb5d-4858-9f23-4522833c865c") },
                    { new Guid("e1f2a3b4-c5d6-7890-ef01-234567890001"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), "andre@email.com", true, null, "Andre Genari", "nJEt6jds6iAP612V325Rkg==.zwkNj4/nrFV44syzfeKqbgmt8Qn9o5ZBBpvc2eoW7ho=", 1, new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("0097e236-eb5d-4858-9f23-4522833c865c") },
                    { new Guid("f2a3b4c5-d6e7-8901-f023-456789000002"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), "painel@email.com", true, null, "Painel", "aUbY3VWTfZgbydlHIJY63w==.V8jOFtonbdsr+9LiyYLqvoB93BpznQVtB3DAX4NyQ0E=", 2, new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("0097e236-eb5d-4858-9f23-4522833c865c") }
                });

            migrationBuilder.InsertData(
                table: "Courses",
                columns: new[] { "Id", "Active", "CategoryId", "CertificateImage", "CreatedAt", "FaceImage", "Name", "ShowCertificate", "UpdatedAt", "WorkloadHours", "WorkspaceId" },
                values: new object[] { new Guid("b1c2d3e4-f5a6-7890-bcde-f12345678901"), true, new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"), "", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), "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vvHmhRde/OZb03L58MTjj6upqeGNoohq2fLlc2bNnjVrxpw5M2fNnvnxzI9nzZqBSEEYnHjCcYEKpr07PQiDncaN2WyzzfhWKofZIAjCMJcPw0AFpNladTHSmuAHP/h+bXWPPb7ylR13HGtagypQvKNGoUKlWtva5s6ZO2v2zBmzZsycPXPWrJmfzP0kQMVDXR3pYhQN33z4ueecLavtBHxHkl8JwTpDQrO5VTTap3efCYcdhoATJz30iyuumvvJJwsWLXz+hRfP/N7Za9aua2xsPPWbJ8seOAREjDS1R1GhWChGUUQRERDpEcOHX3PVVbyPCIj4fkdVTfXJJ30DCJ574cVLLrtszpy5ixYtfuXVV8886/vr17XU1tWdfto3g1Ahotako2jup/Nmzp49e87st95687LLfvzqq1MB1dFfPaq5uVd7VGwrtBd1tHTZspmzZ86eM3P2nBlz58ycPWfm4sULNUW3/+XPF19yydSpU1vb2h+4//4Vy5etXLn8nrvv/vCjjwlom5EjAeGll17++RVXH3LYYf+4666FixauWLnijTfeWL1mTS6X32TIULF23yd4FkTS8fHU12Rgj0CZGriZr/gYYmK8DQCxwAKy4zUeONBRAgAerqQcMguEIPsODc/Cv180XpFrDPeksXw8lhBifNscza0+tJ0P4u//8Iff3XYboFRfXdXjxOOPPfzwwzRQgKiCAJV68pnnHnviSV6KZYIH7Df+xGOPWbp0WZjP//XOu+/4x51EMt1DVEccPaFP397LPluKConoplt+C7f8hpgxRKXU/5xx+vHHHRsVi4VCe6GoNUFAgKBGjdzm/LPPvv6mmwpRRJHmygJUAHDQAQf88le/bmuPioX2vfbcw8gdEWHzzUdcdfnlF11y6cczZ33ru2dp0KgJCXrUVH/zlJMPPewQxTfZwgCVmvrmW8efdIpssgQCgMbG+scfeigMw7323OPGG365urU1iqK99txD82vYEIlIE+liFARBqFRVEObCnMxElQox6NO7z+OPPsLbQQoFXShGhUIhCAKFmFNKqQABlixdfvTxJypACd8Kq/JVTz/+qNYURToKICIAhAkTDn9n2ruTH5kS6SgqFs1AMkDQoVKoKCpGpEWtvDn7RxdfiEAPTH5o8pRHJj30sEYAAoXYs1fPiy84f9CgwWI3vNzDn7MnYM45NgHg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iUhrOvTgw1asWBGGoQqDAJUG/bPLLv3FlVe3rG9po0iBCvPhgw/ct2jhwl9cfsXsuXOrqqrWrlmz047jbrju2ly+R9c151tiJVpLw4YOHwnXqACysO0bNgHwnkVDCPmOQyY8A06P9i1ZWWOHWNcZo2iEQPJgTya8tTrIGpczDRlUkDdI8qoyjACP8cCrO0bPp2+HKTKQ9FI6C0snKYBOgpthhswV2hBpIoBrr73+0UefvOWWmydOuv/Jp58YMmTwjy6+pFBoRwBU8rmkgF8DFYYA8v6S3r16Pf7olEemTL7n7n/UVNdcdfU1xaj4+9/fpqPo9tv/+MQTj9999z9G77BD7169AsBrrrr65RdfuumXNzz44AOTJt7fv1/fH5597oL58+UuN0ChWPjHnXf+6fY7Tj/91Lvv/sfzzz112CEH/epXt6xevfLjjz669prr99ln77vvuevJJx+/5EcX3XXXPQ/c/4Am0FoD4qOPPr5o4UKFhAitLevuuuueMOQHmohAbzZ8symPTH744Ul3/e2vSxYuufXWW0EDvyiAN+wqgABUqDCfy3392K899eRjTzw65fFHH37skYd3/cpX/vqXP5184te33nrYBRec+9CDD+hi4dJLLmtqavr7X//y6JSHfvfb33wy99Mf/vA8LbdjuwRnPxVpLQPsCJnWWI5kkmHPBRwReweV85eyLN74R2aFLwmvFM+qUtV7M0UP/HbMND0B2hBiSjlO3QDd814mZWriMYZpMkkGf0oo+fnYpsariaGEeNJIU6i8aEIgFRf0QQjvT3/vmWeeO/30b47ablQ+n6+rqfnpT358222/D8N8oIKqMGQnktq0bi+0txaL7cVia1sLKKVy+b79+u+6y84zZsyKisVP580LgoAfQdt002Hf//73GhoaP5w+/aUXX/nB2d/bfrvtc1X53n37XHHVlRro7rvu0ToiAK11e1vbXXfdc8wxR004ckJtfX2Qz1940YW//uUNzY1N999z71ZbbvHtb3+7T+/eQS534EEHnXDCcbf85rerV6/WRJqiXr163XzzrxEAiB64/4FCsdDQ2Bgofm9SmK/K19bW1tbWDR46dOedd3xj6huIpCmS93gCT/8wQIWICjFfVZXP58J8Ll+VD3Jhjx5VVT3yG23Wf5NNh/aorpn84OQVy1dcesnFgwcPzuXzO+yww49/cuk/p06d/u679svLlYDHj7L6YNElJW4AKGlICDZFFj7IeIV4dtI5pVRyCQWAFwdjRbhbkmYmw1SKKkNJr5ZMd0gMbUxVAGb+YFMIJHalhyUcJTJY8VtbqhrJlfbmsohT6BQ6nnc5sF8kUwkAgD748EMC2H33r7CaAbC2tnbAgP65IMiFYSCrIkhE8nYATTxeUEpFUVFHxZb16z768ONNhg6uqa455KCDFi1cfMKJJ/321lunvf02bx1/a9rbdfV1e+21F9cbadCIO+447qUXXxKbQXz/gw8XL1kyZvT2siFPEwFsvtVWQPDGW2/tussutbXVAAQEEdE+e++9avXqd96dFhWjqBidfdZ3n3/h5ffff3/58uV//8ddXzv6qOoeeUAMEOXVQQoRaN2a1Z988umQwUNYIPwcJgBoeWMzAcJbb759882/vummX11/3Q0vvvBCexQFQViVzwW1+UEDNwbS06a9s+022/Tt1y8yTyVtN2pUn96933zzTWtSaVGnwX0sZfgSyh6pLwoxQ2Kb4BRZqiUzHGBvtrn8EsazjOkbMnYcCvxYJUj3bgpU4Cgy7EfvlT4WBGDvyacuCqTLN/WJjrLlSyYKZMAEMpGJ2/wEYEq5lE7przOeXAoxpj16/EKako1qbWnN5XL1DfWWeQTgp+lyYS7SEQ+N+OV9xWIxl8/xztzly1ccf/w3jj/+xJNOOvXDjz/+1hlnEMFxxx175RU/H7HZ8EmTHvqfM79/9DFfnzfv05b16wEwzOcVoiJCTQigtS4UC4jAj22GAQYqyFdVcUehjF8opVrWt+RySp5PII1EGIZEtGbtGkDSpDcbMWLHHcf94sqr/v6PO3O5/AEHHqjZrwBI6/fenX7ccSeecMJJZ5z+7SVLlpxw3LFhEAQqsAs8BKQJ+JHkQlRY8tmSpcuWLV22bPnKlYiIgcpXVYVhrrqmJheExWJUVVUF/Cow3rgPVF9b19LSaiVcStSlYJRl7TL28uzOY4MK88YeIt7HyKQMQQ5Y8Qoy+11xlVS6Nz4glyrxIBv2RTkZe4J4zG/8OxuxsGRGI1LQz0YmD5+m/nHY4EJEiIBAKLE7xXyl+iMEb+hlWCIwEaHSuGBLeoMs7ltKeT5vjBkzZsz69evfe+997t4VoEIFuhgVo9ramhkfzzTeiEQwb978/n36VoVhj6qqqqqqY4756lFHTFi4aOGECYduP3oHTRRFevc997z0x5dOeXjydddcOX/+gr///c6ttx65bu3aeZ9+Kl0aAoKeN2/+iBHDtSZACFUwfPjw2rra96d/CCCN0ZrWrV/fXixutumwd96ZTvwwOyoAmP7uu0rhkKGbakINRARnf++s6dM/+PPtfznppBN71NQUC4X2QqE9KmpNvXr2POjggw868IATjjvub7f/eZttRuZDlQvCUPGIkgBAR7pQjNoKbdtuu+2Pf/Ljn/3sp7+44heHHXJoXqkAoL29raiiAJVCNWLEiHffm66LEYICQh3BRx/N/OTTT4YMGVKppmJwnbwp7lTVGYLOfljj9rTT4MdK3QzeWBL/nx7eG3h8y/9Jn+TNcrw1iy1SrvvHScjL5NiWkxddu5PpMXhXuQ0Z/smBLcWEl8BUfHVJkC5feWm4m4PxliGYiJCc25eCyeUGIDwT44llJogQcdhmm20zcqurrrx61YrlCpFIT5z4wFFHfm358mXbjBr14UcfvfbaP4vFiICmPPTw/IULd9ppR36LV2NjwzFHf/VrX/vaSScc/8c//mnevHlFXfztb2+dM2tmsVgoRDRy220HDx68ZMlnW4/cun+/vuedd2FbaxsBoMJ77rr7o48+Ovroo/mdllpHdbV1++2z1+1/+eusWTMBFSFOf++dIycc+eGHHx5y6CGPP/HUs889C6RDxM8WLbr77nsPOuCATTfZhN+oQ6D7Deh/zFePHLXNyIMPOigMAwSItC5EuhhFzb17Hn/cscefeMKEo47o268/mx7/x8/0EEWaIn6YEAF1FBnbBwWotV63roUn54TwjW+csHLFyuuuu7HQ3kakV61c/ufbb29qbBq3444peyoJT9f2rfgy67SeVonqvehATFZ2MMSMoaIgIg9ca+32XyAPbbg30dxNpQnFblIZRzUcSJoHbmryEFL5LHBtW7uMAksg7bGZsH6RBNo+IKYEaa1ttLTFcp31JadOo/R05fMHEaFSS5cs/vZ3zlq9etVXdtt10eLF7743/YjDDz/zrDMJ9A++/4PXXp+67777tLe1Tp365oQJh/3w7O8D4k03/erJp55+4P57NND6detPPPGkjQdufMP1137/++f885+vjd5hdO/evebNnz971tyf/PSyPfbac8bHM/7nu2fmcuHOO++0eNHij2fMOO3UU7729a/z58yYk0Cp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", "Desenvolvimento node", true, new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), 5, new Guid("0097e236-eb5d-4858-9f23-4522833c865c") });

            migrationBuilder.InsertData(
                table: "Classes",
                columns: new[] { "Id", "Active", "CourseId", "CreatedAt", "DateEnd", "DateStart", "Name", "UpdatedAt", "WorkspaceId" },
                values: new object[] { new Guid("d1e2f3a4-b5c6-7890-def0-123456789001"), true, new Guid("b1c2d3e4-f5a6-7890-bcde-f12345678901"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 7, 1, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 4, 1, 0, 0, 0, 0, DateTimeKind.Utc), "Tecnologia", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("0097e236-eb5d-4858-9f23-4522833c865c") });

            migrationBuilder.InsertData(
                table: "CourseSlides",
                columns: new[] { "Id", "Active", "Content", "CourseId", "CreatedAt", "Ordering", "SlideTypeId", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("c1d2e3f4-a5b6-7890-cdef-012345678901"), true, "O que é: Um ambiente de execução (runtime) de código aberto que permite rodar JavaScript no lado do servidor (back-end).\n\nA Tecnologia Base: Construído sobre a poderosa engine V8 do Google Chrome, que compila o JavaScript diretamente para código de máquina, garantindo alta velocidade.\n\nO Paradigma Full-Stack: Unifica a stack de desenvolvimento, permitindo que as equipes usem a mesma linguagem (JavaScript/TypeScript) tanto no front-end quanto no back-end.", new Guid("b1c2d3e4-f5a6-7890-bcde-f12345678901"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), 1, new Guid("a1b2c3d4-0001-0000-0000-000000000001"), "Introdução ao Node.js", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c1d2e3f4-a5b6-7890-cdef-012345678902"), true, "Modelo Single-Thread: Diferente de servidores tradicionais que criam uma nova thread para cada requisição, o Node opera em uma thread principal (Single-Thread).\n\nI/O Não Bloqueante: Operações demoradas de entrada e saída (como ler um arquivo ou buscar dados no banco) não travam o sistema. A aplicação continua atendendo outras requisições simultaneamente.\n\nO Coração do Node (Event Loop): É o mecanismo responsável por delegar as tarefas pesadas ao sistema operacional e emitir um \"evento\" ou \"callback\" quando elas são concluídas, mantendo a alta escalabilidade e baixo consumo de memória.", new Guid("b1c2d3e4-f5a6-7890-bcde-f12345678901"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), 2, new Guid("a1b2c3d4-0001-0000-0000-000000000001"), "Arquitetura Assíncrona e Event Loop", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c1d2e3f4-a5b6-7890-cdef-012345678903"), true, "Node Package Manager (NPM): O gerenciador de pacotes padrão que já vem instalado junto com o Node.js.\n\nA Maior Biblioteca do Mundo: Dá acesso ao maior repositório de bibliotecas de código aberto do mundo, permitindo que os desenvolvedores não precisem \"reinventar a roda\" em cada projeto.\n\nO Arquivo package.json: O centro de controle do projeto, onde ficam registradas todas as dependências (bibliotecas utilizadas), versões e scripts de automação.", new Guid("b1c2d3e4-f5a6-7890-bcde-f12345678901"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), 3, new Guid("a1b2c3d4-0001-0000-0000-000000000001"), "O Ecossistema e o NPM", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c1d2e3f4-a5b6-7890-cdef-012345678904"), true, "Express.js: O padrão de mercado para construção de servidores. É minimalista, flexível e facilita muito a criação de rotas e integração com bancos de dados.\n\nNestJS: Um framework mais robusto e opinativo (com regras de arquitetura bem definidas), muito usado em aplicações corporativas complexas. Tem suporte nativo ao TypeScript.\n\nFastify: Uma alternativa em grande ascensão, focada em entregar a mais alta performance e velocidade no processamento das requisições.", new Guid("b1c2d3e4-f5a6-7890-bcde-f12345678901"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), 4, new Guid("a1b2c3d4-0001-0000-0000-000000000001"), "Principais Frameworks", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("c1d2e3f4-a5b6-7890-cdef-012345678905"), true, "APIs Rápidas e Escaláveis: Ideal para construir APIs RESTful ou GraphQL que servem dados em formato JSON para aplicações web e mobile.\n\nAplicações em Tempo Real: Excelente para sistemas de chat, streaming de dados, plataformas de colaboração ao vivo e jogos multiplayer, geralmente utilizando tecnologias como WebSockets.\n\nArquitetura de Microsserviços: Sua leveza torna o Node.js perfeito para criar aplicações modernas baseadas em pequenos serviços independentes que se comunicam entre si.", new Guid("b1c2d3e4-f5a6-7890-bcde-f12345678901"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), 5, new Guid("a1b2c3d4-0001-0000-0000-000000000001"), "Casos de Uso Ideais (Onde o Node Brilha)", new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "ClassStudents",
                columns: new[] { "Id", "Active", "ClassId", "CreatedAt", "UpdatedAt", "UserId" },
                values: new object[] { new Guid("f1a2b3c4-d5e6-7890-f012-345678900001"), true, new Guid("d1e2f3a4-b5c6-7890-def0-123456789001"), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), new DateTime(2026, 1, 23, 0, 0, 0, 0, DateTimeKind.Utc), new Guid("e1f2a3b4-c5d6-7890-ef01-234567890001") });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_WorkspaceId",
                table: "Categories",
                column: "WorkspaceId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_CourseId",
                table: "Classes",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Classes_WorkspaceId",
                table: "Classes",
                column: "WorkspaceId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassStudents_ClassId",
                table: "ClassStudents",
                column: "ClassId");

            migrationBuilder.CreateIndex(
                name: "IX_ClassStudents_UserId_ClassId",
                table: "ClassStudents",
                columns: new[] { "UserId", "ClassId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CategoryId",
                table: "Courses",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_WorkspaceId",
                table: "Courses",
                column: "WorkspaceId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseSlides_CourseId",
                table: "CourseSlides",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseSlides_SlideTypeId",
                table: "CourseSlides",
                column: "SlideTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseSlidesTimes_CourseSlideId",
                table: "CourseSlidesTimes",
                column: "CourseSlideId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_WorkspaceId",
                table: "Users",
                column: "WorkspaceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClassStudents");

            migrationBuilder.DropTable(
                name: "CourseSlidesTimes");

            migrationBuilder.DropTable(
                name: "Classes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "CourseSlides");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "SlideTypes");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Workspaces");
        }
    }
}
