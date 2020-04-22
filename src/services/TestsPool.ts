import { TestLine } from '../services'
import { User } from '../types'

class TestsPool {

    protected pool: { [id: number]: TestLine } = {}

    public exists(id: number): TestLine | null {
        return this.pool[id] || null
    }

    public getTestByUser(user: User): TestLine {
        if (this.pool[user.id]) return this.pool[user.id];
        return this.createTest(user)
    }

    public remove(id: number) {
        if (this.pool[id]) {
            console.log('deleting')
            delete this.pool[id]
        }
    }

    protected createTest(user: User) {
        const test = new TestLine(user, this)
        this.pool[user.id] = test
        return test
    }
}

const testsPool = new TestsPool()

export { testsPool, TestsPool }
