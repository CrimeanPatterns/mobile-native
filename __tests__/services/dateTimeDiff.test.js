import DateTimeDiff from '../../app/vendor/dateTimeDiff';

const time = {
    second: 1000,
    minute: 1000 * 60,
    hours: 1000 * 60 * 60,
    date: 1000 * 60 * 60 * 24,
};

describe('DateTimeDiff', () => {
    it('from constant 10h 50m - 10h 59m', () => {
        // eslint-disable-next-line no-plusplus
        for (let minutes = 50; minutes < 60; minutes++) {
            // eslint-disable-next-line no-plusplus
            for (let seconds = 0; seconds < 60; seconds++) {
                const date = DateTimeDiff.formatDuration(
                    new Date(1596042000000),
                    new Date(1596078000000 + time.minute * minutes + time.second * seconds),
                );

                // console.log(date, `- 10h ${minutes}m`);

                expect(date).toBe(`10h ${minutes}m`);
            }
        }
    });

    it('from constant 10 hours', () => {
        // eslint-disable-next-line no-plusplus
        for (let seconds = 0; seconds < 60; seconds++) {
            const date = DateTimeDiff.formatDuration(new Date(1596042000000), new Date(1596078000000 + time.second * seconds));

            // console.log(date, `- 10 hours`);

            expect(date).toBe(`10 hours`);
        }
    });
    it('from constant 10h 1m - 10h 10m', () => {
        // eslint-disable-next-line no-plusplus
        for (let minutes = 1; minutes < 10; minutes++) {
            // eslint-disable-next-line no-plusplus
            for (let seconds = 0; seconds < 60; seconds++) {
                const date = DateTimeDiff.formatDuration(
                    new Date(1596042000000),
                    new Date(1596078000000 + time.minute * minutes + time.second * seconds),
                );

                // console.log(date, `- 10h ${minutes}m`);

                expect(date).toBe(`10h ${minutes}m`);
            }
        }
    });

    it('from alternating 10h 50m - 10h 59m', () => {
        // eslint-disable-next-line no-plusplus
        for (let minutes = 50; minutes < 60; minutes++) {
            // eslint-disable-next-line no-plusplus
            for (let seconds = 0; seconds < 60; seconds++) {
                const date = DateTimeDiff.formatDuration(
                    new Date(1596078000000 + time.minute * minutes + time.second * seconds),
                    new Date(1596042000000),
                );

                // console.log(date, `- 10h ${minutes}m`);

                expect(date).toBe(`10h ${minutes}m`);
            }
        }
    });

    it('from alternating 10 hours', () => {
        // eslint-disable-next-line no-plusplus
        for (let seconds = 0; seconds < 60; seconds++) {
            const date = DateTimeDiff.formatDuration(new Date(1596078000000 + time.second * seconds), new Date(1596042000000));

            // console.log(date, `- 10 hours`);

            expect(date).toBe(`10 hours`);
        }
    });

    it('from alternating 10h 1m - 10h 10m', () => {
        // eslint-disable-next-line no-plusplus
        for (let minutes = 1; minutes < 10; minutes++) {
            // eslint-disable-next-line no-plusplus
            for (let seconds = 0; seconds < 60; seconds++) {
                const date = DateTimeDiff.formatDuration(
                    new Date(1596078000000 + time.minute * minutes + time.second * seconds),
                    new Date(1596042000000),
                );

                // console.log(date, `- 10h ${minutes}m`);

                expect(date).toBe(`10h ${minutes}m`);
            }
        }
    });
});
