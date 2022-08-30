const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: String,
  phoneNumber: {
    type: Number,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v)
      },
      message: '{VALUE} is not a valid 10 digit number!',
    },
  },
  salary: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model('user', userSchema)
