import nconf from 'nconf'
import { join } from 'path'

declare module 'nconf' {
    export function promisedSave(): Promise<void>
}
nconf.promisedSave = () => {
    return new Promise((resolve, reject) => {
        nconf.save((err: any) => {
            if (err) return reject(err)
            return resolve()
        })
    })
}

nconf.file('base', join(__dirname, '../../config/data.json'))

export { nconf as config }