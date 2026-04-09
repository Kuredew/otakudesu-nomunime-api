import { createController } from "@/helpers/createController";
import { sendError } from "@/helpers/response";
import { scrapAnimeDetail, scrapSearchAnimes } from "@/services/scrapper";
import axios from "axios";
import type { RequestHandler } from "express";

export const animeDetailController = createController(
    "Completed",
    "Unable to get anime detail",
    async (req) => {
      const id = req.params.id as string
      if (!id) {
        throw new Error("Please provide animeID")  
      }
      return await scrapAnimeDetail(id)
  }
)


export const searchAnimeController = createController(
  "Completed",
  "Unable to search anime",
  async (req) => {
    const query = req.params.query as string

    if (!query) {
      throw new Error("Please provide query") 
    }

    return await scrapSearchAnimes(query) 
  }
) 

export const streamAnimeController: RequestHandler = async (req, res) => {
  const url = req.query.url as string    
  const range = req.headers.range;

  if (!range) {
      console.log("Requeies Range header")
      return sendError(res, "Requires Range header", 400);
  }

  try {
      console.log(`Fetching ${url}`)
      const videoHead = await axios.head(url);
      const videoSize = parseInt(videoHead.headers['content-length']);

      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0] ?? "0", 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

      const contentLength = end - start + 1;

      const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": contentLength,
          "Content-Type": "video/mp4",
          "Connection": "keep-alive"
      };

      res.writeHead(206, headers);

      const response = await axios({
          method: 'get',
          url: url,
          responseType: 'stream',
          headers: {
              Range: `bytes=${start}-${end}`,
          },
          timeout: 10000
      });

      response.data.on('error', (err: ErrorEvent) => {
            console.error("Stream Error:", err);
            res.end();
      });

      response.data.pipe(res);
  } catch (error) {
      console.error("Error proxying video:", error);
      sendError(res, "Error streaming video", 500);
  }
}