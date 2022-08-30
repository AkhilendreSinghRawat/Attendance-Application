import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {Picker} from 'react-native-wheel-pick';
import moment from 'moment';
import {windowWidth} from '../utils/Dimensions';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Constants from '../utils/Constants';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const Salary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [pickerMonth, setPickerMonth] = useState(moment().format('MMM'));
  const [pickerYear, setPickerYear] = useState(moment().format('YYYY'));
  const [modalVisible, setModalVisible] = useState(false);

  const yearData = [];
  for (let i = 2000; i < 2100; i++) {
    yearData.push(i.toString());
  }

  const onChangeSearch = query => setSearchQuery(query);

  useFocusEffect(
    useCallback(() => {
      axios
        .get(
          `${Constants.API}monthYearFilter?&year=${pickerYear}&month=${pickerMonth}`,
        )
        .then(res => {
          setData(res.data);
        })
        .catch(err => {
          console.log('thisone', err);
        });
    }, [pickerMonth, pickerYear]),
  );

  const renderCards = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          width: windowWidth - 20,
          height: 100,
          backgroundColor: 'white',
          margin: 10,
          elevation: 15,
        }}>
        <View style={{margin: 5}}>
          <Text style={{fontWeight: 'bold'}}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {modalVisible && (
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={pickerMonth}
            pickerData={MONTHS}
            onValueChange={value => {
              setPickerMonth(value);
              console.log(value);
            }}
          />
          <Picker
            style={styles.picker}
            selectedValue={pickerYear}
            pickerData={yearData}
            onValueChange={value => {
              setPickerYear(value);
              console.log(value);
            }}
          />
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
          />
          <TouchableOpacity
            style={styles.filter}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
        <FlatList data={data} renderItem={renderCards} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
  },
  header: {
    flexDirection: 'row',
  },
  searchBar: {
    width: '75%',
    borderWidth: 0.1,
    marginBottom: 10,
    marginTop: 5,
  },
  filter: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'cyan',
    width: '25%',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 10,
    marginTop: 5,
  },
  filterText: {
    fontWeight: 'bold',
  },
  picker: {
    flex: 1,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
  },
});

export default Salary;
