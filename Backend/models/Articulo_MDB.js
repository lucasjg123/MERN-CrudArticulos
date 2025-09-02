// Importando mongoose, y el esquema Schema y modelo 'model' para definir un modelo de base de datos
import mongoose, { model, Schema } from "mongoose";
// Importamos la función 'conexion' que se presume establece la conexión a la base de datos
import { conexion } from "../helpers/conexion.js";

conexion();

// Definición del esquema de los artículos
const articuloSchema = new Schema(
  {
    // Definición de los campos del artículo
    titulo: { type: String, required: true }, // Título del artículo
    cuerpo: { type: String, required: true }, // Contenido del artículo
    usuario: { type: String, required: true }, // Usuario asociado al artículo
    url: { type: String, required: false }, // URL opcional
  },
  {
    versionKey: false, // Desactivamos la versión automática (_v) en los documentos de la colección
  }
);

// Creación del modelo 'Articulo' basado en el esquema definido
const Articulo = model("Articulo", articuloSchema);

export class ArticuloModel {
  static async getAll() {
    try {
      return Articulo.find();
    } catch (e) {
      console.log(e);
    }
  }

  static async getOneByID(id) {
    try {
      return Articulo.findById(id);
    } catch (e) {
      console.log(e);
    }
  }

  static async delete(id) {
    try {
      return Articulo.deleteOne({ _id: id });
    } catch (e) {
      console.log(e);
    }
  }

  static async create(articulo) {
    // Creamos un nuevo objeto artículo a partir de la información proporcionada
    const nuevoArticulo = { ...articulo };

    // Creamos una nueva instancia del modelo 'Articulo' con la información
    const articuloGuardar = new Articulo(nuevoArticulo);

    try {
      // Guardamos el nuevo artículo en la base de datos
      await articuloGuardar.save();
      // Devuelve el artículo que fue guardado
      return articuloGuardar;
    } catch (e) {
      // En caso de error, se muestra el error en la consola
      console.log(e);
    }
  }

  static async update(id, articulo) {
    try {
      // Actualiza el artículo con el ID proporcionado y devuelve el artículo actualizado
      return await Articulo.findOneAndUpdate(
        { _id: id }, // Condición para encontrar el artículo por su ID
        { ...articulo }, // Nuevos datos del artículo
        { new: true } // Opcionalmente, nos asegura que se devuelva el artículo actualizado (no el anterior)
      );
    } catch (e) {
      console.log(e);
    }
  }
}
