using Mentora.Domain;

namespace Mentora.Domain.Entities;

public class Course : EntityGuidBase
{
    public Guid CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool ShowCertificate { get; set; }
    public bool Active { get; set; }
    public string FaceImage { get; set; } = string.Empty;
    public string CertificateImage { get; set; } = string.Empty;
    public int WorkloadHours { get; set; }

    public Category Category { get; set; } = null!;
}
