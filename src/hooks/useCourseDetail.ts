import { useCallback, useEffect, useState } from "react";

import {
  CourseModel,
  LessonModel,
  SectionModel,
} from "../model/CourseModel";
import {
  getCourseDetail,
  createSection,
  updateSection,
  deleteSection,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../api/CourseAPI";

export function useCourseDetail(slug?: string) {
  const [course, setCourse] = useState<CourseModel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCourseDetail(slug);
      console.log("load course", data);
      setCourse(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load course detail");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = () => load();

  const addSection = async (data: Partial<SectionModel>) => {
    if (!slug) return;
    await createSection(slug, data);
    await load();
  };

  const editSection = async (sectionId: number, data: Partial<SectionModel>) => {
    await updateSection(sectionId, data);
    await load();
  };

  const removeSection = async (sectionId: number) => {
    await deleteSection(sectionId);
    await load();
  };

  const addLesson = async (
    sectionId: number,
    data: Partial<LessonModel>
  ) => {
    await createLesson(sectionId, data);
    await load();
  };

  const editLesson = async (lessonId: number, data: Partial<LessonModel>) => {
    await updateLesson(lessonId, data);
    await load();
  };

  const removeLesson = async (lessonId: number) => {
    await deleteLesson(lessonId);
    await load();
  };

  return {
    course,
    loading,
    error,
    refresh,
    addSection,
    editSection,
    removeSection,
    addLesson,
    editLesson,
    removeLesson,
  };
}




