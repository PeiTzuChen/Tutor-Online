const dayjs = require('dayjs')
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
  return true // 課程有重疊回傳true
}

// 計算課程時間
const classLength = function (date) {
  const [startTime, endTime] = parseDateTimeRange(date).slice(1, 3)
  const length =
    parseInt(startTime.split(':')[1]) - parseInt(endTime.split(':')[1])
  return length === -30 || length === 30 ? 30 : 60
}

// 計算是否兩週內課程，傳入 ('2024-03-02', 2)
const withinWeek = function (existDate, week) {
  const nowDate = dayjs().format('YYYY-MM-DD')
  const weekDate = dayjs().add(week, 'Week').format('YYYY-MM-DD')
  const datePart = existDate.slice(0, 10)

  if (datePart <= weekDate && datePart >= nowDate) return true
  else return false
}

// 按照課程時間越近越前面排序，傳入陣列，傳出陣列
const classOrder = function (classesArray) {
  return classesArray
    .map((aClass) => ({
      ...aClass,
      timeOrder: new Date(aClass.dateTimeRange.slice(0, 16))// 計算時間先後順序用
    }))
    .sort((a, b) => a.timeOrder - b.timeOrder)
}

module.exports = { isOverlapping, classLength, withinWeek, classOrder }
