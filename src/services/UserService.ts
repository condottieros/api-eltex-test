import { config } from '../config'
import { User, UserCredentials } from '../types'

type Data = typeof config

export class UserService {    
    constructor(private config: Data) { }
    
    public loginUser(crd: UserCredentials): User | null {
        const users: Array<User> = this.config.get('users')
        return users.find(u => u.login === crd.login && u.password === crd.password) || null
    }
}