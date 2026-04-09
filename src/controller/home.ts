import { createController } from "@/helpers/createController";
import { scrapHomeAnimes } from "@/services/scrapper";

export const HomeAnimeListController = createController(
  "Completed",
  "Unable to get anime from homepage",
  async () => {
    return await scrapHomeAnimes() 
  }
)