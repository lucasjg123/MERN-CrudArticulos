import { validarUsuario } from "../helpers/zodUsers.js";

export class UsuarioController {
  constructor(modelo) {
    this.modelo = modelo;
  }

  register = async (request, response) => {
    const usuarioValidado = validarUsuario(request.body);

    if (!usuarioValidado.success) {
      return response.status(400).json({ error: "Validación incorrecta" });
    }

    const nuevoUsuario = await this.modelo.register(usuarioValidado.data);
    if (nuevoUsuario === "usuario duplicado") {
      return response.status(400).json({ error: "El usuario ya existe" });
    }

    response.status(201).json(nuevoUsuario); // 201 indica que el artículo fue creado
  };

  login = async (request, response) => {
    const datosAuth = request.body;
    const usuario = await this.modelo.login(datosAuth);

    if (usuario.error) {
      return response.status(400).json({ error: usuario.error });
    }

    response.status(200).json(usuario); // 200 para una respuesta exitosa
  };
}
