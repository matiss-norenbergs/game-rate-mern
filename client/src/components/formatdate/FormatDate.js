const FormatDate = (date) => {
    const moment = require("moment");
    const dateFormatted = moment(date).format('MMMM Do YYYY, HH:mm');
    return dateFormatted;
}
 
export default FormatDate;