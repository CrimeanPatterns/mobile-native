function convertUTCSecondsToLocalDate(seconds) {
    const date = new Date(0); // The 0 there is the key, which sets the date to the epoch

    date.setUTCSeconds(seconds);

    return date;
}

function convertFMTtoLocalDate(fmt) {
    return new Date(fmt.y, fmt.m, fmt.d, fmt.h, fmt.i);
}

export {convertUTCSecondsToLocalDate, convertFMTtoLocalDate};
