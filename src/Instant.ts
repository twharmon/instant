import { rules } from './tokens'

type UnitSingular = 'week' | 'month' | 'day' | 'year' | 'millisecond' | 'second' | 'minute' | 'hour'

type UnitPlural = `${UnitSingular}s`

class Instant {
    constructor(datetime?: string) {
        if (datetime) {
            this.date = new Date(datetime)
        } else {
            this.date = new Date()
        }
    }

    private date: Date

    private static fromDate(d: Date): Instant {
        if (isNaN(d.getTime())) return new Instant('foo')
        return new Instant(d.toISOString())
    }

    unix(): number {
        return this.date.getTime()
    }

    format(fmt: string): string {
        if (isNaN(this.date.getTime())) return 'Invalid Instant'
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
        switch (units) {
            case 'year':
            case 'years':
                var d = new Date(this.date)
                d.setFullYear(d.getFullYear() + amount)
                return Instant.fromDate(d)
            case 'month':
            case 'months':
                var d = new Date(this.date)
                if (amount > 0) {
                    while (amount > 12) {
                        d.setFullYear(d.getFullYear() + 1)
                        amount -= 12
                    }
                    if (d.getMonth() + amount > 12) {
                        d.setFullYear(d.getFullYear() + 1)
                        d.setMonth((d.getMonth() + amount) % 12)
                    } else {
                        d.setMonth(d.getMonth() + amount)
                    }
                } else {
                    while (amount < -12) {
                        d.setFullYear(d.getFullYear() - 1)
                        amount += 12
                    }
                    if (d.getMonth() + amount < 0) {
                        d.setFullYear(d.getFullYear() - 1)
                        d.setMonth((12 + d.getMonth()) + amount)
                    } else {
                        d.setMonth(d.getMonth() + amount)
                    }
                }
                return Instant.fromDate(d)
        }
        let unixMs = this.unix()
        switch (units) {
            case 'millisecond':
            case 'milliseconds':
                unixMs += amount
                break
            case 'second':
            case 'seconds':
                unixMs += amount * 1000
                break
            case 'minute':
            case 'minutes':
                unixMs += amount * 1000 * 60
                break
            case 'hour':
            case 'hours':
                unixMs += amount * 1000 * 60 * 60
                break
            case 'day':
            case 'days':
                unixMs += amount * 1000 * 60 * 60 * 24
                break
            case 'week':
            case 'weeks':
                unixMs += amount * 1000 * 60 * 60 * 24 * 7
                break
            default:
                throw Error('Invalid units')
        }
        return Instant.fromDate(new Date(unixMs))
    }

    minus(amount: number, units: UnitSingular | UnitPlural): Instant {
        return this.plus(amount * -1, units)
    }

    isAfter(instant: Instant): boolean {
        return this.unix() > instant.unix()
    }

    isBefore(instant: Instant): boolean {
        return this.unix() < instant.unix()
    }

    isEqual(instant: Instant): boolean {
        return this.unix() === instant.unix()
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
        return Instant.fromDate(d)
    }
}

export default Instant
