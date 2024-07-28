import { parseDate } from "@internationalized/date";

export const formatDateISO8601 = (date) => {
    console.log("Date to format:", date);
    let month = date.month.toString();
    let year = date.year.toString();
    let day = date.day.toString();

    if (month.length < 2) {
        month = "0" + month;
    }
    if (day.length < 2) {
        day = "0" + day;
    }

    return `${year}-${month}-${day}T00:00:00.000+00:00`;
};

export const parseISO8601Date = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');

    return parseDate(`${year}-${month}-${day}`);
};

export const normalizeDateValue = (dateValue) => {
    if (typeof dateValue === 'string' && dateValue.includes('T')) {
        return parseISO8601Date(dateValue);
    } else if (dateValue instanceof Object && 'year' in dateValue && 'month' in dateValue && 'day' in dateValue) {
        return dateValue;
    } else {
        return "";
    }
};
