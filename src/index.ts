import express, { Request, Response, Express } from 'express';
import * as dotenv from 'dotenv';
import { generateImage, DEFAULT_IMAGE_WIDTH, DEFAULT_IMAGE_HEIGHT } from './overlay.js';

const DEFAULT_PORT = 3000;

function initializeApp(port: number): Express {
    const app = express();
    dotenv.config();
    app.listen(port, () => {
        console.log(`Our server is running at http://localhost:${port}`);
    });
    return app;
}

const app = initializeApp(Number(process.env.PORT) || DEFAULT_PORT);

app.get('/img', async (req: Request, res: Response) => {
    const image = await generateImage();

    res.status(200)
        .contentType(image.mimeType)
        .set('Cache-Control', 'public, max-age=300')
        .send(image.contents);
});

app.get('/:id?', (req: Request, res: Response) => {
    const id = req.params.id ?? 'GitHub';
    if (id === 'favicon.ico') {
        res.status(404).send('Not found');
        return;
    }

    res.send(`<html>
        <body>
            <img src="/img"
                height="${DEFAULT_IMAGE_HEIGHT}"
                width="${DEFAULT_IMAGE_WIDTH}">
            <div>Created by ${id}</div>
        </body>
    </html>`)
    console.info(`Added "Created by ${id}" message`);
});
