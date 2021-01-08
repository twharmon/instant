import { expect } from 'chai'
import { Duration } from '..'
import { FixedUnit, HumanizeConfig } from './Duration'

function assertHumanize(duration: Duration, out: string, config?: HumanizeConfig) {
    it(`${duration.milliseconds()}ms, ${JSON.stringify(config)} => ${out}`, () => {
        const got = duration.humanize(config)
        expect(got).to.equal(out)
    })
}

describe('Duration.humanize', () => {
    assertHumanize(new Duration(45, 'milliseconds'), '45 milliseconds')
    assertHumanize(new Duration(45, 'milliseconds'), '45ms', { abbreviate: true })

    assertHumanize(new Duration(45, 'seconds'), '45 seconds')
    assertHumanize(new Duration(1, 'second'), '1 second')
    assertHumanize(new Duration(45, 'seconds'), '45s', { abbreviate: true })

    assertHumanize(new Duration(45, 'minutes'), '45 minutes')
    assertHumanize(new Duration(1, 'minute'), '1 minute')
    assertHumanize(new Duration(45, 'minutes'), '45m', { abbreviate: true })

    assertHumanize(new Duration(15, 'days'), '15 days')
    assertHumanize(new Duration(15, 'days'), '15d', { abbreviate: true })

    assertHumanize(new Duration(45, 'days'), '1 month')
    assertHumanize(new Duration(45, 'days'), '1mo', { abbreviate: true })

    assertHumanize(new Duration(45, 'months'), '4 years')
    assertHumanize(new Duration(45, 'months'), '4y', { abbreviate: true })
})

describe('Duration.milliseconds', () => {
    it('from milliseconds', () => {
        const dur = new Duration(25, 'milliseconds')
        expect(dur.milliseconds()).to.equal(25)
    })

    it('from millisecond', () => {
        const dur = new Duration(25, 'millisecond')
        expect(dur.milliseconds()).to.equal(25)
    })

    it('from seconds', () => {
        const dur = new Duration(25, 'seconds')
        expect(dur.milliseconds()).to.equal(25 * 1000)
    })

    it('from second', () => {
        const dur = new Duration(25, 'second')
        expect(dur.milliseconds()).to.equal(25 * 1000)
    })

    it('from minutes', () => {
        const dur = new Duration(25, 'minutes')
        expect(dur.milliseconds()).to.equal(25 * 1000 * 60)
    })

    it('from minute', () => {
        const dur = new Duration(25, 'minute')
        expect(dur.milliseconds()).to.equal(25 * 1000 * 60)
    })

    it('from hours', () => {
        const dur = new Duration(25, 'hours')
        expect(dur.milliseconds()).to.equal(25 * 1000 * 60 * 60)
    })

    it('from hour', () => {
        const dur = new Duration(25, 'hour')
        expect(dur.milliseconds()).to.equal(25 * 1000 * 60 * 60)
    })

    it('from days', () => {
        const dur = new Duration(25, 'days')
        expect(dur.milliseconds()).to.equal(25 * 1000 * 60 * 60 * 24)
    })

    it('from day', () => {
        const dur = new Duration(25, 'day')
        expect(dur.milliseconds()).to.equal(25 * 1000 * 60 * 60 * 24)
    })

    it('from weeks', () => {
        const dur = new Duration(25, 'weeks')
        expect(dur.milliseconds()).to.equal(25 * 1000 * 60 * 60 * 24 * 7)
    })

    it('from week', () => {
        const dur = new Duration(25, 'week')
        expect(dur.milliseconds()).to.equal(25 * 1000 * 60 * 60 * 24 * 7)
    })
})

describe('Duration.seconds', () => {
    it('from seconds', () => {
        const dur = new Duration(25, 'seconds')
        expect(dur.seconds()).to.equal(25)
    })
})

describe('Duration.minutes', () => {
    it('from minutes', () => {
        const dur = new Duration(25, 'minutes')
        expect(dur.minutes()).to.equal(25)
    })
})

describe('Duration.hours', () => {
    it('from hours', () => {
        const dur = new Duration(25, 'hours')
        expect(dur.hours()).to.equal(25)
    })
})

describe('Duration.days', () => {
    it('from days', () => {
        const dur = new Duration(25, 'days')
        expect(dur.days()).to.equal(25)
    })
})

describe('Duration.weeks', () => {
    it('from weeks', () => {
        const dur = new Duration(25, 'weeks')
        expect(dur.weeks()).to.equal(25)
    })
})