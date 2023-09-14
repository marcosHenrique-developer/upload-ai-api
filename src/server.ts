import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-videos-route";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateApi } from "./routes/generate-api";
import { fastifyCors } from "@fastify/cors";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
});

app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateApi);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Http Server running!");
  });
