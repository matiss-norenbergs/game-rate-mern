const FormatDateNum = (date) => {
    const moment = require("moment");
    const dateFormatted = moment(date).format('DD.MM.YYYY, HH:mm');
    return dateFormatted;
}
 
export default FormatDateNum;