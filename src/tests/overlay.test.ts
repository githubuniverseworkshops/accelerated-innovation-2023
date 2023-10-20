import { Express } from "express";
import { Image, createOverlaySvg, generateImage } from "../overlay";
import { describe, expect, test, beforeAll } from '@jest/globals';

const overlaySizeTests = [
    [0, 0],
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [-1, 1],
    [1, -1],
    [1, -1],
    [-1, 1],
    [-1, -1],
    [1, 1]
];

test.each(overlaySizeTests)("Overlay with width %d height %d is not null", (width, height) => {
    const buffer = createOverlaySvg(width, height);
    expect(buffer).not.toBeNull();
});

describe ("Generated image", () => {
    let image : Image;
    
    beforeAll(async () => {
        image = await generateImage();
    }, 30_000);

    test("is not null", () => {
        expect(image).not.toBeNull();
    });

    test("is webp format", () => {
        expect(image.mimeType).toBe("image/webp");
    });

    test("has non-null contents", () => {
        expect(image.contents).not.toBeNull();
    });
});
