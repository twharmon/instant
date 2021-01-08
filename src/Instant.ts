import { INSTANT_TOKEN_RULES } from './tokens'
import { Duration, Unit, UnitSingular, FixedUnit, VariableUnit } from './Duration'

export class Instant {
    constructor(str?: string)
    constructor(unix?: number)
    constructor(date?: Date)
    constructor(datetime?: string | number | Date) {
        if (datetime !== undefined) {
            this.date = new Date(datetime)
        } else {
            this.date = new Date()
        }
    }

    private date: Date

    unix(): number {
        return this.date.getTime()
    }

    isValid(): boolean {
        return this.date.getTime() === this.date.getTime()
    }

    clone(): Instant {
        return new Instant(this.date)
    }

    format(fmt: string): string {
        if (!this.isValid()) return 'Invalid Instant'
        let out = ''
        while (fmt.length > 0) {
            let found = false
            for (const rule of INSTANT_TOKEN_RULES) {
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

    plus(amount: number, units: Unit): Instant
    plus(duration: Duration): Instant
    plus(amount: number | Duration, units?: any): Instant {
        if (typeof units === 'string' && typeof amount === 'number') {
            switch (units) {
                case 'year':
                case 'years':
                case 'month':
                case 'months':
                    return this.plusVariableUnit(amount, units as VariableUnit)
                case 'week':
                case 'weeks':
                case 'day':
                case 'days':
                case 'hour':
                case 'hours':
                case 'minute':
                case 'minutes':
                case 'second':
                case 'seconds':
                case 'millisecond':
                case 'milliseconds':
                    return this.plusFixedUnit(amount, units as FixedUnit)
            }
        }
        return new Instant(this.unix() + (amount as Duration).milliseconds())
    }

    minus(amount: number, units: Unit): Instant
    minus(duration: Duration): Instant
    minus(amount: number | Duration, units?: Unit): Instant {
        if (typeof amount === 'number') {
            return this.plus(amount * -1, units as Unit)
        }
        return this.plus((amount as Duration).times(-1))
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

    startOf(unit: Exclude<UnitSingular, 'millisecond'>): Instant {
        let d = new Date(this.date)
        switch (unit) {
            case 'second':
                d.setMilliseconds(0)
                return new Instant(d)
            case 'minute':
                d.setSeconds(0)
                d.setMilliseconds(0)
                return new Instant(d)
            case 'hour':
                d.setMinutes(0)
                d.setSeconds(0)
                d.setMilliseconds(0)
                return new Instant(d)
            case 'day':
                d.setHours(0)
                d.setMinutes(0)
                d.setSeconds(0)
                d.setMilliseconds(0)
                return new Instant(d)
            case 'week':
                d.setDate(d.getDate() - d.getDay())
                d.setHours(0)
                d.setMinutes(0)
                d.setSeconds(0)
                d.setMilliseconds(0)
                return new Instant(d)
            case 'month':
                d.setDate(1)
                d.setHours(0)
                d.setMinutes(0)
                d.setSeconds(0)
                d.setMilliseconds(0)
                return new Instant(d)
            case 'year':
                d.setMonth(0)
                d.setDate(1)
                d.setHours(0)
                d.setMinutes(0)
                d.setSeconds(0)
                d.setMilliseconds(0)
                return new Instant(d)
        }
    }

    endOf(unit: Exclude<UnitSingular, 'millisecond'>): Instant {
        let d = new Date(this.date)
        switch (unit) {
            case 'second':
                d.setMilliseconds(999)
                return new Instant(d)
            case 'minute':
                d.setSeconds(59)
                d.setMilliseconds(999)
                return new Instant(d)
            case 'hour':
                d.setMinutes(59)
                d.setSeconds(59)
                d.setMilliseconds(999)
                return new Instant(d)
            case 'day':
                d.setHours(23)
                d.setMinutes(59)
                d.setSeconds(59)
                d.setMilliseconds(999)
                return new Instant(d)
            case 'week':
                d.setDate(d.getDate() + (6 - d.getDay()))
                d.setHours(23)
                d.setMinutes(59)
                d.setSeconds(59)
                d.setMilliseconds(999)
                return new Instant(d)
            case 'month':
                d.setDate(31)
                d.setHours(23)
                d.setMinutes(59)
                d.setSeconds(59)
                d.setMilliseconds(999)
                return new Instant(d)
            case 'year':
                d.setMonth(11)
                d.setDate(31)
                d.setHours(23)
                d.setMinutes(59)
                d.setSeconds(59)
                d.setMilliseconds(999)
                return new Instant(d)
        }
    }

    since(instant: Instant): Duration {
        return new Duration(this.unix() - instant.unix(), 'milliseconds')
    }

    until(instant: Instant): Duration {
        return new Duration(instant.unix() - this.unix(), 'milliseconds')
    }

    private plusFixedUnit(amount: number, units: FixedUnit): Instant {
        switch (units) {
            case 'millisecond':
            case 'milliseconds':
                return new Instant(new Date(this.unix() + amount))
            case 'second':
            case 'seconds':
                return new Instant(new Date(this.unix() + amount * 1000))
            case 'minute':
            case 'minutes':
                return new Instant(new Date(this.unix() + amount * 1000 * 60))
            case 'hour':
            case 'hours':
                return new Instant(new Date(this.unix() + amount * 1000 * 60 * 60))
            case 'day':
            case 'days':
                return new Instant(new Date(this.unix() + amount * 1000 * 60 * 60 * 24))
            case 'week':
            case 'weeks':
                return new Instant(new Date(this.unix() + amount * 1000 * 60 * 60 * 24 * 7))
        }
    }

    private plusVariableUnit(amount: number, units: VariableUnit): Instant {
        switch (units) {
            case 'year':
            case 'years':
                var d = new Date(this.date)
                d.setFullYear(d.getFullYear() + amount)
                return new Instant(d)
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
                return new Instant(d)
        }
    }
}
