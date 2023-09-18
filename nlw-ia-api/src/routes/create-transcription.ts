import { FastifyInstance } from "fastify";
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import { createReadStream } from "node:fs";
import { openai } from "../lib/openai";

export async function createTranscriptionRoute( app: FastifyInstance ) {
    app.post('/videos/:videoId/transcription', async ( req, res ) => {

        const teste = 'AAAAAAAAAAAAAA';

        console.log( req.params );
        const paramsSchema = z.object( {
            videoId: z.string().uuid(),
        } );

        const { videoId } = paramsSchema.parse( req.params );

        const bodySchema = z.object( {
            prompt: z.string(),
        } );

        const { prompt } = bodySchema.parse( req.body )

        console.log( 'p: ',prompt );

        const video = await prisma.video.findUniqueOrThrow( {
            where: {
                id: videoId
            }
        } )

        const videoPath = video.path

        console.log("path: ", videoPath)

        const audioReadStream = createReadStream( videoPath );

        const response = await openai.audio.transcriptions.create( {
            file: audioReadStream,
            model: 'whisper-1',
            language: 'pt',
            response_format: 'json',
            temperature: 0,
            prompt,
        } )

        console.log('resp: ', response);

        const transcription = response.text;

        console.log('transcription: ',transcription);

        await prisma.video.update( {
            where: {
                id: videoId,
            },
            data: {
                transcription,
            }
        } );

        console.log( transcription );

        return teste;

        //return { transcription }
    });
}