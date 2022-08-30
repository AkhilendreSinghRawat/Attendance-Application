const express = require('express')
const app = express()

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/attendance', () => {
  console.log('connected')
})

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const user = require('./userSchema')
const attendance = require('./attendanceUpdateSchema')

app.post('/addNewUser', (req, res) => {
  const newUser = new user({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    salary: req.body.salary,
  })
  newUser.save((err, result) => {
    if (err) {
      console.log(err)
      return
    }
    console.log(result)
    res.send(result)
  })
})

app.get('/getAllUsers', (req, res) => {
  user.find((err, docs) => {
    if (err) {
      console.log(err)
      return
    }
    res.send(docs)
  })
})

app.get('/monthYearFilter', (req, res) => {
  const result = []
  user.find((err, ids) => {
    if (err) {
      console.log(err)
      return
    }
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i]._id.toString()
      attendance.aggregate(
        [
          { $match: { id: id, month: req.query.month, year: req.query.year } },
          { $sort: { month: 1 } },
          {
            $project: {
              id: '$id',
              name: '$name',
              date: '$date',
              joiningTime: '$joiningTime',
              leavingTime: '$leavingTime',
              absent: '$absent',
              leave: '$leave',
              holiday: '$holiday',
              overtime: '$overtime',
              overtimeCount: '$overtimeCount',
            },
          },
        ],
        (err, docs) => {
          if (err) {
            console.log(err)
            return
          }
          console.log('🚀 ~ file: index.js ~ line 77 ~ user.find ~ docs', docs)
          if (docs.length) {
            result.push(docs[0].name)
          }
          if (i >= 0 && i === ids.length - 1) {
            console.log(
              '🚀 ~ file: index.js ~ line 82 ~ user.find ~ result',
              result
            )
            res.send(result)
          }
        }
      )
    }
  })
})

app.get('/getEmployeeDetails', (req, res) => {
  let matchData = {}
  let projectData = {}
  let sortData = {}

  if (req.query.check === 'year') {
    matchData = { id: req.query.id }
    projectData = { data: '$year' }
    sortData = { year: 1 }
  } else if (req.query.check === 'month') {
    matchData = { id: req.query.id, year: req.query.year }
    projectData = { data: '$month' }
    sortData = { month: 1 }
  } else if (req.query.check === 'date') {
    matchData = {
      id: req.query.id,
      year: req.query.year,
      month: req.query.month,
    }
    projectData = {
      date: '$date',
      joiningTime: '$joiningTime',
      leavingTime: '$leavingTime',
      absent: '$absent',
      leave: '$leave',
      holiday: '$holiday',
      overtime: '$overtime',
      overtimeCount: '$overtimeCount',
    }
    sortData = { date: 1 }
  }
  attendance.aggregate(
    [{ $match: matchData }, { $sort: sortData }, { $project: projectData }],
    (err, docs) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(docs)
      res.send(docs)
    }
  )
})

app.delete('/deleteUser', (req, res) => {
  console.log(req.query.id)
  user
    .findByIdAndDelete({ _id: req.query.id })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.query.Username + ' was not found')
      } else {
        res.status(200).send(req.query.Username + ' was deleted.')
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Error: ' + err)
    })
})

const updateAttendance = (data, res) => {
  attendance
    .updateOne(
      { id: data.id, date: data.date, month: data.month, year: data.year },
      data,
      {
        upsert: true,
      }
    )
    .then((result, err) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(result)
      res.send(result)
    })
}

app.post('/updateAttendance', (req, res) => {
  let data
  if (req.body.entries === 'single') {
    attendance
      .find({
        id: req.body.id,
        date: req.body.date,
        month: req.body.month,
        year: req.body.year,
      })
      .then((attendanceRes) => {
        if (req.body.overtime >= 0) {
          if (!attendanceRes.length) {
            //overtime ,single entry , not exist previosly in db
            data = {
              id: req.body.id,
              name: req.body.name,
              month: req.body.month,
              date: req.body.date,
              year: req.body.year,
              absent: false,
              leave: false,
              holiday: false,
              joiningTime: null,
              leavingTime: null,
              overtime: true,
              overtimeCount: req.body.overtime,
            }
          } else {
            //overtime ,single entry , exist previosly in db
            data = {
              id: req.body.id,
              name: req.body.name,
              month: req.body.month,
              date: req.body.date,
              year: req.body.year,
              absent: attendanceRes[0].absent,
              leave: attendanceRes[0].leave,
              holiday: false,
              joiningTime: attendanceRes[0].joiningTime,
              leavingTime: attendanceRes[0].leavingTime,
              overtime: true,
              overtimeCount: req.body.overtime,
            }
          }
        } else {
          if (!attendanceRes.length) {
            //single entry
            // update attendance not overtime , not exist previosly
            //new attendance entry
            data = {
              id: req.body.id,
              name: req.body.name,
              month: req.body.month,
              date: req.body.date,
              year: req.body.year,
              absent: req.body.absent,
              leave: req.body.leave,
              holiday: false,
              joiningTime: req.body.joiningTime,
              leavingTime: req.body.leavingTime,
              overtime: false,
              overtimeCount: 0,
            }
          } else {
            //single entry
            // update attendance not overtime , exist previosly
            data = {
              id: req.body.id,
              name: req.body.name,
              month: req.body.month,
              date: req.body.date,
              year: req.body.year,
              absent: req.body.absent,
              leave: req.body.leave,
              holiday: false,
              joiningTime: req.body.joiningTime,
              leavingTime: req.body.leavingTime,
              overtime: attendanceRes[0].overtime,
              overtimeCount: attendanceRes[0].overtimeCount,
            }
          }
        }
        updateAttendance(data, res)
      })
      .catch((err) => console.log(err))
    return
  }
  if (req.body.entries === 'multiple') {
    for (let i = 0; i < req.body.id.length; i++) {
      attendance
        .find({
          id: req.body.id[i],
          date: req.body.date,
          month: req.body.month,
          year: req.body.year,
        })
        .then((attendanceRes) => {
          let name
          user
            .findById(req.body.id[i])
            .then((userRes) => {
              name = userRes.firstName + ' ' + userRes.lastName
              if (req.body.overtime >= 0) {
                if (!attendanceRes.length) {
                  //multiple entries
                  //overtime
                  //new entry
                  data = {
                    id: req.body.id[i],
                    name: name,
                    month: req.body.month,
                    date: req.body.date,
                    year: req.body.year,
                    absent: false,
                    leave: false,
                    holiday: false,
                    joiningTime: null,
                    leavingTime: null,
                    overtime: true,
                    overtimeCount: req.body.overtime,
                  }
                } else {
                  //multiple entries
                  //overtime
                  // exist previously
                  data = {
                    id: req.body.id[i],
                    name: name,
                    month: req.body.month,
                    date: req.body.date,
                    year: req.body.year,
                    absent: attendanceRes[0].absent,
                    leave: attendanceRes[0].leave,
                    holiday: false,
                    joiningTime: attendanceRes[0].joiningTime,
                    leavingTime: attendanceRes[0].leavingTime,
                    overtime: true,
                    overtimeCount: req.body.overtime,
                  }
                }
              } else {
                //multiple entries
                //no overtime
                //new entry
                if (!attendanceRes.length) {
                  data = {
                    id: req.body.id[i],
                    name: name,
                    month: req.body.month,
                    date: req.body.date,
                    year: req.body.year,
                    absent: req.body.absent,
                    leave: req.body.leave,
                    holiday: false,
                    joiningTime: req.body.joiningTime,
                    leavingTime: req.body.leavingTime,
                    overtime: false,
                    overtimeCount: 0,
                  }
                } else {
                  //multiple entries
                  //no overtime
                  //existing
                  data = {
                    id: req.body.id[i],
                    name: name,
                    month: req.body.month,
                    date: req.body.date,
                    year: req.body.year,
                    absent: req.body.absent,
                    leave: req.body.leave,
                    holiday: false,
                    joiningTime: req.body.joiningTime,
                    leavingTime: req.body.leavingTime,
                    overtime: attendanceRes[0].overtime,
                    overtimeCount: attendanceRes[0].overtimeCount,
                  }
                }
              }
              updateAttendance(data, res)
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    }
    return
  }
  if (req.body.entries === 'holiday') {
    user
      .find()
      .then((userRes) => {
        for (let i = 0; i < userRes.length; i++) {
          const id = userRes[i]._id.toString()
          const name = userRes[i].firstName + ' ' + userRes[i].lastName
          attendance
            .find({
              id: id,
              date: req.body.date,
              month: req.body.month,
              year: req.body.year,
            })
            .then((attendanceRes) => {
              if (!attendanceRes.length) {
                //holiday
                //no previous attendance
                data = {
                  id: id,
                  name: name,
                  date: req.body.date,
                  month: req.body.month,
                  year: req.body.year,
                  absent: false,
                  leave: false,
                  holiday: true,
                  joiningTime: null,
                  leavingTime: null,
                  overtime: false,
                  overtimeCount: 0,
                }
              } else {
                // declaring holiday to already updated attendance
                //calculate and update
                let overtimeCount = 0
                if (attendanceRes[0].joiningTime) {
                  overtimeCount =
                    (Number(attendanceRes[0].leavingTime.slice(0, 2)) -
                      Number(attendanceRes[0].joiningTime.slice(0, 2))) *
                      60 +
                    Math.abs(
                      Number(attendanceRes[0].leavingTime.slice(3)) -
                        Number(attendanceRes[0].joiningTime.slice(3))
                    )
                }
                data = {
                  id: id,
                  name: name,
                  date: req.body.date,
                  month: req.body.month,
                  year: req.body.year,
                  absent: false,
                  leave: false,
                  holiday: true,
                  joiningTime: null,
                  leavingTime: null,
                  overtime: overtimeCount ? true : false,
                  overtimeCount: overtimeCount,
                }
              }
              updateAttendance(data, res)
            })
            .catch((err) => console.log(err))
        }
      })
      .catch((err) => console.log(err))
    return
  }
})

app.post('/updateEmployee', (req, res) => {
  user
    .updateOne(
      { _id: req.body.id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        salary: req.body.salary,
      }
    )
    .then((result, err) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(result)
      res.send(result)
    })
})

app.listen(3000, () => console.log('Server is Running'))
