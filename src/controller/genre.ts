import { createController } from "@/helpers/createController";
import { scrapGenres } from "@/services/scrapper";

export const listGenresController = createController(
  "Completed",
  "Unable to get genre list",
  async () => {
    return await scrapGenres()
  }
) 