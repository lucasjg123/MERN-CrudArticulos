import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/ProveedorContexto";
import "./css/Articulos.css";
import { FormArticulo } from "../components/FormArticulo";
import { useCrud } from "../hooks/useCrud"; // <-- importamos el hook

export const Articulos = () => {
  const [auth] = useContext(AuthContext);
  const [editando, setEditando] = useState(false);
  const [articuloEdit, setArticuloEdit] = useState({});
  const backendUrl = "http://localhost:1234/api/articulos";

  // usamos el hook genérico. articulos -> items retornados de useCrud()
  const {
    items: articulos,
    getAll,
    create,
    update,
    remove,
  } = useCrud(backendUrl, auth.token);

  // obtener artículos al montar
  useEffect(() => {
    getAll();
  }, [getAll]);

  const handleSubmit = async (articulo) => {
    articulo = { ...articulo, usuario: auth.nick };
    if (editando) {
      await update(articuloEdit._id, articulo);
      setEditando(false);
      setArticuloEdit({});
    } else {
      await create(articulo);
    }
  };

  const borrar = async (id) => {
    if (window.confirm("¿Estas seguro de eliminar el articulo?"))
      await remove(id);
  };

  const editar = (articulo) => {
    setEditando(true);
    setArticuloEdit(articulo);
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setArticuloEdit({});
  };

  return (
    <>
      <div id="elementos">
        <table id="tabla">
          <thead>
            <tr>
              <th colSpan="7">Artículos</th>
            </tr>
            <tr>
              <th>Título</th>
              <th>Cuerpo</th>
              <th>Usuario</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((articulo) => (
              <tr key={articulo._id}>
                <td>{articulo.titulo}</td>
                <td>{articulo.cuerpo}</td>
                <td>{articulo.usuario}</td>
                <td style={{ width: "200px" }}>
                  {/* Mostrar la imagen si hay una URL */}
                  {articulo.url && (
                    <img
                      src={articulo.url}
                      alt={articulo.titulo}
                      style={{ width: "100%", height: "auto" }}
                    />
                  )}
                </td>
                <td>
                  <i onClick={() => borrar(articulo._id)} className="delete">
                    <span className="material-symbols-outlined">delete</span>
                  </i>
                  <i onClick={() => editar(articulo)} className="edit">
                    <span className="material-symbols-outlined">edit</span>
                  </i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <FormArticulo
          articuloEdit={articuloEdit}
          editando={editando}
          onSubmit={handleSubmit}
          onCancelarEdicion={cancelarEdicion}
        />
      </div>
    </>
  );
};
