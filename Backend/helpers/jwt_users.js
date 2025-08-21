import jwt from "jwt-simple";
import "dotenv/config";

const caducidad = 1000 * 120; //  30 seg de duracion

export const crearToken = (usuario) => {
  const payload = {
    id: usuario.id,
    nick: usuario.nick,
    mail: usuario.mail,
    exp: Date.now() + caducidad,
  };

  return jwt.encode(payload, process.env.SECRETO);
};
