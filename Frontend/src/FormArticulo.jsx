import { useContext, useState } from "react";
import "./FormArticulo.css";
import { AuthContext } from "./ProveedorContexto";

export const FormArticulo = ({
  articuloPadre,
  onActualizarTabla,
  onCancelarEdicion,
}) => {
  const [auth] = useContext(AuthContext);

  const recogerForm = (e) => {
    e.preventDefault();
    let articulo = {
      titulo: e.target.titulo.value,
      cuerpo: e.target.cuerpo.value,
    };

    if (!articuloPadre.editando) {
      guardarArticulo(articulo);
    } else {
      editarArticulo(articulo, articuloPadre.articuloEdit._id);
    }

    e.target.reset();
  };

  const guardarArticulo = async (articulo) => {
    let articuloCompleto = { ...articulo, usuario: auth.nick };
    try {
      const peticion = await fetch(`http://localhost:1234/api/articulos`, {
        method: "POST",
        body: JSON.stringify(articuloCompleto),
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
      });

      if (peticion.status === 201) {
        onActualizarTabla();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const editarArticulo = async (articulo, id) => {
    let articuloCompleto = { ...articulo, usuario: auth.nick };
    try {
      const peticion = await fetch(
        `http://localhost:1234/api/articulos/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(articuloCompleto),
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.token,
          },
        }
      );

      if (peticion.status === 200) {
        onActualizarTabla();
        onCancelarEdicion();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="screen-1">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20,400,0,0"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      ></link>
      <h2>INTRODUCE ARTÍCULO</h2>
      {articuloPadre.editando && (
        <h3 style={{ color: "red" }}>EDITANDO ARTICULO</h3>
      )}

      <form onSubmit={recogerForm}>
        <div className="titulo">
          <label htmlFor="titulo">Título</label>
          <div className="sec-2">
            <span className="material-symbols-outlined">title</span>
            <input
              type="text"
              name="titulo"
              id="titulo"
              placeholder="Título"
              defaultValue={
                articuloPadre.editando ? articuloPadre.articuloEdit.titulo : ""
              }
            />
          </div>
        </div>

        <div className="cuerpo">
          <label htmlFor="cuerpo">Cuerpo</label>
          <div className="sec-2">
            <span className="material-symbols-outlined">description</span>
            <textarea
              name="cuerpo"
              id="cuerpo"
              placeholder="Cuerpo"
              rows="4"
              cols="50"
              defaultValue={
                articuloPadre.editando ? articuloPadre.articuloEdit.cuerpo : ""
              }
            />
          </div>
        </div>

        <input className="articulo" type="submit" value="Guardar" />

        {articuloPadre.editando && (
          <button onClick={onCancelarEdicion}>Cancelar Edición</button>
        )}
      </form>
    </div>
  );
};
