import { episodeDetailController } from "@/controller/episode";
import { Router } from "express";

const router = Router()

router.get('/:id', episodeDetailController)

export { router as episodeRouter }