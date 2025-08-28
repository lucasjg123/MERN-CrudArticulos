import express from "express";
import { Enrutador } from "./routes/articulosRoutes.js";
import { CreadorUsuarios } from "./routes/usuariosRoutes.js";
import { FilesRouter } from "./routes/filesRoutes.js";
import { ArticuloModel } from "./models/Articulo_MDB.js";
import { UsuarioModel } from "./models/Usuario_MDB.js";
import { FileS3 } from "./helpers/filesS3.js";
import { auth } from "./middlewares/auth.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 1234; // puerto en el cual se lanza la app localhost:1234

// Este endpoint lo maneja el articuloRouter, aca especificamos el modelo a usar
app.use("/api/articulos", auth, Enrutador(ArticuloModel));
app.use("/api/usuarios", CreadorUsuarios(UsuarioModel));
app.use("/api/files", auth, FilesRouter(FileS3));

app.listen(PORT, () => {
  console.log("Servidor a la espera");
});
