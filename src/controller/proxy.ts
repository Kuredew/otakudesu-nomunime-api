import { streamAnimeController } from "@/controller/anime";
import { sendError, sendSuccess } from "@/helpers/response";
import axios from "axios";
import type { Request, RequestHandler, Response } from "express";

export const proxyStream: RequestHandler = async (req, res) => {
  const url = req.query.url as string
  const range = req.headers.range
  
  if (range) {
    const videoHead = await axios.head(url);
    const videoSize = parseInt(videoHead.headers['content-length']);

    const parts = range.replace('bytes=', '').split('-')
    const start = parseInt(parts[0] ?? '0', 10)
    const end = videoSize - 1

    const contentLength = end - start + 1;

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
        "Connection": "keep-alive"
    }

    res.writeHead(206, headers)

    console.log(`Fetching ${url} with start bytes: ${start} | end: ${end}`)
    const response = await axios.get(url, {
      responseType: 'stream',
      headers: {
        Range: `bytes=${start}-${end}`
      }
    })
    
    response.data.pipe(res)
  }
  // sendError(res, 'Range header required!')
}

export const pixeldrainProxyController: RequestHandler = async (req, res, next) => {
  const gameDriveProxyEndpoint = 'https://cdn.pixeldrain.eu.cc'
  const validProxyEndpoint = 'pixeldrain.eu.cc'
  const pixeldrainUrlEndpoint = 'https://pixeldrain.com/u'
  const url = req.query.url as string

  if (!url) {
    sendError(res, 'Please provide pixeldrain url')
    return
  }

  if (!(url.includes(pixeldrainUrlEndpoint))) {
    sendError(res, 'The provided url is not pixeldrain valid url')
    return
  }
  
  const pixeldrainFileId = url.split('/u/')[1]
  
  const getStreamUrl: () => Promise<string> = async () => {
    const response = await axios.get(`${gameDriveProxyEndpoint}/${pixeldrainFileId}`, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400
      },
    })
    
    return response.headers.location
  }
  
  let streamUrl: string
  while (true) {
    streamUrl = await getStreamUrl()
    if (streamUrl.includes(validProxyEndpoint)) break
  }

  sendSuccess(res, 'Got proxied pixeldrain url', {
    url: streamUrl
  })
}