// Importando mongoose, y el esquema Schema y modelo 'model' para definir un modelo de base de datos
import mongoose, { model, Schema } from "mongoose";
// Importamos la función 'conexion' que se presume establece la conexión a la base de datos
import { conexion } from "../helpers/conexion.js";
import bcrypt from "bcrypt";
import { crearToken } from "../helpers/jwt_users.js";

conexion();

// Definición del esquema de los artículos
const usuarioSchema = new Schema(
  {
    // Definición de los campos del artículo
    nick: String, // Título del artículo
    password: String, // Contenido del artículo
    mail: String, // Usuario asociado al artículo
  },
  {
    versionKey: false, // Desactivamos la versión automática (_v) en los documentos de la colección
  }
);

// Creación del modelo 'Articulo' basado en el esquema definido
const Usuario = model("Usuario", usuarioSchema);

export class UsuarioModel {
  static register = async (usuario) => {
    const nuevoUsuario = { ...usuario };

    const usuarioExiste = await Usuario.findOne({
      $or: [{ nick: nuevoUsuario.nick }, { mail: nuevoUsuario.mail }],
    });

    if (usuarioExiste) {
      return "usuario duplicado"; //  esta bine este error o debe darse en controller?
    }

    try {
      nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password, 10);

      const usuarioGuardar = new Usuario(nuevoUsuario);

      await usuarioGuardar.save();
      return nuevoUsuario;
    } catch (e) {
      console.log(e);
    }
  };

  static login = async (usuarioRecibido) => {
    try {
      const usuarioRegistrado = await Usuario.findOne({
        nick: usuarioRecibido.nick,
      });

      if (!usuarioRegistrado) return { error: "No existe el usuario" };

      let pwd = await bcrypt.compare(
        usuarioRecibido.password,
        usuarioRegistrado.password
      );

      if (!pwd) return { error: "Fallo de autentificación" };

      const token = crearToken(usuarioRegistrado);

      const usuarioFormateado = {
        nick: usuarioRegistrado.nick,
        mail: usuarioRegistrado.mail,
        token: token,
      };

      return usuarioFormateado;
    } catch (e) {
      console.log(e);
      return { error: "Error interno del servidor" }; // Devolver un error genérico
    }
  };
}
