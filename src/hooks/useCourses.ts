import { useCallback, useEffect, useState } from "react";

import { CourseModel } from "../model/CourseModel";
import { createCourse, deleteCourse, getAllCourses, updateCourse } from "../api/CourseAPI";


export function useCourses(initialPage = 0, initialSize = 10) {
  const [courses, setCourses] = useState<CourseModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [size] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await getAllCourses(p, size);
      setCourses(res.result);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => { load(page); }, [load, page]);

  const refresh = () => load(page);

  const addCourse = async (data: Partial<CourseModel>) => {
    try {
      const created = await createCourse(data);
      await load(0);
      return created;
    } catch (err) {
      throw err;
    }
  };

  const editCourse = async (id: number, data: Partial<CourseModel>) => {
    try {
      const updated = await updateCourse(id, data);
      await load(page);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const removeCourse = async (id: number) => {
    try {
      await deleteCourse(id);
      await load(page);
    } catch (err) {
      throw err;
    }
  };

  return {
    courses,
    loading,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    refresh,
    addCourse,
    editCourse,
    removeCourse,
  };
}






