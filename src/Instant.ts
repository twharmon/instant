import { rules } from './tokens'

type UnitSingular = 'week' | 'month' | 'day' | 'year' | 'millisecond' | 'second' | 'minute' | 'hour'

type UnitPlural = `${UnitSingular}s`

class Instant {
    constructor(datetime?: string) {
        if (datetime) {
            this.date = new Date(datetime)
        } else {
            this.date = new Date()
            new Date()
        }
    }

    private date: Date

    unix(): number {
        return this.date.getTime()
    }

    format(fmt: string): string {
        let out = ''
        while (fmt.length > 0) {
            let found = false
            for (const rule of rules) {
                if (fmt.slice(0, rule.token.length) === rule.token) {
                    out += rule.format(this.date)
                    fmt = fmt.slice(rule.token.length)
                    found = true
                    break
                }
            }
            if (found !== true) {
                out += fmt.slice(0, 1)
                fmt = fmt.slice(1)
            }
        }
        return out
    }

    plus(amount: number, units: UnitSingular | UnitPlural): Instant {
        let unixMs = this.unix()
        switch (units) {
            case 'millisecond' || 'milliseconds':
                unixMs += amount
                break
            case 'second' || 'seconds':
                unixMs += amount * 1000
                break
            case 'minute' || 'minutes':
                unixMs += amount * 1000 * 60
                break
            case 'day' || 'days':
                unixMs += amount * 1000 * 60 * 60 * 24
                break
            default:
                throw Error('unimplemented')
        }
        return new Instant(new Date(unixMs).toISOString())
    }

    minus(amount: number, units: UnitSingular | UnitPlural): Instant {
        return this.plus(amount * -1, units)
    }

    startOf(unit: UnitSingular): Instant {
        let d = new Date(this.date)
        switch (unit) {
            case 'day':
                d.setHours(0)
                d.setMinutes(0)
                d.setSeconds(0)
                d.setMilliseconds(0)
                break
            case 'week':
                d.setDate(d.getDate() - d.getDay())
                d.setHours(0)
                d.setMinutes(0)
                d.setSeconds(0)
                d.setMilliseconds(0)
                break
            case 'month':
                d.setDate(1)
                d.setHours(0)
                d.setMinutes(0)
                d.setSeconds(0)
                d.setMilliseconds(0)
                break
            case 'year':
                d.setMonth(0)
                d.setDate(1)
                d.setHours(0)
                d.setMinutes(0)
                d.setSeconds(0)
                d.setMilliseconds(0)
                break
        }
        return new Instant(d.toISOString())
    }
}

export default Instant
