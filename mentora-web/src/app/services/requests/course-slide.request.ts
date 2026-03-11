export interface CourseSlideRequest {
  courseId: string;
  slideTypeId: string;
  title: string;
  content: string;
  ordering: number;
  active: boolean;
}
