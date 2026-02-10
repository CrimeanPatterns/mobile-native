/* eslint-disable camelcase */

import React from 'react';
import renderer from 'react-test-renderer';

import TimeAgo from '../../app/components/timeAgo';

jest.useFakeTimers();

// jest.requireMock('storage')

const sec_per_minute = 60;
const sec_per_hour = sec_per_minute * 60;
const sec_per_day = sec_per_hour * 24;

it('timeAgo, render date past', () => {
    const now = new Date();
    const field = renderer
        .create(<TimeAgo date={new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0) - sec_per_day * 365 * 1000} />)
        .toJSON();

    expect(field).toMatchSnapshot();
});

it('timeAgo, render date future, 10 years', () => {
    const date = new Date();

    date.setFullYear(date.getFullYear() + 10);
    const field = renderer.create(<TimeAgo date={date} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('timeAgo, render date future, 9.9 years', () => {
    const date = new Date();
    const fromDate = new Date(date.getFullYear(), 3, 1, 0, 0, 0);

    date.setFullYear(date.getFullYear() + 10);
    date.setMonth(2);
    date.setDate(29);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setHours(0);

    const field = renderer.create(<TimeAgo shortDate date={date.getTime()} fromDate={fromDate.getTime()} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('timeAgo, render date future', () => {
    const date = new Date();

    date.setFullYear(date.getFullYear() + 1);
    const field = renderer.create(<TimeAgo date={date} />).toJSON();

    expect(field).toMatchSnapshot();
});

it('timeAgo, render date, short date', () => {
    const fromDate = new Date();

    fromDate.setMonth(3);
    fromDate.setDate(9);

    const toDate = new Date(fromDate.getFullYear() - 4, 0, 15, 0, 0, 0);
    const field = renderer.create(<TimeAgo date={toDate} fromDate={fromDate} shortDate />).toJSON();

    expect(field).toMatchSnapshot();
});

it('timeAgo, render date, short time', () => {
    const date = new Date(Date.now() + 300000);
    const field = renderer.create(<TimeAgo date={date} shortTime />).toJSON();

    expect(field).toMatchSnapshot();
});

it('timeAgo, render date, withoutSuffix', () => {
    const date = new Date(Date.now() + 300000);
    const field = renderer.create(<TimeAgo date={date} withoutSuffix />).toJSON();

    expect(field).toMatchSnapshot();
});
