import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useS3 } from "./useS3";

export function useCrud(baseUrl, token) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  // Dentro de useCrud
  const { uploadFile, deleteFile } = useS3(token);

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
    console.log("articulos:", data);
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
          const img = await uploadFile(archivo, createdItem._id);
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
      if (item.imagen) {
        console.log("quiere actualizar imagen");
        const archivo = item.imagen;
        delete item.imagen;
        // eliminar luego volver a subir ya q al tener el mismo filename id pueden tener dif formato .jpg ejm
        // Si ya tiene una imagen, la borrarmos
        console.log("print del item", item);
        if (item.url !== undefined) {
          console.log("hola quiero borrar la imagen vieja");
          await deleteFile(item.url);
        }
        // Subimos la imagen nueva
        const img = await uploadFile(archivo, id);
        item = { ...item, url: img.url };
      } // guardar la url de la imgaen en el articulo
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
      if (url !== undefined) await deleteFile(url);

      await getAll();
    },
    [apiFetch, baseUrl, getAll]
  );

  // Devolvemos los artículos y las funciones CRUD
  return { items, getAll, create, update, remove };
}
