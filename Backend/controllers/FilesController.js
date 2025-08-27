export class FilesController {
  constructor(modelo) {
    this.modelo = modelo;
  }

  getAll = async (req, res) => {
    const result = await this.modelo.getAll();
    res.json(result.Contents);
  };

  getOneByID = async (req, res) => {
    const result = await this.modelo.getOneByID(req.params.fileName);
    res.json({
      url: result,
    });
  };

  //delete = ToDo

  // put ToDo. podria ser eliminar y crear uno nnuevo

  download = async (req, res) => {
    const { fileName } = req.params; // desectructuracion quitando solo el atributo q vamos a usar
    try {
      // Llamamos a la función para descargar el archivo desde S3
      const result = await downloadFile(fileName);

      // Establecer los encabezados para forzar la descarga en el navegador del cliente
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.setHeader("Content-Type", result.ContentType); // Tipo MIME
      res.setHeader("Content-Length", result.ContentLength); // Tamaño del archivo

      // Enviar el archivo al cliente como un stream
      result.Body.pipe(res);
    } catch (error) {
      console.error("Error al intentar descargar el archivo:", error);
      res.status(500).json({ message: "Error al descargar el archivo." });
    }
  };

  create = async (req, res) => {
    const result = await uploadFile(req.files.file);
    res.json({ result });
  };
}
