import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./ProveedorContexto";
import "./ResultadoArticulos.css";
import { useNavigate } from "react-router-dom";
import { FormArticulo } from "./FormArticulo";

export const ResultadoArticulos = () => {
  const [usuarioAuth, setUsuarioAuth] = useContext(AuthContext);
  const [articulosState, setArticulosState] = useState([]);
  const [editando, setEditando] = useState(false);
  const [articuloEdit, setArticuloEdit] = useState({});
  const [triggerFetch, setTriggerFetch] = useState(false); // Para forzar la actualización
  const navigate = useNavigate();

  useEffect(() => {
    const resultados = async () => {
      try {
        const peticion = await fetch("http://localhost:1234/api/articulos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: usuarioAuth.token,
          },
        });

        const datos = await peticion.json();

        if (peticion.status !== 404) setArticulosState(datos);
        else {
          navigate("/login");
        }
      } catch (e) {
        console.log(e);
      }
    };

    resultados();
  }, [usuarioAuth.token, navigate, triggerFetch]);

  const borrar = async (id) => {
    try {
      const peticion = await fetch(
        `http://localhost:1234/api/articulos/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: usuarioAuth.token,
          },
        }
      );

      if (peticion.status === 200) {
        setTriggerFetch((prev) => !prev); // Cambiar `triggerFetch` para actualizar los artículos
      } else {
        console.log("Error al eliminar el artículo");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const editar = async (articulo) => {
    console.log("editar accion");
    setEditando(true);
    setArticuloEdit(articulo);
  };

  return (
    <>
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
          {articulosState.map((articulo) => {
            return (
              <tr key={articulo._id}>
                <td>{articulo.titulo}</td>
                <td>{articulo.cuerpo}</td>
                <td>{articulo.usuario}</td>
                <td>
                  {" "}
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
        articuloPadre={{ articuloEdit, editando }}
        onActualizarTabla={() => setTriggerFetch((prev) => !prev)} // Cambiar `triggerFetch` para forzar el refetch
      />
    </>
  );
};
