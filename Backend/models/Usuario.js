import { usuarios } from "../datos/usuarios.js";
import bcrypt from "bcrypt";
import { crearToken } from "../helpers/jwt_users.js";

let usuariosDevolver = usuarios;

export class Usuario {
  static register = async (usuario) => {
    const nuevoUsuario = { ...usuario };

    if (
      usuariosDevolver.find((usuario) => usuario.nick === nuevoUsuario.nick) ||
      usuariosDevolver.find((usuario) => usuario.mail === nuevoUsuario.mail)
    ) {
      return "usuario duplicado"; //  esta bine este error o debe darse en controller?
    }

    // json web token
    nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password, 10);

    usuariosDevolver.push(nuevoUsuario);
    return nuevoUsuario;
  };

  static login = async (usuario) => {
    let usuarioRecibido = usuario;

    let usuarioRegistrado = usuariosDevolver.find(
      (usuario) => usuario.nick == usuarioRecibido.nick
    );

    if (!usuarioRegistrado) return "No existe el usuario";

    let pwd = await bcrypt.compare(
      usuarioRecibido.password,
      usuarioRegistrado.password
    );

    // si coinciden se devuelve 0
    if (!pwd) return "Fallo de autentificación";

    const token = crearToken(usuarioRegistrado);

    const usuarioFormateado = {
      nick: usuarioRegistrado.nick,
      mail: usuarioRegistrado.mail,
      token: token,
    };

    return usuarioFormateado;
  };
}
