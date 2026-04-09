import { animeDetailController, searchAnimeController, streamAnimeController } from '@/controller/anime'
import express from 'express'

const router = express.Router()

router.get('/stream', streamAnimeController)
router.get('/search/:query', searchAnimeController)
router.get('/:id', animeDetailController)

export { router as animeRouter }