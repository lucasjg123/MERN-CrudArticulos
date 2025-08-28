import { Router } from "express";
import fileUpload from "express-fileupload";
import { FilesController } from "../controllers/FilesController.js";

export const FilesRouter = (modelo) => {
  const controlador = new FilesController(modelo);
  const FilesRouter = Router();

  FilesRouter.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "./uploads",
    })
  );

  FilesRouter.get("/", controlador.getAll); // getAll
  FilesRouter.get("/:id", controlador.getOneByID); // getOneById
  FilesRouter.get("/downloadfile/:id", controlador.download); // getOneById
  // FilesRouter.delete("/:id"); // delete ToDo
  FilesRouter.post("/", controlador.create); // create
  // FilesRouter.put("/:id"); // update ToDo

  return FilesRouter;
};
