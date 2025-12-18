import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CourseModel, SectionModel, LessonModel, LessonType } from "../model/CourseModel";
import { getCourseDetail } from "../api/CourseAPI";

// Modular Components
import { LearningHeader, LearningSidebar, ReadingLesson, VideoLesson, QuizLesson, CodingLesson } from "../components/learning";

import "../style/CourseLearningPage.css";

export default function CourseLearningPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonModel | null>(null);
  const [currentSection, setCurrentSection] = useState<SectionModel | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [readingProgress, setReadingProgress] = useState(0);

  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      loadCourseDetail();
    }
  }, [slug]);

  useEffect(() => {
    if (course && course.sections && course.sections.length > 0) {
      const firstSection = course.sections[0];
      setExpandedSections(new Set([firstSection.sectionId]));

      if (!currentLesson && firstSection.lessons && firstSection.lessons.length > 0) {
        const firstLesson = firstSection.lessons.sort((a, b) => a.lessonOrder - b.lessonOrder)[0];
        setCurrentLesson(firstLesson);
        setCurrentSection(firstSection);
      }
    }
  }, [course]);

  // Handle scroll progress for reading lessons
  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current && currentLesson?.lessonType === LessonType.READING) {
        const element = mainContentRef.current;
        const totalHeight = element.scrollHeight - element.clientHeight;
        const currentScroll = element.scrollTop;
        if (totalHeight > 0) {
          setReadingProgress((currentScroll / totalHeight) * 100);
        }
      }
    };

    const container = mainContentRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [currentLesson]);

  // Reset progress when switching lessons
  useEffect(() => {
    setReadingProgress(0);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [currentLesson]);

  const loadCourseDetail = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getCourseDetail(slug);
      setCourse(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải chi tiết khóa học");
      console.error("Error loading course detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleLessonClick = (lesson: LessonModel, section: SectionModel) => {
    setCurrentLesson(lesson);
    setCurrentSection(section);
  };

  const toggleComplete = (lessonId: number) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
  };

  const allLessonItems = useMemo(() => {
    if (!course) return [];
    const all: Array<{ lesson: LessonModel; section: SectionModel }> = [];
    [...(course.sections || [])]
      .sort((a, b) => a.sectionOrder - b.sectionOrder)
      .forEach((section) => {
        if (section.lessons) {
          [...section.lessons]
            .sort((a, b) => a.lessonOrder - b.lessonOrder)
            .forEach((lesson) => {
              all.push({ lesson, section });
            });
        }
      });
    return all;
  }, [course]);

  const getNextLesson = () => {
    if (!currentLesson) return null;
    const currentIndex = allLessonItems.findIndex(
      (item) => item.lesson.lessonId === currentLesson.lessonId
    );
    if (currentIndex < allLessonItems.length - 1) {
      return allLessonItems[currentIndex + 1];
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!currentLesson) return null;
    const currentIndex = allLessonItems.findIndex(
      (item) => item.lesson.lessonId === currentLesson.lessonId
    );
    if (currentIndex > 0) {
      return allLessonItems[currentIndex - 1];
    }
    return null;
  };

  const getProgressPercentage = () => {
    const total = allLessonItems.length;
    if (total === 0) return 0;
    return Math.round((completedLessons.size / total) * 100);
  };

  const nextLesson = getNextLesson();
  const prevLesson = getPreviousLesson();

  if (loading) {
    return (
      <div className="course-learning-page d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="course-learning-page d-flex align-items-center justify-content-center p-4">
        <div className="alert alert-danger" role="alert">
          {error || "Không tìm thấy khóa học"}
        </div>
      </div>
    );
  }

  return (
    <div className="course-learning-page">
      <LearningHeader
        courseTitle={course.title}
        progressPercentage={getProgressPercentage()}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        onLessonClick={handleLessonClick}
        onBack={() => navigate(`/courses/${slug}`)}
      />

      <div className="learning-layout">
        <LearningSidebar
          sections={course.sections || []}
          currentLessonId={currentLesson?.lessonId}
          completedLessons={completedLessons}
          expandedSections={expandedSections}
          onToggleSection={toggleSection}
          onLessonClick={handleLessonClick}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="learning-main" ref={mainContentRef}>
          {currentLesson?.lessonType === LessonType.READING ? (
            <ReadingLesson
              currentLesson={currentLesson}
              course={course}
              currentSection={currentSection}
              completedLessons={completedLessons}
              onToggleComplete={toggleComplete}
              readingProgress={readingProgress}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onLessonClick={handleLessonClick}
            />
          ) : currentLesson?.lessonType === LessonType.QUIZ ? (
            <QuizLesson
              currentLesson={currentLesson}
              course={course}
              currentSection={currentSection}
              onToggleComplete={toggleComplete}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
              onLessonClick={handleLessonClick}
            />
          ) : (
            currentLesson && (
              currentLesson.lessonType === LessonType.CODING ? (
                <CodingLesson
                  currentLesson={currentLesson}
                  course={course}
                  currentSection={currentSection}
                  onToggleComplete={toggleComplete}
                  prevLesson={prevLesson}
                  nextLesson={nextLesson}
                  onLessonClick={handleLessonClick}
                />
              ) : (
                <VideoLesson
                  currentLesson={currentLesson}
                  currentSection={currentSection}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  nextLesson={nextLesson}
                  onLessonClick={handleLessonClick}
                />
              )
            )
          )}
        </main>
      </div>
    </div>
  );
}
