import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useCrud(baseUrl, token) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Func principal q se comunica con el backend
  const apiFetch = useCallback(
    async (url, options = {}) => {
      const res = await fetch(url, {
        ...options, // totalmente custom para agregar body y demas
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          ...options.headers,
        },
      });

      if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error(`Error ${res.status}`);
      }

      return res.json();
    },
    [token, navigate]
  );

  const getAll = useCallback(async () => {
    const data = await apiFetch(baseUrl, { method: "GET" });
    if (data) setItems(data);
  }, [apiFetch, baseUrl]);

  const create = useCallback(
    async (item) => {
      await apiFetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(item),
      });
      await getAll();
    },
    [apiFetch, baseUrl, getAll]
  );

  const update = useCallback(
    async (id, item) => {
      await apiFetch(`${baseUrl}/${id}`, {
        method: "PUT",
        body: JSON.stringify(item),
      });
      await getAll();
    },
    [apiFetch, baseUrl, getAll]
  );

  const remove = useCallback(
    async (id) => {
      await apiFetch(`${baseUrl}/${id}`, { method: "DELETE" });
      await getAll();
    },
    [apiFetch, baseUrl, getAll]
  );

  // devovlemos items: articulos y las func crud
  return { items, getAll, create, update, remove };
}
