export class CourseModel {
  courseId!: number;
  title!: string;
  slug!: string;
  description?: string;
  benefits?: string;
  price!: number;
  discountPrice?: number;
  thumbnailBase64?: string;
  status!: string;
  createdAt!: string;
  updatedAt?: string;
  sections?: SectionModel[];
  isOwner?: boolean;
  averageRating?: number;
  numberLessons?: number;
  durationSeconds?: number;
  durationInMonths?: number;

  constructor(init?: Partial<CourseModel>) {
    Object.assign(this, init);
  }
}

export class SectionModel {
  sectionId!: number;
  courseId!: number;
  course?: CourseModel;
  title!: string;
  sectionOrder!: number;
  lessons?: LessonModel[];

  constructor(init?: Partial<SectionModel>) {
    Object.assign(this, init);
  }
}

export class LessonModel {
  lessonId!: number;
  sectionId!: number;
  section?: SectionModel;
  title!: string;
  lessonOrder!: number;
  youtubeUrl!: string;
  durationSeconds?: number;
  courseId?: number;
  isPreview!: boolean;
  isLocked!: boolean;

  constructor(init?: Partial<LessonModel>) {
    Object.assign(this, init);
  }
}
