import { Observable, interval } from 'rxjs'
import { take } from 'rxjs/operators'
import { Response, Request } from 'express'
import { User, ResultTest } from '../types'
import { TestsPool, resultStorage } from '../services'

const tickEvent = (tick: number) => `data: ${JSON.stringify({ type: 'tick', tick })}\n\n`
const completeEvent = (result: number) => `data: ${JSON.stringify({ type: 'complete', result })}\n\n`


class TestLine {
    protected stream$!: Observable<number>;
    protected res!: Response | null;
    protected isStarted: boolean = false
    protected impulseCounter = 0
    protected store = resultStorage;

    constructor(private user: User, private pool: TestsPool | null) { }

    protected start() {
        this.isStarted = true
        this.impulseCounter = this.createRandom()

        const complete = () => {
            this.save()
            if (this.res) {
                this.res.write(completeEvent(this.impulseCounter))
                this.res.end()
            }
            this.destroy()
        }

        this.stream$ = interval(1000).pipe(take(30))
        this.stream$.subscribe({
            complete,
            next: tick => {
                console.log('TICK IN TEST ---->>>', tick)
                if (!this.res) return
                this.res.write(tickEvent(tick))
            }
        });
    }
    protected initRes(res: Response) {
        this.res = res
        const remove = () => this.res = null
        this.res!.on('end', remove)
        this.res!.on('close', remove)
    }

    public pipe(res: Response) {
        this.initRes(res)
        if (!this.isStarted) this.start()

    }

    public getUserID(): number {
        return this.user.id
    }
    /**
     * Создает число от 1002 до 1010 с пропуском 1007 и 1009;
     * Создадим рандомную последовательность от 2 до 10 с пропуском 7 и 9
     */
    protected createRandom(): number {
        /**  случайное число от min до (max+1) */
        const randomInteger = (min: number, max: number) => Math.floor(min + Math.random() * (max + 1 - min))
        let rnd = randomInteger(2, 10)
        /**
         * Добавим к числу само число умнож на 0.08 и округлим
         * таким образом числа больше 6 будут увеличиваться на 1 (7*0.08 = 0.56)
         * чтобы не увелчивались 8 и 10 прибавку умножим на остаток от деления на 2... т.е на четных числах обнулим
         * недостаток метода состоит в том что числа 8 и 10 будут выпадать с удвоенной вероятностью по 
         * сравнению с остальными числами
        */
        rnd = Math.round(rnd + (rnd * 0.08) * (rnd % 2))
        return 1000 + rnd
    }
    protected destroy() {        
        const pool = this.pool
        const id = this.user.id
        this.res = null
        this.pool = null
        this.pool = null
        pool!.remove(id)
    }
    protected save() {
        this.store.saveResult({
            count: this.impulseCounter,
            time: Date.now()
        }, this.user.login)       
    }
}
export { TestLine }