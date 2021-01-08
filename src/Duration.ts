import { pad } from "./utils"

export type VariableUnitSingular = 'year' | 'month'

export type FixedUnitSingular = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week'

export type VariableUnitPlural = `${VariableUnitSingular}s`

export type FixedUnitPlural = `${FixedUnitSingular}s`

export type VariableUnit = VariableUnitSingular | VariableUnitPlural

export type FixedUnit = FixedUnitSingular | FixedUnitPlural

export type UnitSingular = FixedUnitSingular | VariableUnitSingular

export type UnitPlural = FixedUnitPlural | VariableUnitPlural

export type Unit = UnitSingular | UnitPlural

export interface HumanizeConfig {
    abbreviate?: boolean
}

interface ExplicitHumanizeConfig {
    abbreviate: boolean
}

function implicitToExplicitHumanizeConfig(config: HumanizeConfig): ExplicitHumanizeConfig {
    if (config.abbreviate === undefined) {
        config.abbreviate = false
    }
    return config as ExplicitHumanizeConfig
}

export class Duration {
    constructor(amount: number, unit: Unit) {
        switch (unit) {
            case 'millisecond':
            case 'milliseconds':
                this.ms = Math.floor(amount)
                break
            case 'second':
            case 'seconds':
                this.ms = Math.floor(amount * 1000)
                break
            case 'minute':
            case 'minutes':
                this.ms = Math.floor(amount * 1000 * 60)
                break
            case 'hour':
            case 'hours':
                this.ms = Math.floor(amount * 1000 * 60 * 60)
                break
            case 'day':
            case 'days':
                this.ms = Math.floor(amount * 1000 * 60 * 60 * 24)
                break
            case 'week':
            case 'weeks':
                this.ms = Math.floor(amount * 1000 * 60 * 60 * 24 * 7)
                break
            case 'month':
            case 'months':
                this.ms = Math.floor(amount * 1000 * 60 * 60 * 24 * (365.24 / 12))
                break
            case 'year':
            case 'years':
                this.ms = Math.floor(amount * 1000 * 60 * 60 * 24 * 365.24)
                break
        }
    }

    private ms: number

    milliseconds(): number {
        return this.ms
    }

    seconds(): number {
        return this.ms / 1000
    }

    minutes(): number {
        return this.ms / 1000 / 60
    }

    hours(): number {
        return this.ms / 1000 / 60 / 60
    }

    days(): number {
        return this.ms / 1000 / 60 / 60 / 24
    }

    weeks(): number {
        return this.ms / 1000 / 60 / 60 / 24 / 7
    }

    isLessThan(d: Duration): boolean {
        return this.ms < d.ms
    }

    isGreaterThan(d: Duration): boolean {
        return this.ms > d.ms
    }

    isEqual(d: Duration): boolean {
        return this.ms === d.ms
    }

    clone(): Duration {
        return new Duration(this.ms, 'milliseconds')
    }

    humanize(config?: HumanizeConfig): string {
        const cfg = implicitToExplicitHumanizeConfig(config || {})
        return this.humanizePhrase(cfg)
    }

    times(factor: number): Duration {
        return new Duration(this.ms * factor, 'milliseconds')
    }

    private humanizePhrase(config: ExplicitHumanizeConfig): string {
        if (this.ms < 1000) {
            const [unit, plural] = config.abbreviate ? ['ms', ''] : [' millisecond', 's']
            return `${this.ms}${unit}${this.ms !== 1 ? plural : ''}`
        }
        if (this.ms < 1000 * 60) {
            const amount = Math.round(this.ms / 1000)
            const [unit, plural] = config.abbreviate ? ['s', ''] : [' second', 's']
            return `${amount}${unit}${amount !== 1 ? plural : ''}`
        }
        if (this.ms < 1000 * 60 * 60) {
            const amount = Math.round(this.ms / 1000 / 60)
            const [unit, plural] = config.abbreviate ? ['m', ''] : [' minute', 's']
            return `${amount}${unit}${amount !== 1 ? plural : ''}`
        }
        if (this.ms < 1000 * 60 * 60 * 24) {
            const amount = Math.round(this.ms / 1000 / 60 / 60)
            const [unit, plural] = config.abbreviate ? ['h', ''] : [' hour', 's']
            return `${amount}${unit}${amount !== 1 ? plural : ''}`
        }
        if (this.ms < 1000 * 60 * 60 * 24 * 31) {
            const amount = Math.round(this.ms / 1000 / 60 / 60 / 24)
            const [unit, plural] = config.abbreviate ? ['d', ''] : [' day', 's']
            return `${amount}${unit}${amount !== 1 ? plural : ''}`
        }
        if (this.ms < 1000 * 60 * 60 * 24 * 365) {
            const amount = Math.round(this.ms / 1000 / 60 / 60 / 24 / (365.24 / 12))
            const [unit, plural] = config.abbreviate ? ['mo', ''] : [' month', 's']
            return `${amount}${unit}${amount !== 1 ? plural : ''}`
        }
        const amount = Math.round(this.ms / 1000 / 60 / 60 / 24 / 365.24)
        const [unit, plural] = config.abbreviate ? ['y', ''] : [' year', 's']
        return `${amount}${unit}${amount !== 1 ? plural : ''}`
    }
}
