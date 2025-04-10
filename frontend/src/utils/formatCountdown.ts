export const formatCountdown = (timeDiff: number, format = "mm:ss") => {
    timeDiff = parseInt(String(timeDiff / 1000));
    const hour = parseInt((timeDiff / 60 / 60).toString());
    let minute;
    if (format.includes("hh") || format.includes("HH")) {
        minute = parseInt(((timeDiff / 60) % 60).toString());
    } else {
        minute = parseInt((timeDiff / 60).toString());
    }
    let second;
    if (format.includes("mm") || format.includes("MM")) {
        second = timeDiff % 60;
    } else {
        second = timeDiff;
    }
    let result = format;
    result = result.replace(/(hh|HH)/g, String(hour).padStart(2, "0"));
    result = result.replace(/(mm|MM)/g, String(minute).padStart(2, "0"));
    result = result.replace(/(ss|ss)/g, String(second).padStart(2, "0"));
    return result;
};
