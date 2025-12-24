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
  introduction?: string;

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
  quizId?: number;
  codingExerciseId?: number;
  isPreview!: boolean;
  isLocked!: boolean;
  isCompleted?: boolean; // User progress status

  // Conditional fields
  youtubeUrl?: string;     // Only for VIDEO
  readingContent?: string; // Only for READING

  constructor(init?: Partial<LessonModel>) {
    Object.assign(this, init);
  }
}

// --- Quiz Interfaces ---
export interface QuizOptionRequest {
  optionId?: number;
  optionText: string;
  optionOrder: number;
  isCorrect: boolean;
}

export interface QuizQuestionRequest {
  questionId?: number;
  questionText: string;
  questionOrder: number;
  points?: number;
  options: QuizOptionRequest[];
}

export interface QuizRequest {
  quizId?: number;
  title: string;
  timeLimitSeconds?: number;
  passingScore?: number;
  maxAttempts?: number;
  questions: QuizQuestionRequest[];
}

// --- Quiz Start & Submit Interfaces ---
export interface QuizStartResponse {
  attemptId: number;
  quizId: number;
  title: string;
  timeLimitSeconds: number;
  totalQuestions: number;
  startedAt: string;
  expiresAt: string;
  maxAttemptReached?: boolean;
  maxAttempts?: number;
  usedAttempts?: number;
}

export interface QuizAnswerRequest {
  questionId: number;
  selectedOptionIds: number[];
}

export interface QuizSubmitRequest {
  answers: QuizAnswerRequest[];
}

export interface QuizAttemptResponse {
  attemptId: number;
  quizId: number;
  userId: number;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  earnedPoints: number;
  totalPoints: number;
  startedAt: string;
  submittedAt: string;
  expired: boolean;
}

// --- Coding Interfaces ---
export interface TestCaseRequest {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  testOrder: number;
}

export interface CodingExerciseRequest {
  title: string;
  problemStatement: string;
  instructions?: string;
  timeLimitSeconds?: number;
  language: string;
  starterCode: string;
  testCases: TestCaseRequest[];
}

export interface CodingExerciseResponse extends CodingExerciseRequest {
  exerciseId: number;
}

// --- Coding Submission ---
export interface CodingSubmissionRequest {
  sourceCode: string;
}

export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  isPassed?: boolean;
  passed?: boolean; // Backend returns this
  isHidden: boolean;
  hidden?: boolean; // Backend might return this
  executionTimeMs?: number;
  errorMessage?: string; // For runtime/compilation errors specific to a case if applicable, or general output
}

export interface CodingSubmissionResponse {
  submissionId?: number;
  success: boolean; // Overall success of the submission process
  status?: string; // 'PASSED', 'FAILED'
  message?: string; // "Compilation Error", "Accepted", "Wrong Answer"
  results: TestCaseResult[];
  totalPassed: number;
  totalTestCases: number;
  compileOutput?: string; // If compilation fails
}

export interface LessonProgressUpdate {
  completed?: boolean;
  watchedSeconds?: number;
  secondsWatched?: number;
  quizScore?: number;
  quizPassed?: boolean;
  codingPassed?: boolean;
  lastPingAt?: string;
}

export interface LessonProgressResponse {
  watchedSeconds: number;
  isCompleted: boolean;
  quizScore?: number;
  quizPassed?: boolean;
  codingPassed?: boolean;
}
