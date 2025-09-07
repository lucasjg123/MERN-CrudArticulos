// ESO SERIA EL MODEL
// lo agrego en helpers ya q es una fuente externa a mi base de datos
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import {
  AWS_BUCKET_REGION,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
  AWS_BUCKET_NAME,
} from "./configS3.js";
import fs from "fs"; // modulo para trabajar con archivos de nodejs
import path from "path"; // para extraer extension del file
import mime from "mime-types";

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
    const stream = fs.createReadStream(file.tempFilePath);

    const fileName = file.name;
    const fileExtension = path.extname(fileName);
    const fileKey = `${id}${fileExtension}`;

    // Detectar el tipo MIME correcto
    const contentType =
      mime.lookup(fileExtension) || "application/octet-stream";

    const uploadParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: fileKey,
      Body: stream,
      ContentType: contentType,
    };

    try {
      await client.send(new PutObjectCommand(uploadParams));

      // Construimos la URL pública
      const publicUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${fileKey}`;

      return {
        key: fileKey,
        url: publicUrl,
      };
    } catch (error) {
      console.error("Error subiendo el archivo:", error);
      throw error;
    } finally {
      fs.unlinkSync(file.tempFilePath);
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
  static async delete(fileName) {
    console.log("🗑️ Borrando de S3 con key:", fileName);
    const deleteParams = {
      Bucket: AWS_BUCKET_NAME,
      Key: fileName, // El archivo que se desea eliminar
    };
    try {
      // Ejecuta el comando de eliminación
      await client.send(new DeleteObjectCommand(deleteParams));
      console.log(`Archivo  eliminado con éxito.`);
      return { message: `Archivo eliminado con éxito.` };
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
      throw error;
    }
  }
}
