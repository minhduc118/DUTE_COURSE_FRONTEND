import { useCallback, useEffect, useState } from "react";

import { UserModel } from "../model/UserModel";
import { createUser, deleteUser, getAllUser, updateUser } from "../api/UserAPI";


export function useUsers(initialPage = 0, initialSize = 10) {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [size] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await getAllUser(p, size);
      setUsers(res.result);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => { load(page); }, [load, page]);

  const refresh = () => load(page);

  const addUser = async (data: Partial<UserModel>) => {
    try {
      const created = await createUser(data);
      // after create, reload current page (or go to first page)
      await load(0);
      return created;
    } catch (err) {
      throw err;
    }
  };

  const editUser = async (id: number, data: Partial<UserModel>) => {
    try {
      const updated = await updateUser(id, data);
      await load(page);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const removeUser = async (id: number) => {
    try {
      await deleteUser(id);
      // reload page (if last item on page removed, backend may return fewer items)
      await load(page);
    } catch (err) {
      throw err;
    }
  };

  return {
    users,
    loading,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    refresh,
    addUser,
    editUser,
    removeUser,
  };
}