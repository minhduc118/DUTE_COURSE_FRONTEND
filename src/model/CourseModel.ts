export enum LessonType {
  VIDEO = 'VIDEO',
  READING = 'READING',
  QUIZ = 'QUIZ',
  CODING = 'CODING'
}

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

  // New Metadata
  videoLessonCount?: number;
  readingLessonCount?: number;
  quizLessonCount?: number;
  codingLessonCount?: number;
  progressPercentage?: number;

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
  lessonType!: LessonType;
  durationSeconds?: number;
  courseId?: number;
  isPreview!: boolean;
  isLocked!: boolean;

  // Conditional fields
  youtubeUrl?: string;     // Only for VIDEO
  readingContent?: string; // Only for READING

  constructor(init?: Partial<LessonModel>) {
    Object.assign(this, init);
  }
}

// --- Quiz Interfaces ---
export interface OptionRequest {
  content: string;
  isCorrect: boolean;
}

export interface QuestionRequest {
  content: string;
  options: OptionRequest[];
}

export interface QuizRequest {
  title: string;
  questions: QuestionRequest[];
  timeLimitSeconds: number;
  passingScore: number;
  maxAttempts: number;
}

// --- Coding Interfaces ---
export interface TestCaseRequest {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CodingExerciseRequest {
  title: string;
  problemStatement: string;
  language: string;
  starterCode: string;
  testCases: TestCaseRequest[];
}
