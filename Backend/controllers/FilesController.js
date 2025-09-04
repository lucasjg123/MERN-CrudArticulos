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
  delete = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(400).json({ message: "ID is required." });

      const result = await this.modelo.delete(id); // Aquí pasas el 'id' al modelo
      // Respuesta con el resultado
      res.json(result);
    } catch (error) {
      console.error("Error durante la carga:", error);
      res.status(500).json({ message: "Error al cargar el archivo." });
    }
  };

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
    try {
      // Asegúrate de que se haya subido un archivo
      if (!req.files || !req.files.file)
        return res.status(400).json({ message: "No file uploaded." });

      // Verifica que el campo 'id' esté presente en el cuerpo de la solicitud
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: "ID is required." });

      // Aquí puedes usar el 'id' y 'file' para realizar la acción que necesites
      const result = await this.modelo.create(req.files.file, id); // Aquí pasas el 'id' al modelo
      // Respuesta con el resultado
      res.json(result);
    } catch (error) {
      console.error("Error durante la carga:", error);
      res.status(500).json({ message: "Error al cargar el archivo." });
    }
  };
}
