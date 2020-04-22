import { Router, RequestHandler } from 'express'
import { loginHandler, checkAuthHandler, logoutHandler, testLineHandler, checkTestHandler, resetTestHandler } from './handlers'


const router = Router()

const rootHandler: RequestHandler = (req, res, next) => res.send({ success: 456 })

router.get('/', rootHandler)
router.post('/login', loginHandler)
router.get('/logout', logoutHandler)
router.get('/check-test', checkTestHandler)
router.get('/check-auth', checkAuthHandler)
router.get('/test-line', testLineHandler)
router.get('/test-reset', resetTestHandler)

export { router }