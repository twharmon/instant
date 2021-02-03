export function formatMonth(number: number): string {
    switch (number) {
        case 0: return 'January'
        case 1: return 'Febuary'
        case 2: return 'March'
        case 3: return 'April'
        case 4: return 'May'
        case 5: return 'June'
        case 6: return 'July'
        case 7: return 'August'
        case 8: return 'September'
        case 9: return 'October'
        case 10: return 'November'
        case 11: return 'December'
    }
    return 'Invalid month'
}

export function pad(num: number, len: number): string {
    let out = num.toString()
    while (out.length < len) {
        out = '0' + out
    }
    return out
}

export function getHours12(date: Date): number {
    const mod = date.getHours() % 12
    if (mod === 0) return 12
    return mod
}

export function daysInMonth(month: number, year: number): number {
    switch (month) {
        case 0: return 31
        case 1: 
            if (year % 4 !== 0) return 28
            if (year % 100 !== 0) return 29
            if (year % 400 === 0) return 29
            return 28
        case 2: return 31
        case 3: return 30
        case 4: return 31
        case 5: return 30
        case 6: return 31
        case 7: return 31
        case 8: return 30
        case 9: return 31
        case 10: return 30
        case 11: return 31
    }
    return -1
}