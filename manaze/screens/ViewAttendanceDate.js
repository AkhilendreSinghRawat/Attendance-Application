/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Constants from '../utils/Constants';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {windowWidth} from '../utils/Dimensions';

const ViewAttendanceDate = ({route, navigation}) => {
  const {id, year, month} = route.params;
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      axios
        .get(
          `${Constants.API}getEmployeeDetails?id=${id}&year=${year}&month=${month}&check=date`,
        )
        .then(res => {
          setData(res.data);
        })
        .catch(err => {
          console.log('this', err);
        });
    }, [id, month, year]),
  );

  const renderItem = ({item}) => {
    return (
      <View style={styles.renderContainer}>
        <Text style={[styles.text, {paddingLeft: 20}]}>{item.date}</Text>
        <Text style={styles.text}>
          {item.joiningTime ? item.joiningTime : '-'}
        </Text>
        <Text style={styles.text}>
          {item.leavingTime ? item.leavingTime : '-'}
        </Text>
        <Text style={styles.text}>
          {item.overtime ? item.overtimeCount : '-'}
        </Text>
        {item.leave && (
          <Text style={[styles.text && {color: 'orange'}, {paddingRight: 20}]}>
            Leave
          </Text>
        )}
        {item.joiningTime &&
          !item.holiday &&
          !item.leave &&
          (item.absent === true ? (
            <Text style={[styles.text && {color: 'red'}, {paddingRight: 20}]}>
              Absent
            </Text>
          ) : (
            <Text style={[styles.text && {color: 'green'}, {paddingRight: 20}]}>
              Present
            </Text>
          ))}
        {item.holiday && !item.overtime && (
          <Text style={[styles.text && {color: 'black'}, {paddingRight: 20}]}>
            Holiday
          </Text>
        )}
        {item.overtime && !item.joiningTime && (
          <Text style={[styles.text && {color: 'blue'}, {paddingRight: 20}]}>
            Overtime
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={[styles.text, styles.colorBlack, {paddingLeft: 20}]}>
          Date
        </Text>
        <View style={styles.aligning}>
          <Text style={[styles.text, styles.colorBlack]}>Joining</Text>
          <Text style={[styles.text, styles.colorBlack]}>Time</Text>
        </View>
        <View style={styles.aligning}>
          <Text style={[styles.text, styles.colorBlack]}>Leaving</Text>
          <Text style={[styles.text, styles.colorBlack]}>Time</Text>
        </View>
        <View style={styles.aligning}>
          <Text style={[styles.text, styles.colorBlack]}>Overtime</Text>
        </View>
        <View style={styles.aligning}>
          <Text style={[styles.text, styles.colorBlack, {paddingRight: 20}]}>
            Present/
          </Text>
          <Text style={[styles.text, styles.colorBlack, {paddingRight: 20}]}>
            Absent/
          </Text>
          <Text style={[styles.text, styles.colorBlack, {paddingRight: 20}]}>
            Leave/
          </Text>
          <Text style={[styles.text, styles.colorBlack, {paddingRight: 20}]}>
            Holiday
          </Text>
        </View>
      </View>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renderContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderWidth: 0.5,
    width: windowWidth,
    justifyContent: 'space-between',
  },
  topContainer: {
    flexDirection: 'row',
    borderWidth: 0.5,
    width: windowWidth,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  text: {
    fontWeight: 'bold',
  },
  aligning: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  colorBlack: {
    color: 'black',
  },
});

export default ViewAttendanceDate;
