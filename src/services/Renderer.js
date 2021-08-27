import Jimp from 'jimp';

function makeIteratorThatFillsWithColor(color) {
  return function(x, y, offset) {
    this.bitmap.data.writeUInt32BE(color, offset, true);
  }
};

export async function renderToImage(bgImage, urls, align, crop) {
  const border = 2,
      padding = 35,
      size = Math.min(250, 1500 / (urls.length + 1)),
      alignment = align || 0;
  let img = await Jimp.read(bgImage),
      tiles = await Promise.all(urls.map(url => Jimp.read(url))),
      offset = (1500 - (urls.length * size))/(urls.length + 1); // distance

  tiles.forEach((tile, i) => {
    if (crop) {

      const ratio = (size - 2.0*border)/Math.min(tile.bitmap.width, tile.bitmap.height);
      const w = tile.bitmap.width*ratio, h = tile.bitmap.height*ratio;
      tile.resize(w, h)

      img.scan(
        offset + i*(size+offset),
        (alignment === 1
          ? padding                                   // Top
          : (alignment === 2
            ? 500 - padding - size                    // Bottom
            : (500 - size - 2*border)/2)),            // Center
        size,
        size,
        makeIteratorThatFillsWithColor(0x00000040) // 0xED143DFF
      );

      img.blit(
        tile,
        offset + border + i*(size + offset),
        (alignment === 1
          ? padding + border                // Top
          : (alignment === 2
            ? 500 - padding + border - size // Bottom
            : (500 - size)/2)),             // Center
        Math.max(0, (w - size)/2),
        Math.max(0, (h - size)/2),
        size - 2*border,
        size - 2*border
      );

    } else {
      // scale tile to fit size
      const ratio = (size - 2.0*border)/Math.max(tile.bitmap.width, tile.bitmap.height);
      const w = tile.bitmap.width*ratio, h = tile.bitmap.height*ratio;
      tile.resize(w, h);

      // render border / fill black rectangle
      img.scan(
        offset + i*(size + offset) + (size - 2*border - tile.bitmap.width)/2,
        (alignment === 1
          ? padding + (size - 2*border - tile.bitmap.height)/2                 // Top
          : (alignment === 2
            ? 500 - padding - size + (size - 2*border - tile.bitmap.height)/2  // Bottom
            : (500 - tile.bitmap.height - 2*border)/2)),                       // Center
        tile.bitmap.width + 2*border,
        tile.bitmap.height + 2*border,
        makeIteratorThatFillsWithColor(0x00000040) // 0xED143DFF
      );

      // render tile
      img.composite(
        tile,
        offset + border + i*(size + offset) + (size - 2*border - tile.bitmap.width)/2,
        (alignment === 1
          ? padding + border + (size - 2*border - tile.bitmap.height)/2                // Top
          : (alignment === 2
            ? 500 - padding + border - size + (size - 2*border - tile.bitmap.height)/2 // Bottom
            : (500 - tile.bitmap.height)/2))                                           // Center
      );
    }
  });
  return await img.getBase64Async(Jimp.MIME_JPEG);
}

export const alignments = { 0: 'Center', 1: 'Top', 2: 'Bottom'};
