import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";
import path from "node:path";
import fs from "node:fs";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, // 25mb
    },
  });

  app.post("/videos", async (req, rep) => {
    const data = await req.file();

    if (!data) {
      return rep.status(400).send({ error: "Missing file input." });
    }

    const extension = path.extname(data.filename);

    if (extension !== ".mp3") {
      return rep
        .status(400)
        .send({ error: "Invalid input type, please upload mp3." });
    }

    const fileBasename = path.basename(data.filename, extension);

    const fileUploadName = `${fileBasename}-${randomUUID()}${extension}`;

    const uploadDir = path.resolve(__dirname, "../../tpm", fileUploadName);

    await pump(data.file, fs.createWriteStream(uploadDir));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDir,
      },
    });

    return {
      video,
    };
  });
}
