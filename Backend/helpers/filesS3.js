// ESO SERIA EL MODEL
// lo agrego en helpers ya q es una fuente externa a mi base de datos
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
  AWS_BUCKET_REGION,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET_NAME,
} from "./configS3.js";
import fs from "fs"; // modulo para trabajar con archivos de nodejs
import path from "path"; // para extraer extension del file

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// creamos variable con s3client con las credenciales
const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export class FileS3 {
  static async create(file, id) {
    const stream = fs.createReadStream(file.tempFilePath); // leemos el archivo

    // Supongamos que `file` es el archivo cargado
    const fileName = file.name;
    const fileExtension = path.extname(fileName); // Obtiene la extensión (.jpg, .pdf, etc.)

    // Ahora usas el `id` y la extensión del archivo
    const fileKey = `${id}${fileExtension}`;

    const uploadParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: fileKey, // Aquí el `id` con la extensión
      Body: stream, // Aquí el stream de datos del archivo
    };

    try {
      const result = await client.send(new PutObjectCommand(uploadParams)); // enviamos el archivo a S3
      // Una vez que se ha subido el archivo a S3, lo borramos del servidor
      fs.unlinkSync(file.tempFilePath); // Borra el archivo del directorio 'uploads'
      return result;
    } catch (error) {
      console.error("Error subiendo el archivo:", error);
      throw error; // Si hay un error, no borra el archivo
    }
  }

  static async getAll() {
    const command = new ListObjectsCommand({
      Bucket: AWS_BUCKET_NAME,
    });
    return await client.send(command);
  }

  static async getOneByID(fileName) {
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
    });
    return await client.send(command);
  }

  static async downloadFile(fileName) {
    try {
      // Crear el comando para obtener el archivo de S3
      const command = new GetObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
      });

      // Obtener el archivo desde S3
      return await client.send(command);
    } catch (error) {
      console.error("Error al intentar descargar el archivo:", error);
      res.status(500).json({ error: "No se pudo descargar el archivo" });
    }
  }

  static async getFileURL(fileName) {
    const command = new GetObjectCommand({
      Bucket: AWS_BUCKET_NAME,
      Key: fileName,
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
  }
}
