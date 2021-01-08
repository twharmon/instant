import Instant, { RFC3339 } from '..'
import { expect } from 'chai'

function assert(iso: string, fmt: string, out: string) {
    it(`formats ${iso} ${fmt} to ${out}`, () => {
        const instant = new Instant(iso)
        const got = instant.format(fmt)
        expect(got).to.equal(out)
    })
}

describe('Instant formatting', () => {
    assert('2020-03-07T11:17:42-00:00', 'YYYY', '2020')
    assert('2020-03-07T11:17:42-00:00', 'YY', '20')

    assert('2020-03-07T11:17:42-00:00', 'MMMM', 'March')
    assert('2020-03-07T11:17:42-00:00', 'MMM', 'Mar')
    assert('2020-03-07T11:17:42-00:00', 'MM', '03')
    assert('2020-03-07T11:17:42-00:00', 'M', '3')
    assert('2020-11-07T11:17:42-00:00', 'M', '11')

    assert('2020-03-07T11:17:42-00:00', 'DD', '07')
    assert('2020-03-07T11:17:42-00:00', 'D', '7')

    assert('2020-03-07T15:17:42-00:00', 'HH', '09')
    assert('2020-03-07T05:17:42-00:00', 'HH', '23')
    assert('2020-03-07T07:17:42-00:00', 'H', '1')
    assert('2020-03-07T17:17:42-00:00', 'H', '11')

    assert('2020-03-07T15:17:42-00:00', 'hh', '09')
    assert('2020-03-07T05:17:42-00:00', 'hh', '11')
    assert('2020-03-07T05:17:42-00:00', 'h', '11')
    assert('2020-03-07T15:17:42-00:00', 'h', '9')
    assert('2020-03-07T23:17:42-00:00', 'h', '5')
    assert('2020-03-07T05:17:42-00:00', 'h', '11')

    assert('2020-03-07T11:17:42-00:00', 'mm', '17')
    assert('2020-03-07T11:07:42-00:00', 'm', '7')
    assert('2020-03-07T11:17:42-00:00', 'm', '17')

    assert('2020-03-07T11:17:17-00:00', 'ss', '17')
    assert('2020-03-07T11:07:07-00:00', 's', '7')
    assert('2020-03-07T11:17:17-00:00', 's', '17')

    assert('2020-03-07T11:17:17.123-00:00', 'SSS', '123')
    assert('2020-03-07T11:07:07.023-00:00', 'SS', '02')
    assert('2020-03-07T11:17:17.123-00:00', 'S', '1')

    assert('2020-03-07T11:17:17.123-00:00', 'a', 'am')
    assert('2020-03-07T21:17:17.123-00:00', 'A', 'PM')

    // complex
    assert('2020-03-07T11:17:42-00:00', 'MMM D', 'Mar 7')
    assert('2020-03-07T11:17:42-00:00', 'MMM D, YYYY', 'Mar 7, 2020')
    assert('2020-03-07T11:17:42.123-00:00', 'h:mm:ss.SSS a MMM D, YYYY', '5:17:42.123 am Mar 7, 2020')
    assert('2020-03-07T11:17:42.123-00:00', RFC3339, '2020-03-07T05:17:42.123-06:00')

    // invalid
    assert('foo', 'MMM D', 'Invalid Instant')
})

describe('Instant addition and subtraction', () => {
    it('adds days', () => {
        const a = new Instant('2020-03-07T11:17:42-00:00')
        const b = a.plus(5, 'days')
        expect(a.format('D')).to.equal('7')
        expect(b.format('D')).to.equal('12')
    })

    it('adds minutes', () => {
        const a = new Instant('2020-03-07T11:17:42-00:00')
        const b = a.plus(5, 'minutes')
        expect(b.format('m')).to.equal('22')
    })

    it('adds hours', () => {
        const a = new Instant('2020-03-07T11:17:42-00:00')
        const b = a.plus(5, 'hours')
        expect(b.format('H')).to.equal('10')
    })

    it('adds seconds', () => {
        const a = new Instant('2020-03-07T11:17:42-00:00')
        const b = a.plus(5, 'seconds')
        expect(b.format('s')).to.equal('47')
    })

    it('adds milliseconds', () => {
        const a = new Instant('2020-03-07T11:17:42.000-00:00')
        const b = a.plus(5, 'milliseconds')
        expect(b.format('SSS')).to.equal('005')
    })

    it('subtracts weeks', () => {
        const a = new Instant('2020-03-27T11:17:42-00:00')
        const b = a.minus(2, 'weeks')
        expect(a.format('D')).to.equal('27')
        expect(b.format('D')).to.equal('13')
    })

    it('subtracts to start of day', () => {
        const a = new Instant('2020-01-27T11:17:42-00:00')
        const b = a.startOf('day')
        expect(a.format('h')).to.equal('5')
        expect(b.format('h')).to.equal('12')
    })

    it('subtracts year', () => {
        const a = new Instant('2020-01-27T11:17:42-00:00')
        const b = a.minus(5, 'year')
        expect(a.format('YYYY')).to.equal('2020')
        expect(b.format('YYYY')).to.equal('2015')
    })

    it('subtracts month', () => {
        const a = new Instant('2020-01-27T11:17:42-00:00')
        const b = a.minus(5, 'month')
        expect(b.format('MMM YYYY')).to.equal('Aug 2019')
    })

    it('adds months to future year', () => {
        const a = new Instant('2020-12-27T11:17:42-00:00')
        const b = a.plus(62, 'months')
        expect(b.format('MMM YYYY')).to.equal('Feb 2026')
    })

    it('subtracts months to past year', () => {
        const a = new Instant('2020-01-27T11:17:42-00:00')
        const b = a.minus(61, 'months')
        expect(b.format('MMM YYYY')).to.equal('Dec 2014')
    })

    it('isNaN when invalid', () => {
        const a = new Instant('foo')
        const b = a.startOf('day')
        expect(a.format('h')).to.equal('Invalid Instant')
        expect(b.format('h')).to.equal('Invalid Instant')
    })
})