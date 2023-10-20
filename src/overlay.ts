import sharp, { WebpOptions } from 'sharp';

export const DEFAULT_IMAGE_HEIGHT = 896;
export const DEFAULT_IMAGE_WIDTH = 896;

export interface Image {
    mimeType: string;
    contents: Buffer;
}

export function createOverlaySvg(width: number, height: number) {
    return Buffer.from(
        `<svg width="${width}px" height="${height}px" xmlns="http://www.w3.org/2000/svg">
          <text y="100" x="80" font-family="Roboto, Helvetica, Arial, sans-serif" font-size="72pt" fill="black">
            Hello from Universe!
          </text>
      </svg>`
    );
}

export async function generateImage() : Promise<Image> {
    const img = await sharp('assets/octocat.gif', { animated: true });
    const metadata = await img.metadata();
    const width = metadata.width;
    const height = metadata.pages === undefined ? metadata.height : ((metadata.height ?? 1) / metadata.pages);
    const overlay = createOverlaySvg(width ?? DEFAULT_IMAGE_WIDTH, height ?? DEFAULT_IMAGE_HEIGHT);

    const compositeImage = await img.composite([
            {
                input: overlay,
                tile: true
            }
        ])
        .webp({
            quality: 80,
            loop: 1,
            delay: metadata.delay,
            effort: 2
        })
        .toBuffer();

    return {
        mimeType: 'image/webp',
        contents: compositeImage
    }
}
