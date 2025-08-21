import { articulos } from "../datos/articulos.js";

let articulosDevolver = articulos;

export class Articulo {
  static getAll() {
    return articulosDevolver;
  }

  static getOneByID(id) {
    return articulosDevolver.find((articulo) => articulo.id == id);
  }

  static delete(id) {
    // Filtra el artículo con el id recibido
    articulosDevolver = articulosDevolver.filter(
      (articulo) => articulo.id != id
    );
    return articulosDevolver;
  }

  static create(articulo) {
    const nuevoArticulo = { ...articulo }; // similar a nuevoArticulo = articulo solo q se hace una copia sin referencia
    articulosDevolver.push(nuevoArticulo);
    return nuevoArticulo;
  }

  static update(id, articulo) {
    const articuloIndice = articulosDevolver.findIndex(
      (articulo) => articulo.id == id
    );

    if (articuloIndice === -1) return null;

    // Actualiza los datos del artículo con la nueva información
    const actualizado = {
      ...articulosDevolver[articuloIndice],
      ...articulo,
    };

    articulosDevolver[articuloIndice] = actualizado;

    return actualizado;
  }
}
