export interface CourseSlideResponse {
  id: string;
  courseId: string;
  courseName: string;
  slideTypeId: string;
  slideTypeName: string;
  title: string;
  content: string;
  ordering: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
