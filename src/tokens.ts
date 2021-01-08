import { formatMonth, pad, getHours12 } from './utils'

export const RFC3339 = 'YYYY-MM-DDTHH:mm:ss.SSSZ'

interface InstantTokenRule {
    token: string
    format: (date: Date) => string
}

export const INSTANT_TOKEN_RULES: InstantTokenRule[] = [
    { token: 'YYYY', format: (date: Date): string => date.getFullYear().toString() },
    { token: 'YY', format: (date: Date): string => (date.getFullYear() % 100).toString() },

    { token: 'MMMM', format: (date: Date): string => formatMonth(date.getMonth()) },
    { token: 'MMM', format: (date: Date): string => formatMonth(date.getMonth()).slice(0, 3) },
    { token: 'MM', format: (date: Date): string => pad(date.getMonth() + 1, 2) },
    { token: 'M', format: (date: Date): string => (date.getMonth() + 1).toString() },

    { token: 'DD', format: (date: Date): string => pad(date.getDate(), 2) },
    { token: 'D', format: (date: Date): string => date.getDate().toString() },

    { token: 'HH', format: (date: Date): string => pad(date.getHours(), 2) },
    { token: 'H', format: (date: Date): string => date.getHours().toString() },

    { token: 'hh', format: (date: Date): string => pad(getHours12(date), 2) },
    { token: 'h', format: (date: Date): string => getHours12(date).toString() },

    { token: 'mm', format: (date: Date): string => pad(date.getMinutes(), 2) },
    { token: 'm', format: (date: Date): string => date.getMinutes().toString() },

    { token: 'ss', format: (date: Date): string => pad(date.getSeconds(), 2) },
    { token: 's', format: (date: Date): string => date.getSeconds().toString() },

    { token: 'SSS', format: (date: Date): string => pad(date.getMilliseconds(), 3) },
    { token: 'SS', format: (date: Date): string => pad(Math.round(date.getMilliseconds() / 10), 2) },
    { token: 'S', format: (date: Date): string => pad(Math.round(date.getMilliseconds() / 100), 1) },

    { token: 'A', format: (date: Date): string => date.getHours() < 12 ? 'AM' : 'PM' },
    { token: 'a', format: (date: Date): string => date.getHours() < 12 ? 'am' : 'pm' },

    { token: 'Z', format: (date: Date): string => {
        let out = ''
        const offsetMinutes = date.getTimezoneOffset()
        const offsetHours = Math.floor(offsetMinutes / 60)
        const offsetRemainderMintes = offsetMinutes % 60
        if (offsetMinutes >= 0) {
            out += '-'
        } else {
            out += '+'
        }
        out += `${pad(offsetHours, 2)}:${pad(offsetRemainderMintes, 2)}`
        return out
    } },
]
