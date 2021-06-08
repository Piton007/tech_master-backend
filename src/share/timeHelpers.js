import dayjs from "dayjs"
import dayjsUTC from "dayjs/plugin/utc"
dayjs.extend(dayjsUTC)


export default class DateHelper {
    constructor(value){
        this.date = dayjs(value).utcOffset(-5)
    }

    toString(){
        return this.date.format("YYYY/MM/DD HH:mm:ss")
    }

    value(){
        return this.date.valueOf()
    }

    static now() {
        const timeZone = new Date().toLocaleString('en-US', { timeZone: 'America/Lima' })
        return new DateHelper(timeZone)
    }
}

