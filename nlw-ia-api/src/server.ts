import { fastify } from "fastify";
import { fastifyCors } from '@fastify/cors';

import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";
import { createTranscriptionRoute } from "./routes/create-transcription";
import { generateAiCompletionRoute } from "./routes/generate-ai-completion";

const port = 3333;

const app = fastify();

app.register( fastifyCors, {
    origin: '*',
} )

app.register( getAllPromptsRoute );
app.register( uploadVideoRoute );
app.register( createTranscriptionRoute );
app.register( generateAiCompletionRoute );

app.listen({
    port: port,
}).then( () => {
    console.log(`Server Running in http://localhost:${port}`);
} )
