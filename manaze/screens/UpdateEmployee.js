import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import InfoCard from '../components/InfoCard';
import Constants from '../utils/Constants';
import {useSelector} from 'react-redux';

const UpdateEmployee = ({route, navigation}) => {
  const {id} = route.params;
  const data = useSelector(state => state.appReducer);
  const employeeData = data?.employeesData.filter(item => item.id === id);
  const [firstName, setFirstName] = useState(employeeData[0].firstName);
  const [lastName, setLastName] = useState(employeeData[0].lastName);
  const [phoneNumber, setPhoneNumber] = useState(
    `${employeeData[0].phoneNumber}`,
  );
  const [salary, setSalary] = useState(`${employeeData[0].salary}`);

  const UpdateEmployeePressed = () => {
    Alert.alert('Are you Sure', `You want to update ${employeeData[0].name}`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          axios
            .post(`${Constants.API}updateEmployee`, {
              id: employeeData[0].id,
              firstName: firstName,
              lastName: lastName,
              phoneNumber: phoneNumber,
              salary: salary,
            })
            .then(res => {
              if (res.data.modifiedCount) {
                ToastAndroid.showWithGravity(
                  firstName + ' ' + lastName + ' Info Updated',
                  ToastAndroid.SHORT,
                  ToastAndroid.CENTER,
                );
              }
              navigation.goBack();
            })
            .catch(err => console.log('error', err));
        },
      },
    ]);

    Keyboard.dismiss();
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
      <TouchableOpacity onPress={UpdateEmployeePressed} style={styles.save}>
        <Text>Update Employee</Text>
      </TouchableOpacity>
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
});

export default UpdateEmployee;
