import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/ProveedorContexto";
import "./css/Articulos.css";
import { useNavigate } from "react-router-dom";
import { FormArticulo } from "../components/FormArticulo";

export const Articulos = () => {
  const [auth] = useContext(AuthContext);
  const [articulos, setArticulos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [articuloEdit, setArticuloEdit] = useState({});
  const [triggerFetch, setTriggerFetch] = useState(false);
  const navigate = useNavigate();
  const backendUrl = "http://localhost:1234/api/articulos";

  // Obtener artículos
  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const res = await fetch(backendUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.token,
          },
        });

        const data = await res.json();

        if (res.status !== 404) setArticulos(data);
        else {
          navigate("/login"); // xq te manda al login si no hay articulos?
        }
      } catch (e) {
        console.error("Error cargando artículos:", e);
      }
    };

    fetchArticulos();
  }, [auth.token, navigate, triggerFetch]);

  // Definimos una función que se encarga de actualizar el estado
  const onActualizarTabla = () => setTriggerFetch((prev) => !prev);

  // Crear o actualizar. Incorporar delete
  const handleSubmit = async (articulo) => {
    // cargamos el noombre del usuario
    articulo = { ...articulo, usuario: auth.nick };
    try {
      let url = backendUrl;
      let method = "POST"; // hacer un enum para esta mierda

      if (editando && articuloEdit) {
        url = `${backendUrl}/${articuloEdit._id}`;
        method = "PUT";
      }

      console.log("Articulo a enviar:", articulo);
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        body: JSON.stringify(articulo),
      });

      console.log("Respuesta del servidor:", res);
      if (!res.ok) throw new Error("Error en la petición");

      onActualizarTabla();

      // reestablecemos valores default de los estados
      setEditando(false);
      setArticuloEdit({});
    } catch (error) {
      console.error("Error guardando artículo:", error);
    }
  };

  const borrar = async (id) => {
    try {
      const res = await fetch(`http://localhost:1234/api/articulos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
      });

      if (res.status === 200) {
        onActualizarTabla();
      } else {
        console.log("Error al eliminar el artículo");
      }
    } catch (e) {
      console.log(e);
    }
  };

  // sólo setea el articulo seleccionado para q lo tenga el hijo
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulos.map((articulo) => {
              return (
                <tr key={articulo._id}>
                  <td>{articulo.titulo}</td>
                  <td>{articulo.cuerpo}</td>
                  <td>{articulo.usuario}</td>
                  <td>
                    <i onClick={() => borrar(articulo._id)} className="delete">
                      <span className="material-symbols-outlined">delete</span>
                    </i>
                    <i onClick={() => editar(articulo)} className="edit">
                      <span className="material-symbols-outlined">edit</span>
                    </i>
                  </td>
                </tr>
              );
            })}
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
