import React from 'react';
import {StyleSheet, Text, TextInput, ToastAndroid, View} from 'react-native';

const TimeInput = ({
  overtimeHour,
  setOvertimeHour,
  overtimeMin,
  setOvertimeMin,
}) => {
  return (
    <View style={styles.boxContainer}>
      <View style={styles.headingContainer}>
        <Text style={styles.headingText}>Overtime: </Text>
      </View>
      <View>
        <Text style={styles.text}>Hour</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={value => {
            if (value <= 23 && value >= 0) {
              setOvertimeHour(value);
              return;
            }
            ToastAndroid.showWithGravity(
              'Enter Valid Hours',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }}
          value={overtimeHour}
          placeholder={'0 hour'}
        />
      </View>
      <View>
        <Text style={styles.text}>Min</Text>
        <TextInput
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={value => {
            if (value <= 59 && value >= 0) {
              setOvertimeMin(value);
              return;
            }
            ToastAndroid.showWithGravity(
              'Enter Valid Mins',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }}
          value={overtimeMin}
          placeholder={'0 min'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    height: 50,
    width: 50,
    margin: 5,
    backgroundColor: '#ddd',
  },
  boxContainer: {
    flexDirection: 'row',
    margin: 20,
  },
  text: {
    fontWeight: 'bold',
    paddingHorizontal: 20,
  },
  headingContainer: {justifyContent: 'center'},
  headingText: {
    fontWeight: 'bold',
    paddingHorizontal: 20,
    fontSize: 20,
  },
});

export default TimeInput;
