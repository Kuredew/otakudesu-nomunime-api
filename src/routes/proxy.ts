import { pixeldrainProxyController, proxyStream } from '@/controller/proxy'
import express from 'express'

const router = express.Router()

router.get('/stream', proxyStream)
router.get('/pixeldrain', pixeldrainProxyController)

export { router as proxyRouter }