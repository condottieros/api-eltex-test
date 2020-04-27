import { RequestHandler } from 'express'
import { config } from '../../config'
import { UserCredentials, User } from '../../types'
import { UserService, testsPool, resultStorage } from '../../services'
import { FrontURL } from '../../constants'

const loginHandler: RequestHandler = async (req, res, next) => {
    const credentials: UserCredentials = { ...req.body }
    const userService = new UserService(config)
    const user = userService.loginUser(credentials)
    if (!user) return res.json({ result: false, error: 'user_or_psw_incorrect' })
    req.session!.user = user
    return res.json({ result: true, payload: user.login })
}

const checkAuthHandler: RequestHandler = (req, res, next) => {
    if (req.session!.user) return res.json({
        result: true,
        payload: req.session!.user.login
    })
    return res.json({ result: false })
}

const logoutHandler: RequestHandler = (req, res) => {
    req.session!.destroy(err => {
        if (err) return res.json({ result: false })
        return res.json({ result: true })
    })

}
const testLineHandler: RequestHandler = (req, res, next) => {
    res.status(200)
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader("Access-Control-Allow-Origin", FrontURL);

    const user = req.session!.user as User
    if (!user) return res.send(`data: ${JSON.stringify({ type: 'error', error: 'user not found' })}\n\n`) //!!!

    let test = testsPool.getTestByUser(user)
    test.pipe(res)
    return null
}
const checkTestHandler: RequestHandler = (req, res, next) => {
    if (!req.session!.user) return res.json({ result: false, error: 'user_not_found' })
    const testResult = resultStorage.getUserResult(req.session!.user.login)
    const current = !!testsPool.exists(req.session!.user.id)
    return res.json({ result: true, current, testResult })
}
const resetTestHandler: RequestHandler = async (req, res, next) => {
    if (!req.session!.user) return res.status(401).json({ result: false, error: 'user_not_found' })
    try {
        await resultStorage.resetResult(req.session!.user.login)
        return res.json({result: true})
    } catch (e) {
        return res.json({ result: false, error: 'server_inner_error' })
    }
}

export { loginHandler, checkAuthHandler, logoutHandler, testLineHandler, checkTestHandler, resetTestHandler }



