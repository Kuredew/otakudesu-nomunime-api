import express from 'express'
import { HomeAnimeListController } from '@/controller/home'

const router = express.Router()

router.get('/', HomeAnimeListController)

export { router as homeRouter }