import express from 'express'
import { genreRouter } from '@/routes/genres'
import { homeRouter } from '@/routes/home'
import { animeRouter } from '@/routes/anime'
import { episodeRouter } from '@/routes/episode'
import { proxyRouter } from '@/routes/proxy'

const router = express.Router()

router.use('/genres', genreRouter)
router.use('/home', homeRouter)
router.use('/anime', animeRouter)
router.use('/episode', episodeRouter)
router.use('/proxy', proxyRouter)

export { router as indexRouter }