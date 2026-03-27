export interface CourseSlideTimeApiResponse {
  id: string;
  courseSlideId: string;
  dateStart: string;
  dateEnd: string | null;
  createdAt: string;
  updatedAt: string;
}
