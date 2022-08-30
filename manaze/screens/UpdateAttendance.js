/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import DropdownInput from '../components/Dropdown';
import Constants from '../utils/Constants';
import DatePickerComponent from '../components/DatePickerComponent';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedCheckboxIds} from '../store/slices/appSlice';
import TimeInput from '../components/TimeInput';

const moreOptionsData = [
  {id: 1, name: 'Absent'},
  {id: 2, name: 'Leave'},
  {id: 3, name: 'Declare Holiday'},
  {id: 4, name: 'Overtime'},
];

const UpdateAttendance = ({navigation}) => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.appReducer);
  const [selectedId, setSelectedId] = useState(null);
  const [moreOptions, setMoreOptions] = useState(null);
  const [leave, setLeave] = useState(false);
  const [absent, setAbsent] = useState(false);
  const [holiday, setHoliday] = useState(false);
  const [overtime, setOvertime] = useState(false);
  const [time1, setTime1] = useState(new Date());
  const [time2, setTime2] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [openJoiningTime, setOpenJoiningTime] = useState(false);
  const [openLeavingTime, setOpenLeavingTime] = useState(false);
  const [isSelected, setIsSelected] = useState();
  const [joiningTime, setJoiningTime] = useState();
  const [leavingTime, setLeavingTime] = useState();
  const [overtimeHour, setOvertimeHour] = useState(0);
  const [overtimeMin, setOvertimeMin] = useState(0);

  const callBackEmployeeFunc = value => {
    setSelectedId(value);
  };

  const callBackOptionsFunc = value => {
    setMoreOptions(value);
  };

  const onPressMultipleEmployees = () => {
    navigation.navigate('Select Multiple Employees');
  };

  useEffect(() => {
    setOvertime(false);
    setHoliday(false);
    setAbsent(false);
    setLeave(false);
    if (moreOptions) {
      if (moreOptions[0] === 'Overtime') {
        setOvertime(true);
      } else if (moreOptions[0] === 'Declare Holiday') {
        setHoliday(true);
      } else if (moreOptions[0] === 'Leave') {
        setLeave(true);
      } else {
        setAbsent(true);
      }
    }
  }, [moreOptions]);

  useEffect(() => {
    setIsSelected(
      JSON.stringify(
        selectedStartDate.toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
        }),
      ).slice(4, 11) +
        JSON.stringify(
          selectedStartDate.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
          }),
        ).slice(20, 25),
    );
  }, [selectedStartDate]);

  useEffect(() => {
    setJoiningTime(
      JSON.stringify(
        time1.toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
        }),
      ).slice(12, 17),
    );
  }, [time1]);

  useEffect(() => {
    setLeavingTime(
      JSON.stringify(
        time2.toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
        }),
      ).slice(12, 17),
    );
  }, [time2]);

  const savePressed = () => {
    if (!holiday && selectedId === null && !data?.selectedCheckboxIds.length) {
      Alert.alert('Select Employee Name');
      return;
    }
    if (
      !leave &&
      !absent &&
      !holiday &&
      (joiningTime === '' || leavingTime === '')
    ) {
      Alert.alert('Fill Joining and Leaving Time');
      return;
    }
    if (!selectedStartDate) {
      Alert.alert('Select a Date');
      return;
    }
    let overtimeCount = 0;
    let finalData;
    if (overtime) {
      overtimeCount = Number(overtimeHour) * 60 + Number(overtimeMin);
      finalData = !data?.selectedCheckboxIds.length
        ? {
            id: selectedId[1],
            name: selectedId[0],
            month: isSelected.toString().slice(1, 4),
            date: isSelected.toString().slice(5, 7),
            year: isSelected.toString().slice(8),
            overtime: overtimeCount,
            entries: 'single',
          }
        : {
            id: data?.selectedCheckboxIds,
            month: isSelected.toString().slice(1, 4),
            date: isSelected.toString().slice(5, 7),
            year: isSelected.toString().slice(8),
            overtime: overtimeCount,
            entries: 'multiple',
          };
    } else if (!holiday) {
      finalData = !data?.selectedCheckboxIds.length
        ? {
            id: selectedId[1],
            name: selectedId[0],
            month: isSelected.toString().slice(1, 4),
            date: isSelected.toString().slice(5, 7),
            year: isSelected.toString().slice(8),
            absent: absent,
            leave: leave,
            joiningTime: joiningTime,
            leavingTime: leavingTime,
            entries: 'single',
          }
        : {
            id: data?.selectedCheckboxIds,
            month: isSelected.toString().slice(1, 4),
            date: isSelected.toString().slice(5, 7),
            year: isSelected.toString().slice(8),
            absent: absent,
            leave: leave,
            holiday: holiday,
            joiningTime: joiningTime,
            leavingTime: leavingTime,
            entries: 'multiple',
          };
    } else {
      finalData = {
        month: isSelected.toString().slice(1, 4),
        date: isSelected.toString().slice(5, 7),
        year: isSelected.toString().slice(8),
        entries: 'holiday',
      };
    }
    if (leave || absent) {
      finalData.joiningTime = null;
      finalData.leavingTime = null;
    }
    axios
      .post(`${Constants.API}updateAttendance`, finalData)
      .then(res => {
        console.log(res.data);
        ToastAndroid.showWithGravity(
          ' Attendance Updated',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onPressSingleEmployee = () => {
    dispatch(setSelectedCheckboxIds([]));
  };

  return (
    <View style={styles.container}>
      {!holiday && (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={[
              styles.selectEmployee,
              data?.selectedCheckboxIds.length && {
                backgroundColor: 'lightblue',
              },
            ]}
            onPress={onPressMultipleEmployees}>
            <Text>Select Multiple Employees</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.selectEmployee,
              !data?.selectedCheckboxIds.length && {
                backgroundColor: 'lightblue',
              },
            ]}
            onPress={onPressSingleEmployee}>
            <Text>Select an Employee</Text>
          </TouchableOpacity>
        </View>
      )}
      {!holiday && !data?.selectedCheckboxIds.length ? (
        <View style={{zIndex: 2}}>
          <DropdownInput
            data={data?.employeesData}
            search={true}
            labelRender={true}
            placeholderText={'Select an Employee'}
            cbFunc={callBackEmployeeFunc}
          />
        </View>
      ) : null}
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {overtime && (
          <TimeInput
            overtimeHour={overtimeHour}
            setOvertimeHour={setOvertimeHour}
            overtimeMin={overtimeMin}
            setOvertimeMin={setOvertimeMin}
          />
        )}
        {!overtime && !leave && !absent && !holiday && (
          <View>
            <View style={styles.timeInputContainer}>
              <TouchableOpacity
                style={styles.calendarText}
                onPress={() => setOpenJoiningTime(true)}>
                <Text style={styles.text}>Select Joining Time:</Text>
              </TouchableOpacity>
              <View style={{justifyContent: 'center'}}>
                <Text style={[styles.text, styles.dateText]}>
                  {joiningTime}
                </Text>
              </View>
              <DatePickerComponent
                open={openJoiningTime}
                setOpen={setOpenJoiningTime}
                date={time1}
                setDate={setTime1}
                mode="time"
                is24hourSource="locale"
              />
            </View>
            <View style={styles.timeInputContainer}>
              <TouchableOpacity
                style={styles.calendarText}
                onPress={() => setOpenLeavingTime(true)}>
                <Text style={styles.text}>Select Leaving Time:</Text>
              </TouchableOpacity>
              <View style={{justifyContent: 'center'}}>
                <Text style={[styles.text, styles.dateText]}>
                  {leavingTime}
                </Text>
              </View>
              <DatePickerComponent
                open={openLeavingTime}
                setOpen={setOpenLeavingTime}
                date={time2}
                setDate={setTime2}
                mode="time"
                is24hourSource="locale"
              />
            </View>
          </View>
        )}
        <View style={styles.calendarContainer}>
          <TouchableOpacity
            style={styles.calendarText}
            onPress={() => setOpenDate(true)}>
            <Text style={styles.text}>Select Date:</Text>
          </TouchableOpacity>
          <View style={{justifyContent: 'center'}}>
            <Text style={[styles.text, styles.dateText]}>{isSelected}</Text>
          </View>
          <DatePickerComponent
            open={openDate}
            setOpen={setOpenDate}
            date={selectedStartDate}
            setDate={setSelectedStartDate}
            mode="date"
          />
        </View>
      </View>
      <DropdownInput
        data={moreOptionsData}
        search={false}
        labelRender={false}
        placeholderText={'More Options'}
        cbFunc={callBackOptionsFunc}
      />
      <TouchableOpacity
        onPress={savePressed}
        style={[styles.attendanceButton, {backgroundColor: 'cyan'}]}>
        <Text>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  attendanceButton: {
    backgroundColor: 'lightgray',
    paddingHorizontal: 40,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 100,
  },
  attendanceContainer: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  timeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  calendarText: {
    backgroundColor: 'lightblue',
    borderRadius: 50,
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  calendarContainer: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 20,
  },
  selectEmployee: {
    marginLeft: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ddd',
    borderRadius: 40,
  },
});

export default UpdateAttendance;
