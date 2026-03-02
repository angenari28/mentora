namespace Mentora.Application.DTOs;

public record CourseResponse
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public Guid WorkspaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool ShowCertificate { get; set; }
    public bool Active { get; set; }
    public string FaceImage { get; set; } = string.Empty;
    public string CertificateImage { get; set; } = string.Empty;
    public int WorkloadHours { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
