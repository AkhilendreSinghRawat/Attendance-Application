import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Constants from '../utils/Constants';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {windowWidth} from '../utils/Dimensions';

const ViewAttendanceYears = ({route, navigation}) => {
  const {id} = route.params;
  const [data, setData] = useState([]);

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  useFocusEffect(
    useCallback(() => {
      axios
        .get(`${Constants.API}getEmployeeDetails?id=${id}&check=year`)
        .then(res => {
          const yearData = [];
          res.data.map(item => yearData.push(item.data));
          setData(yearData.filter(unique));
        })
        .catch(err => {
          console.log('this', err);
        });
    }, [id]),
  );

  const onYearPress = year => {
    navigation.navigate('Select Month', {id: id, year: year});
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.renderContainer}
        onPress={() => onYearPress(item)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 20,
    borderWidth: 0.5,
    width: windowWidth,
  },
  text: {
    fontWeight: 'bold',
  },
});

export default ViewAttendanceYears;
