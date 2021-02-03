import { Instant, Duration, RFC3339 } from '..'
import { expect } from 'chai'

function assertFormat(iso: string, fmt: string, out: string) {
    it(`${iso}, ${fmt} => ${out}`, () => {
        const instant = new Instant(iso)
        const got = instant.format(fmt)
        expect(got).to.equal(out)
    })
}

describe('Instant.format', () => {
    assertFormat('2020-03-07T11:17:42-00:00', 'YYYY', '2020')
    assertFormat('2020-03-07T11:17:42-00:00', 'YY', '20')

    assertFormat('2020-03-07T11:17:42-00:00', 'MMMM', 'March')
    assertFormat('2020-03-07T11:17:42-00:00', 'MMM', 'Mar')
    assertFormat('2020-03-07T11:17:42-00:00', 'MM', '03')
    assertFormat('2020-03-07T11:17:42-00:00', 'M', '3')
    assertFormat('2020-11-07T11:17:42-00:00', 'M', '11')

    assertFormat('2020-03-07T11:17:42-00:00', 'DD', '07')
    assertFormat('2020-03-07T11:17:42-00:00', 'D', '7')

    assertFormat('2020-03-07T15:17:42-00:00', 'HH', '09')
    assertFormat('2020-03-07T05:17:42-00:00', 'HH', '23')
    assertFormat('2020-03-07T07:17:42-00:00', 'H', '1')
    assertFormat('2020-03-07T17:17:42-00:00', 'H', '11')

    assertFormat('2020-03-07T15:17:42-00:00', 'hh', '09')
    assertFormat('2020-03-07T05:17:42-00:00', 'hh', '11')
    assertFormat('2020-03-07T05:17:42-00:00', 'h', '11')
    assertFormat('2020-03-07T15:17:42-00:00', 'h', '9')
    assertFormat('2020-03-07T23:17:42-00:00', 'h', '5')
    assertFormat('2020-03-07T05:17:42-00:00', 'h', '11')

    assertFormat('2020-03-07T11:17:42-00:00', 'mm', '17')
    assertFormat('2020-03-07T11:07:42-00:00', 'm', '7')
    assertFormat('2020-03-07T11:17:42-00:00', 'm', '17')

    assertFormat('2020-03-07T11:17:17-00:00', 'ss', '17')
    assertFormat('2020-03-07T11:07:07-00:00', 's', '7')
    assertFormat('2020-03-07T11:17:17-00:00', 's', '17')

    assertFormat('2020-03-07T11:17:17.123-00:00', 'SSS', '123')
    assertFormat('2020-03-07T11:07:07.023-00:00', 'SS', '02')
    assertFormat('2020-03-07T11:17:17.123-00:00', 'S', '1')

    assertFormat('2020-03-07T11:17:17.123-00:00', 'a', 'am')
    assertFormat('2020-03-07T21:17:17.123-00:00', 'A', 'PM')

    // ago
    assertFormat(new Instant().minus(1, 'year').format(RFC3339), 'ago', '1 year ago')
    assertFormat(new Instant().minus(10, 'years').format(RFC3339), 'ago', '10 years ago')
    assertFormat(new Instant().minus(4.5, 'weeks').format(RFC3339), 'ago', '1 month ago')
    assertFormat(new Instant().minus(13, 'weeks').format(RFC3339), 'ago', '3 months ago')
    assertFormat(new Instant().minus(1, 'day').format(RFC3339), 'ago', '1 day ago')
    assertFormat(new Instant().minus(10, 'days').format(RFC3339), 'ago', '10 days ago')
    assertFormat(new Instant().minus(1, 'hour').format(RFC3339), 'ago', '1 hour ago')
    assertFormat(new Instant().minus(10, 'hours').format(RFC3339), 'ago', '10 hours ago')
    assertFormat(new Instant().minus(1, 'minute').format(RFC3339), 'ago', '1 minute ago')
    assertFormat(new Instant().minus(10, 'minutes').format(RFC3339), 'ago', '10 minutes ago')
    assertFormat(new Instant().minus(1, 'second').format(RFC3339), 'ago', 'just now')

    // complex
    assertFormat('2020-03-07T11:17:42-00:00', 'MMM D', 'Mar 7')
    assertFormat('2020-03-07T11:17:42-00:00', 'MMM D, YYYY', 'Mar 7, 2020')
    assertFormat('2020-03-07T11:17:42.123-00:00', 'h:mm:ss.SSS a MMM D, YYYY', '5:17:42.123 am Mar 7, 2020')
    assertFormat('2020-03-07T11:17:42.123-00:00', RFC3339, '2020-03-07T05:17:42.123-06:00')

    // invalid
    assertFormat('foo', 'MMM D', 'Invalid Instant')
})

describe('Instant.plus', () => {
    it('immutable', () => {
        const before = new Instant('2020-03-07T11:17:42-00:00')
        const after = before.clone()
        before.plus(1, 'day')
        expect(before.isEqual(after)).to.equal(true)
    })

    it('days', () => {
        const a = new Instant('2020-03-07T11:17:42-00:00')
        const b = a.plus(5, 'days')
        expect(b.format('D')).to.equal('12')
    })

    it('minutes', () => {
        const a = new Instant('2020-03-07T11:17:42-00:00')
        const b = a.plus(5, 'minutes')
        expect(b.format('m')).to.equal('22')
    })

    it('hours', () => {
        const a = new Instant('2020-03-07T11:17:42-00:00')
        const b = a.plus(5, 'hours')
        expect(b.format('H')).to.equal('10')
    })

    it('seconds', () => {
        const a = new Instant('2020-03-07T11:17:42-00:00')
        new Instant()
        const b = a.plus(5, 'seconds')
        expect(b.format('s')).to.equal('47')
    })

    it('milliseconds', () => {
        const a = new Instant('2020-03-07T11:17:42.000-00:00')
        const b = a.plus(5, 'milliseconds')
        expect(b.format('SSS')).to.equal('005')
    })

    it('many months', () => {
        const a = new Instant('2020-12-27T11:17:42-00:00')
        const b = a.plus(62, 'months')
        expect(b.format('MMM YYYY')).to.equal('Feb 2026')
    })

    it('duration', () => {
        const a = new Instant('2020-12-27T11:17:42-00:00')
        const b = a.plus(new Duration(2, 'days'))
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Dec 29, 2020 05:17:42.000')
    })

    it('isNaN when invalid', () => {
        const a = new Instant('foo')
        const b = a.startOf('day')
        expect(b.format('h')).to.equal('Invalid Instant')
    })
})

describe('Instant.minus', () => {
    it('immutable', () => {
        const before = new Instant('2020-03-07T11:17:42-00:00')
        const after = before.clone()
        before.minus(1, 'day')
        expect(before.isEqual(after)).to.equal(true)
    })

    it('weeks', () => {
        const a = new Instant('2020-03-27T11:17:42-00:00')
        const b = a.minus(2, 'weeks')
        expect(b.format('D')).to.equal('13')
    })

    it('year', () => {
        const a = new Instant('2020-01-27T11:17:42-00:00')
        const b = a.minus(5, 'year')
        expect(b.format('YYYY')).to.equal('2015')
    })

    it('month', () => {
        const a = new Instant('2020-01-27T11:17:42-00:00')
        const b = a.minus(5, 'month')
        expect(b.format('MMM YYYY')).to.equal('Aug 2019')
    })

    it('many months', () => {
        const a = new Instant('2020-01-27T11:17:42-00:00')
        const b = a.minus(61, 'months')
        expect(b.format('MMM YYYY')).to.equal('Dec 2014')
    })

    it('duration', () => {
        const a = new Instant('2020-12-27T11:17:42-00:00')
        const b = a.minus(new Duration(2, 'days'))
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Dec 25, 2020 05:17:42.000')
    })

    it('isNaN when invalid', () => {
        const a = new Instant('foo')
        const b = a.startOf('day')
        expect(b.format('h')).to.equal('Invalid Instant')
    })
})

describe('Instant.startOf', () => {
    it('immutable', () => {
        const before = new Instant('2020-03-27T11:17:42.123-00:00')
        const after = before.clone()
        before.startOf('day')
        expect(before.isEqual(after)).to.equal(true)
    })

    it('year', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.startOf('year')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Jan 1, 2020 00:00:00.000')
    })

    it('month', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.startOf('month')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 1, 2020 00:00:00.000')
    })

    it('week', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.startOf('week')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 22, 2020 00:00:00.000')
    })

    it('day', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.startOf('day')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 27, 2020 00:00:00.000')
    })

    it('hour', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.startOf('hour')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 27, 2020 06:00:00.000')
    })

    it('minute', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.startOf('minute')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 27, 2020 06:17:00.000')
    })

    it('second', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.startOf('second')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 27, 2020 06:17:42.000')
    })
})

describe('Instant.endOf', () => {
    it('immutable', () => {
        const before = new Instant('2020-03-27T11:17:42.123-00:00')
        const after = before.clone()
        before.endOf('day')
        expect(before.isEqual(after)).to.equal(true)
    })

    it('year', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.endOf('year')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Dec 31, 2020 23:59:59.999')
    })

    it('month', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.endOf('month')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 31, 2020 23:59:59.999')
    })

    it('month; February; leap year', () => {
        const a = new Instant('2020-02-03T11:17:42.123-00:00')
        const b = a.endOf('month')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Feb 29, 2020 23:59:59.999')
    })

    it('month; February; non-leap year', () => {
        const a = new Instant('2021-02-03T11:17:42.123-00:00')
        const b = a.endOf('month')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Feb 28, 2021 23:59:59.999')
    })

    it('month; February; non-leap year; end of century; div by 400', () => {
        const a = new Instant('2000-02-03T11:17:42.123-00:00')
        const b = a.endOf('month')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Feb 29, 2000 23:59:59.999')
    })

    it('month; February; non-leap year; end of century; not div by 400', () => {
        const a = new Instant('1900-02-03T11:17:42.123-00:00')
        const b = a.endOf('month')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Feb 28, 1900 23:59:59.999')
    })

    it('week', () => {
        const a = new Instant('2020-03-30T11:17:42.123-00:00')
        const b = a.endOf('week')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Apr 4, 2020 23:59:59.999')
    })

    it('day', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.endOf('day')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 27, 2020 23:59:59.999')
    })

    it('hour', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.endOf('hour')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 27, 2020 06:59:59.999')
    })

    it('minute', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.endOf('minute')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 27, 2020 06:17:59.999')
    })

    it('second', () => {
        const a = new Instant('2020-03-27T11:17:42.123-00:00')
        const b = a.endOf('second')
        expect(b.format('MMM D, YYYY HH:mm:ss.SSS')).to.equal('Mar 27, 2020 06:17:42.999')
    })
})
