import { BASE_URL } from "@/config";
import type { AnimeDetail, AnimeList, AnimeSearchList } from "@/models/types/anime";
import type { EpisodeDetail, Stream } from "@/models/types/episode";
import axios from "axios";
import * as cheerio from 'cheerio';

export async function scrapHomeAnimes(): Promise<AnimeList> {
  const finalUrl = `https://videoproxy.burrohmanhabib35.workers.dev/proxyGet?url=${BASE_URL}` 

  console.log(`fetching ${finalUrl}`)
  const { data } = await axios.get(BASE_URL ? finalUrl : '', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Referer': 'https://otakudesu.blog/',
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
    }
  })
  
  const $ = cheerio.load(data)
  const animeList : AnimeList = {
    animes: []
  }
  
  $('.detpost .thumb').each((i, el) => {
    const element = $(el)

    animeList.animes.push({
      id: (() => {
        const link = element.find('a').attr('href') ?? ""
        return link.slice(`${BASE_URL}/anime/`.length, link.length - 1) ?? ""
      })(),
      name: element.find('.jdlflm').text().trim() ?? "",
      banner_url: element.find('img').attr('src') ?? ""
    })
  })
  

  return animeList
}

export async function scrapAnimeDetail(animeId: string): Promise<AnimeDetail> {
  const { data } = await axios.get(`${BASE_URL}/anime/${animeId}`)
  
  const $ = cheerio.load(data)
  const infos: Record<string, string> = {}
  const episodes: Record<string, string>[] = []
  
  $('.infozingle p').each((i, el) => {
    const infoStr = $(el).text()
    const splited = infoStr?.split(':')
    
    if (!splited) return

    const title = splited[0]
    const description = splited[1]?.trim()
    
    if (title && description) {
      Object.assign(infos, { [title]: description })
    }
  })
  
  
  $('.episodelist li a').each((i, el) => {
    const name =  $(el).text().trim().match(/Episode\s\d+/)
    const endpoint_url = $(el).attr('href')
    const id = endpoint_url?.slice(`${BASE_URL}/episodes`.length, endpoint_url.length - 1)

    episodes.push({
      id: id ?? '',
      name: name?.pop() ?? '',
      endpoint_url: endpoint_url ?? ''
    })
  })
  
  return {
    id: '',
    banner_url: $('.fotoanime img').attr('src') ?? "",
    name: infos['Judul'] ?? "",
    genres: infos['Genre'] ?? "",
    score: infos['Skor'] ?? "",
    studio: infos['Studio'] ?? "",
    status: infos['Status'] ?? "",
    episodes
  }
}

export async function scrapSearchAnimes(query: string): Promise<AnimeSearchList> {
  const params = new URLSearchParams({
    s: query,
    post_type: 'anime'
  })

  const { data } = await axios.get(`${BASE_URL}/?${params.toString()}`)
  
  const $ = cheerio.load(data)
  const animeSearchList: AnimeSearchList = {
    animes: []
  }
  
  $('.chivsrc li').each((i, el) => {
    const element = $(el) 
    
    const info: Record<string, string> = {}
    
    $(el).find('.set').each((i, el) => {
      const texts = $(el).text().split(':')

      Object.assign(info, { [texts[0]?.trim() ?? '']: texts[1]?.trim() })
    })
    
    const endpoint_url = element.find('h2 a').attr('href')
    animeSearchList.animes.push({
      id: endpoint_url?.slice(`${BASE_URL}/anime/`.length, endpoint_url.length - 1) ?? "",
      name: element.find('h2 a').text().trim() ?? "",
      banner_url: element.find('img').attr('src') ?? "",
      genres: info['Genres'] ?? "",
      status: info['Status'] ?? "",
      score: info['Rating'] ?? ""
    })
  })
  
  return animeSearchList
}

export async function scrapGenres() {
  const { data } = await axios.get(`${BASE_URL}/genre-list`)
  
  const $ = cheerio.load(data)
  
  return $('.genres li').extract({
    genres: [
      {
        selector: 'a',
        value: (el, key) => {
          return {
            name: $(el).text().trim(),
            endpoint_url: $(el).attr('href')
          }
        }
      }
    ]
  })
}

export async function scrapEpisodeDetail(id: string): Promise<EpisodeDetail> {
  const { data } = await axios.get(`${BASE_URL}/episode/${id}`)

  const $ = cheerio.load(data)
  
  const stream: Stream[] = []
  
  $('.download li').each((i, el) => {
    if ($(el).find('strong').text().includes("MKV")) return
    
    const label = $(el).text().match(/\d+p/)?.pop() ?? ""
    $(el).find('a').each((i, el) => {
      const text = $(el).text()
      if (text.includes("Pdrain") || text.includes("PDrain")) {

      const src = $(el).attr('href') ?? ""
      const type = 'video/mp4' 
      
      stream.push({
        src,
        label,
        type
      })
      }
    })
  })
  
  const name = $('.posttl').text().trim()
  
  const newStream = await Promise.all(stream.map(async (value, index) => {
    const res = await axios.get(value.src)
    const src = res.request.res.responseUrl as string

    // ini cuma buat test
    const newSrc = src
    // const newSrc = src.replace('/u/', '/api/file/')

    return {
      ...value,
      src: newSrc
    }
  }))
  
  return {
    id,
    name,
    stream: newStream
  }
}