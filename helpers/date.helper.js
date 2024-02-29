// 整理一組始末日期與時間
function parseDateTimeRange (dateTimeRange) {
  const [datePart, timePart] = dateTimeRange.split(' ')
  const [startTime, endTime] = timePart.split('-')
  return [datePart, startTime, endTime]
}

function formDate (dateTimeRange) {
  const [datePart, startTime, endTime] = parseDateTimeRange(dateTimeRange)
  const startDate = new Date(`${datePart} ${startTime}`)
  const endDate = new Date(`${datePart} ${endTime}`)
  return [startDate, endDate]
}

const isOverlapping = function (existDate, date) {
  const [start1, end1] = formDate(existDate)
  const [start2, end2] = formDate(date)

  if (end1 <= start2 || start1 >= end2) {
    return false
  }
  return true // 有重疊回傳true
}

const classLength = function (date) {
  const [startTime, endTime] = parseDateTimeRange(date).slice(1, 3)
  const length = parseInt(startTime.split(':')[1]) - parseInt(endTime.split(':')[1])
  return length === -30 || length === 30 ? 30 : 60
}

module.exports = { isOverlapping, classLength }
