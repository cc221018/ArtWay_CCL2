
// change automatically formatted sql date to own date format:
// 2023-06-10T22:00:00.000Z --> 10.06.2023

function formatDate(date) {
    date = date.toJSON().split('T')[0];
    const dateSplit = date.split('-');

    const year = dateSplit[0];
    const month = dateSplit[1];
    let day = parseInt(dateSplit[2]) + 1;

    if (day < 10) {
        toString(day);
        day = '0' + day;
    }

    return `${day}.${month}.${year}`;
}


module.exports = {
    formatDate
}