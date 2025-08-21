import zod from "zod";

// esquema de tipado para obj articulos
const articuloSchema = zod.object({
  // id: zod.number(),
  titulo: zod.string(),
  cuerpo: zod.string(),
  usuario: zod.string(),
});

// valida todo el obj
export const validarArticulo = (articulo) => {
  return articuloSchema.safeParse(articulo);
};

// validar una parte, ejm si solo tiene titulo
export const validarParcial = (articulo) => {
  return articuloSchema.partial().safeParse(articulo);
};
