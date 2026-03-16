export interface StudentClassesResponse {
  classId: string;
  className: string;
  dateStart: string;
  dateEnd: string;
  classActive: boolean;
  course: CourseDetail;
}

export interface CourseDetail {
  id: string;
  name: string;
  faceImage: string;
  workloadHours: number;
  active: boolean;
  category: CategoryDetail;
  slides: SlideDetail[];
}

export interface CategoryDetail {
  id: string;
  name: string;
}

export interface SlideDetail {
  id: string;
  title: string;
  content: string;
  slideTypeName: string;
  ordering: number;
  active: boolean;
}
