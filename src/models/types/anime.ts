export interface Anime {
  id: string,
  name: string,
  banner_url: string
}

export interface AnimeSearchDetail extends Anime {
  genres: string,
  status: string,
  score: string  
}

export interface AnimeDetail extends AnimeSearchDetail {
  studio: string,
  episodes: Record<string, string>[],
}


export interface AnimeList {
  animes: Anime[]
}

export interface AnimeSearchList {
  animes: AnimeSearchDetail[]
}