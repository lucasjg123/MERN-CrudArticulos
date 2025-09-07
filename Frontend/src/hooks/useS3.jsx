import { useCallback } from "react";

export function useS3(token) {
  // Función para subir un archivo a S3
  const uploadFile = useCallback(
    async (file, itemId) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", itemId);

      const img = await fetch("http://localhost:1234/api/files", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: token,
        },
      });

      if (!img.ok) {
        throw new Error(`Error al subir la imagen: ${img.status}`);
      }

      return img.json();
    },
    [token]
  );

  // Función para eliminar un archivo de S3
  const deleteFile = useCallback(
    async (fileUrl) => {
      console.log("🗑️ Borrando de S3 con url:", fileUrl);
      const fileName = fileUrl.split("/").pop();
      console.log("🗑️ Borrando de S3 filename:", fileName);
      const res = await fetch(`http://localhost:1234/api/files/${fileName}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (!res.ok) {
        throw new Error(`Error al eliminar la imagen: ${res.status}`);
      }
    },
    [token]
  );

  return { uploadFile, deleteFile };
}
