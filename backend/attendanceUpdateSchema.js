const mongoose = require('mongoose')

const attendanceUpdateSchema = new mongoose.Schema({
  id: String,
  name: String,
  month: String,
  date: String,
  year: String,
  absent: Boolean,
  leave: Boolean,
  holiday: Boolean,
  joiningTime: String,
  leavingTime: String,
  overtime: Boolean,
  overtimeCount: Number,
})

module.exports = mongoose.model('attendance', attendanceUpdateSchema)
