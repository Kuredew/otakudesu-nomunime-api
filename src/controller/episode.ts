import { createController } from "@/helpers/createController";
import { scrapEpisodeDetail } from "@/services/scrapper";

export const episodeDetailController = createController(
  "Completed",
  "Unable to get episode detail",
  async (req) => {
    const id = req.params.id as string
    if (!id) throw new Error("Please provide episodeID")
      
    const data = await scrapEpisodeDetail(id)
    
    return data
  }
)