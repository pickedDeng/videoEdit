// 使用工具  将总秒数转化为hh:mm:ss格式
const moment = require("moment");
// 参数  总时长(s),刻度尺区间(number)  
function getItemTimezoneValue(totalSecond, currentItemTimezone) {
    if (totalSecond) {
        const handleTime = moment.duration(totalSecond * currentItemTimezone, "seconds");
        const hh = handleTime.get('hours') > 9 ? handleTime.get('hours') : `0${handleTime.get('hours')}`
        const mm = handleTime.get('minutes') > 9 ? handleTime.get('minutes') : `0${handleTime.get('minutes')}`
        const ss = handleTime.get('seconds') > 9 ? handleTime.get('seconds') : `0${handleTime.get('seconds')}`;
        return `${hh}:${mm}:${ss}`
    } else {
        return 0
    }

}

module.exports = { getItemTimezoneValue }