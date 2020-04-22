import { config } from '../config'
import { ResultTest } from '../types'
class ResultStore {
    public getUserResult(name: string): ResultTest | null {
        return config.get(`results:${name}`) || null
    }
    saveResult(result:ResultTest, name:string){
        config.set(`results:${name}`, result)
        return config.promisedSave()
    }
    resetResult(login:string){
        config.set(`results:${login}`, null)
    }
}
const resultStorage = new ResultStore()

export { ResultStore, resultStorage }