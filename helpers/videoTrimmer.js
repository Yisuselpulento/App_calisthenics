/* import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();
let loaded = false;

export const trimVideo = async ({ file, start, end }) => {
  try {
    if (!loaded) {
      await ffmpeg.load({
        coreURL: "/ffmpeg/ffmpeg-core.js",
        wasmURL: "/ffmpeg/ffmpeg-core.wasm",
        workerURL: "/ffmpeg/ffmpeg-core.worker.js",
      });
      loaded = true;
    }

    await ffmpeg.writeFile("input.mp4", await fetchFile(file));

    await ffmpeg.exec([
      "-ss", String(start),
      "-to", String(end),
      "-i", "input.mp4",
      "-c", "copy",
      "output.mp4",
    ]);

    const data = await ffmpeg.readFile("output.mp4");

    return new File([data.buffer], "trimmed.mp4", {
      type: "video/mp4",
    });
  } catch (err) {
    console.error("FFmpeg error:", err);
    throw err;
  }
};
 */