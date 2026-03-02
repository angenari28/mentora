namespace Mentora.Application.DTOs;

public record CourseRequest
{
    public Guid CategoryId { get; set; }
    public Guid WorkspaceId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool ShowCertificate { get; set; }
    public bool Active { get; set; } = true;
    public string FaceImage { get; set; } = string.Empty;
    public string CertificateImage { get; set; } = string.Empty;
    public int WorkloadHours { get; set; }
}
