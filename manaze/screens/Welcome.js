import axios from 'axios';
import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {getEmployeesData} from '../store/slices/appSlice';
import Constants from '../utils/Constants';

const Welcome = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${Constants.API}getAllUsers`)
      .then(res => {
        const newData = [];
        res.data.map(item =>
          newData.push({
            id: item._id,
            name: item.firstName + ' ' + item.lastName,
            firstName: item.firstName,
            lastName: item.lastName,
            phoneNumber: item.phoneNumber,
            salary: item.salary,
          }),
        );
        dispatch(getEmployeesData(newData));
      })
      .catch(err => {
        console.log(err);
      });
  }, [dispatch]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>WELCOME!!</Text>
    </View>
  );
};

export default Welcome;
