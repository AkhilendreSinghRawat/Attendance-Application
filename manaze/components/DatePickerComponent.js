import React from 'react';
import {StyleSheet, View} from 'react-native';
import DatePicker from 'react-native-date-picker';

const DatePickerComponent = props => {
  const {open, setOpen, date, setDate, mode} = props;

  return (
    <View style={styles.calendarContainer}>
      <DatePicker
        modal
        mode={mode}
        open={open}
        date={date}
        onConfirm={value => {
          setOpen(false);
          setDate(value);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default DatePickerComponent;
