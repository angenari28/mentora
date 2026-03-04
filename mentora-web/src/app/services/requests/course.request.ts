export interface CourseRequest {
  categoryId: string;
  workspaceId: string;
  name: string;
  showCertificate: boolean;
  active: boolean;
  faceImage: string;
  certificateImage: string;
  workloadHours: number;
}
