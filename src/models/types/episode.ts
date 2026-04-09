export interface Stream {
  src: string,
  type: string,
  label: string 
}

export interface EpisodeDetail {
  id: string,
  name: string,
  stream: Stream[]
}