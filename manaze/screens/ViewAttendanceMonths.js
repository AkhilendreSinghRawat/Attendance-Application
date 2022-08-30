import React, {useCallback, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Constants from '../utils/Constants';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {windowWidth} from '../utils/Dimensions';

const ViewAttendanceMonths = ({route, navigation}) => {
  const DATA = [];
  const {id, year} = route.params;
  const [data, setData] = useState([]);

  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  useFocusEffect(
    useCallback(() => {
      axios
        .get(
          `${Constants.API}getEmployeeDetails?id=${id}&year=${year}&check=month`,
        )
        .then(res => {
          const monthData = [];
          res.data.map(item => monthData.push(item.data));
          setData(monthData.filter(unique));
        })
        .catch(err => {
          console.log('this', err);
        });
    }, [id, year]),
  );

  if (data.length) {
    if (data.includes('Jan')) {
      DATA.push('January');
    }
    if (data.includes('Feb')) {
      DATA.push('February');
    }
    if (data.includes('Mar')) {
      DATA.push('March');
    }
    if (data.includes('Apr')) {
      DATA.push('April');
    }
    if (data.includes('May')) {
      DATA.push('May');
    }
    if (data.includes('Jun')) {
      DATA.push('June');
    }
    if (data.includes('Jul')) {
      DATA.push('July');
    }
    if (data.includes('Aug')) {
      DATA.push('August');
    }
    if (data.includes('Sep')) {
      DATA.push('September');
    }
    if (data.includes('Oct')) {
      DATA.push('Octuber');
    }
    if (data.includes('Nov')) {
      DATA.push('November');
    }
    if (data.includes('Dec')) {
      DATA.push('December');
    }
  }

  const onMonthPress = month => {
    navigation.navigate('Date', {
      id: id,
      year: year,
      month: month.slice(0, 3),
    });
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.renderContainer}
        onPress={() => onMonthPress(item)}>
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList data={DATA} renderItem={renderItem} />
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

export default ViewAttendanceMonths;
