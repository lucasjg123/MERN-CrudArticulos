import { validarArticulo, validarParcial } from "../helpers/zod.js";

export class ArticuloController {
  constructor(modelo) {
    this.modelo = modelo;
  }

  getAll = async (request, response) => {
    const articulos = await this.modelo.getAll();
    if (articulos) response.json(articulos);
    else response.status(404).json({ error: "No hay articulos" });
  };
  getOneById = async (request, response) => {
    const id = request.params.id;
    const articulo = await this.modelo.getOneByID(id);

    if (articulo) {
      response.json(articulo);
    } else {
      response.status(404).json({ error: "Articulo no encontrado" });
    }
  };
  delete = async (request, response) => {
    const id = request.params.id;
    const articulosActualizados = await this.modelo.delete(id);

    if (articulosActualizados) {
      response.json(articulosActualizados);
    } else {
      response
        .status(404)
        .json({ error: "Articulo no encontrado para eliminar" });
    }
  };
  create = async (request, response) => {
    const articuloValidado = validarArticulo(request.body);
    console.log("request body:", request.body); // Ver el contenido que estás recibiendo

    if (!articuloValidado.success) {
      return response.status(400).json({ error: "Validacion incorrecta" });
    }

    const nuevoArticulo = await this.modelo.create(articuloValidado.data);
    response.status(201).json(nuevoArticulo); // 201 indica que el artículo fue creado
  };

  update = async (request, response) => {
    const id = request.params.id;
    const articuloValidado = validarParcial(request.body);

    if (!articuloValidado.success) {
      return response.status(400).json({ error: "Validacion incorrecta" });
    }

    const nuevoArticulo = await this.modelo.update(id, articuloValidado.data);

    if (nuevoArticulo) {
      response.json(nuevoArticulo);
    } else {
      response
        .status(404)
        .json({ error: "Articulo no encontrado para actualizar" });
    }
  };
}
