export interface User {
    readonly id: number
    readonly login: string
    readonly password: string
}
export interface UserCredentials {
    login: string
    password: string
}
export type ResultTest = {
    count: number
    time: number
}