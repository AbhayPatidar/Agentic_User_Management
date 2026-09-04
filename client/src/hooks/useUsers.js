import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export function useUsers({ limit = 10, status = "" } = {}) {
  const [users, setUsers]           = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetchUsers = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: p, limit };
      if (status) params.status = status;
      const { data } = await axios.get("/api/users", { params });
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [limit, status]);

  // Reset to page 1 when filter changes
  useEffect(() => { setPage(1); }, [status]);

  useEffect(() => { fetchUsers(page); }, [page, fetchUsers]);

  return {
    users, total, totalPages, page, setPage,
    loading, error,
    refetch: () => fetchUsers(page),
  };
}
