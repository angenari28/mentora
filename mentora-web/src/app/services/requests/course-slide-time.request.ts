export interface CourseSlideTimeCreateRequest {
  userId: string;
  courseSlideId: string;
  dateStart: string;
}

export interface CourseSlideTimeEndRequest {
  dateEnd: string;
}
