import React, {useEffect, useState} from 'react';
import {View, FlatList, Text, StyleSheet, TouchableOpacity} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedCheckboxIds} from '../store/slices/appSlice';

const SelectMultipleEmployees = () => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.appReducer);
  const [select, setSelect] = useState(false);

  useEffect(() => {
    if (!select) {
      dispatch(setSelectedCheckboxIds([]));
    }
    if (select) {
      const newids = [];
      data?.employeesData.map(item => {
        newids.push(item.id);
      });
      dispatch(setSelectedCheckboxIds(newids));
    }
  }, [data?.employeesData, dispatch, select]);

  const renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.checkBox}>
          <CheckBox
            value={data?.selectedCheckboxIds.includes(item.id) ? true : false}
            onValueChange={() => {
              const newIds = [...data?.selectedCheckboxIds];
              const index = newIds.indexOf(item.id);
              if (index > -1) {
                newIds.splice(index, 1);
              } else {
                newIds.push(item.id);
              }
              dispatch(setSelectedCheckboxIds(newIds));
            }}
          />
          <View style={styles.center}>
            <Text style={styles.label}>{item.name}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topCheckboxContainer}>
        <CheckBox value={select} onValueChange={setSelect} />
        <View style={styles.center}>
          <Text style={styles.selectAllText}>Select All Employees</Text>
        </View>
      </View>
      <FlatList data={data?.employeesData} renderItem={renderItem} />
      <TouchableOpacity style={styles.selectButtonContainer}>
        <Text style={styles.selectButton}>Select</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topCheckboxContainer: {
    flexDirection: 'row',
  },
  checkBox: {
    flexDirection: 'row',
  },
  center: {
    justifyContent: 'center',
  },
  selectAllText: {
    fontWeight: 'bold',
  },
  selectButtonContainer: {},
  selectButton: {},
});

export default SelectMultipleEmployees;
