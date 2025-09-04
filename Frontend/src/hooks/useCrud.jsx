import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useCrud(baseUrl, token) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // Func principal q se comunica con el backend
  const apiFetch = useCallback(
    async (url, options = {}) => {
      // Verificar si el body es FormData (para manejar archivos)
      const isFormData = options.body instanceof FormData;

      const res = await fetch(url, {
        ...options, // totalmente custom para agregar body y demás
        headers: {
          Authorization: token, // siempre incluir el token de autorización
          ...(isFormData ? {} : { "Content-Type": "application/json" }), // Si es FormData, no establecer Content-Type
          ...options.headers, // headers adicionales que pueda pasar el usuario
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

  // Obtener todos los artículos
  const getAll = useCallback(async () => {
    const data = await apiFetch(baseUrl, { method: "GET" });
    if (data) setItems(data);
  }, [apiFetch, baseUrl]);

  // Crear un artículo
  const create = useCallback(
    async (item) => {
      const archivo = item.imagen;
      delete item.imagen;

      // Paso 1: Crear el artículo
      const createdItem = await apiFetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(item),
      });

      // Paso 2: Verificamos si hay imagen para subir
      if (archivo) {
        try {
          // Subir la imagen a S3
          const formData = new FormData();
          formData.append("file", archivo);
          formData.append("id", createdItem._id); // Usamos el id generado de Mongo

          // Paso 3: Enviar la imagen al backend para que se suba a S3
          const img = await apiFetch(`http://localhost:1234/api/files`, {
            method: "POST",
            body: formData, // No se necesita Content-Type, ya que es un FormData
          });
          console.log("📂 Respuesta del backend al subir imagen:", img);

          //Paso 4: Actualizar el articulo con la url de la imagen
          const updatedItem = { ...item, url: img.url };
          console.log("objeto a actulizar", updatedItem);
          await update(createdItem._id, updatedItem);
        } catch (err) {
          console.error("Error en subida de imagen o update:", err);
        }
      }

      // Paso 5: Obtener todos los artículos después de la creación y subida
      await getAll();
    },
    [apiFetch, baseUrl, getAll]
  );

  // Actualizar un artículo
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

  // Eliminar un artículo
  const remove = useCallback(
    async (id, url) => {
      // eliminamos el articulo
      await apiFetch(`${baseUrl}/${id}`, { method: "DELETE" });
      // eliminamos la imagen
      if (url !== undefined) {
        const fileName = url.split("/").pop();
        await apiFetch(`http://localhost:1234/api/files/${fileName}`, {
          method: "DELETE",
        });
      }

      await getAll();
    },
    [apiFetch, baseUrl, getAll]
  );

  // Devolvemos los artículos y las funciones CRUD
  return { items, getAll, create, update, remove };
}
