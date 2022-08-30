/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import InfoCard from '../components/InfoCard';
import Constants from '../utils/Constants';
import {windowWidth} from '../utils/Dimensions';
import {useDispatch, useSelector} from 'react-redux';
import {setEmployeesData, clearEmployeeData} from '../store/slices/appSlice';

const EmployeeRegistration = ({navigation}) => {
  const data = useSelector(state => state.appReducer);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [salary, setSalary] = useState(null);
  const [optionsMenu, setOptionsMenu] = useState(false);
  const [itemId, setItemId] = useState(null);
  const dispatch = useDispatch();

  const addNewEmployeeFunc = () => {
    axios
      .post(`${Constants.API}addNewUser`, {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        salary: salary,
      })
      .then(res => {
        ToastAndroid.showWithGravity(
          JSON.stringify(res.data.firstName) +
            ' ' +
            JSON.stringify(res.data.lastName) +
            ' Added',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        setFirstName(null);
        setLastName(null);
        setPhoneNumber(null);
        setSalary(null);
        dispatch(
          setEmployeesData({
            id: res.data._id,
            name: res.data.firstName + ' ' + res.data.lastName,
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            phoneNumber: res.data.phoneNumber,
            salary: res.data.salary,
          }),
        );
        Keyboard.dismiss();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deletePressed = item => {
    Alert.alert('Are you Sure', `You want to delete ${item.name}`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          axios
            .delete(`${Constants.API}deleteUser?id=${item.id}`)
            .then(res => {
              dispatch(clearEmployeeData(item.id));
              setOptionsMenu(false);
            })
            .catch(err => console.log(err));
        },
      },
    ]);
  };

  const optionsMenuPressed = id => {
    if (itemId === null || itemId !== id) {
      setOptionsMenu(true);
      setItemId(id);
    }
    if (itemId === id) {
      setOptionsMenu(false);
      setItemId(null);
    }
  };

  const editPressed = id => {
    navigation.navigate('Update Employee Info', {
      id: id,
    });
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.renderContainer}
        onPress={() => optionsMenuPressed(item.id)}>
        <Text style={item.id === itemId && optionsMenu && {fontWeight: 'bold'}}>
          {item.name}
        </Text>
        {optionsMenu && item.id === itemId && (
          <View style={styles.optionsMenuContainer}>
            <TouchableOpacity
              style={styles.borderDetails}
              onPress={() => editPressed(item.id)}>
              <Text>Edit Employee Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.borderDetails, styles.delete]}
              onPress={() => deletePressed(item)}>
              <Text>DELETE</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <InfoCard
        onChangeText={setFirstName}
        value={firstName}
        heading={'First Name'}
      />
      <InfoCard
        onChangeText={setLastName}
        value={lastName}
        heading={'Last Name'}
      />
      <InfoCard
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        keyboardType={'phone-pad'}
        heading={'Phone Number'}
        maxLength={10}
      />
      <InfoCard
        onChangeText={setSalary}
        value={salary}
        keyboardType={'numeric'}
        heading={'Salary'}
      />
      <TouchableOpacity onPress={addNewEmployeeFunc} style={styles.save}>
        <Text>Save Employee</Text>
      </TouchableOpacity>
      <View style={styles.flatlistContainer}>
        <FlatList data={data?.employeesData} renderItem={renderItem} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  save: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    margin: 20,
  },
  flatlistContainer: {
    width: windowWidth,
    backgroundColor: '#ddd',
  },
  renderContainer: {
    margin: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  trashIcon: {
    fontSize: 20,
    marginLeft: 30,
  },
  optionsMenuContainer: {
    alignItems: 'center',
  },
  borderDetails: {
    borderWidth: 0.5,
    paddingHorizontal: 80,
    marginTop: 5,
  },
  delete: {
    backgroundColor: 'red',
  },
});

export default EmployeeRegistration;
