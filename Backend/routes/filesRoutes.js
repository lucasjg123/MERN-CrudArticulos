import { Router } from "express";
import fileUpload from "express-fileupload";

export const filesRouter = () => {
  //const controlador =
  const filesRouter = Router();

  filesRouter.get("/"); // getAll
  filesRouter.get("/:id"); // getOneById
  filesRouter.get("/downloadfile/:id"); // getOneById
  filesRouter.delete("/:id"); // delete
  filesRouter.post("/"); // create
  filesRouter.put("/:id"); // update

  return filesRouter;
};
