import zod from "zod";

// esquema de tipado para obj articulos
const usuarioSchema = zod.object({
  // id: zod.number().min(1), // min(1) minimo 1 caracter, es decir required
  nick: zod.string().min(1),
  password: zod.string().min(1),
  mail: zod.string().min(1),
});

// valida todo el obj
export const validarUsuario = (usuario) => {
  return usuarioSchema.safeParse(usuario);
};
