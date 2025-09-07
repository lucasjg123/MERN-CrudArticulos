import "./css/FormArticulo.css";

export const FormArticulo = ({
  articuloEdit,
  editando,
  onSubmit,
  onCancelarEdicion,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!e.target.titulo.value.trim() || !e.target.cuerpo.value.trim()) {
      alert("Todos los campos son obligatorios");
      return;
    }
    let articulo = {
      titulo: e.target.titulo.value,
      cuerpo: e.target.cuerpo.value,
      ...(articuloEdit.url && { url: articuloEdit.url }),
    };

    // Obtener la imagen si está seleccionada
    const archivo = e.target.imagen.files[0];
    if (archivo) {
      articulo.imagen = archivo; // Si hay un archivo, lo agregamos al objeto
    }

    onSubmit(articulo); // pasamos al padre
    e.target.reset(); // limpiamos campos del form
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
      {editando && <h3 style={{ color: "red" }}>EDITANDO ARTICULO</h3>}

      <form onSubmit={handleSubmit}>
        <div className="titulo">
          <label htmlFor="titulo">Título</label>
          <div className="sec-2">
            <span className="material-symbols-outlined">title</span>
            <input
              type="text"
              name="titulo"
              id="titulo"
              placeholder="Título"
              defaultValue={editando ? articuloEdit.titulo : ""}
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
              defaultValue={editando ? articuloEdit.cuerpo : ""}
            />
          </div>
        </div>

        {/* Campo de imagen opcional */}
        <div className="imagen">
          <label htmlFor="imagen">Imagen (opcional)</label>
          <div className="sec-2">
            <span className="material-symbols-outlined">image</span>
            <input
              type="file"
              name="imagen"
              id="imagen"
              accept="image/*" // Aceptar solo imágenes
            />
          </div>
        </div>

        <input className="articulo" type="submit" value="Guardar" />

        {editando && (
          <button onClick={onCancelarEdicion}>Cancelar Edición</button>
        )}
      </form>
    </div>
  );
};
