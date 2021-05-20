// 计算轨道宽度工具
// 接受 时长s 当前刻度尺标准 s
function getCalculatorWidth(timeDuartion, standard) {
    return (timeDuartion / standard) * 200
}

// oldPositionX,newStandard , oldStandard,  依次为 改变前的x位置   改变前刻度尺标准  改变后刻度尺标准
function getPositionX(oldPositionX, newStandard, oldStandard) {
    return (((oldPositionX / 200) * oldStandard) / newStandard) * 200
}

module.exports = { getCalculatorWidth, getPositionX }