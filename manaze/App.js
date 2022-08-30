import 'react-native-gesture-handler';
import React from 'react';
import EmployeeRegistration from './screens/EmployeeRegistration';
import Welcome from './screens/Welcome';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Salary from './screens/Salary';
import ViewAttendance from './screens/ViewAttendance';
import UpdateEmployee from './screens/UpdateEmployee';
import UpdateAttendance from './screens/UpdateAttendance';
import ViewAttendanceMonths from './screens/ViewAttendanceMonths';
import ViewAttendanceYears from './screens/ViewAttendanceYears';
import ViewAttendanceDate from './screens/ViewAttendanceDate';
import SelectMultipleEmployees from './screens/SelectMultipleEmployees';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const RegisterStack = () => {
  return (
    <Stack.Navigator initialRouteName="EmployeeRegistration">
      <Stack.Screen
        name="EmployeeRegistration"
        component={EmployeeRegistration}
        options={{header: () => null}}
      />
      <Stack.Screen name="Update Employee Info" component={UpdateEmployee} />
    </Stack.Navigator>
  );
};

const ViewAttendanceStack = () => {
  return (
    <Stack.Navigator initialRouteName="View Attendance Home">
      <Stack.Screen
        name="View Attendance Home"
        component={ViewAttendance}
        options={{header: () => null}}
      />
      <Stack.Screen name="Select Years" component={ViewAttendanceYears} />
      <Stack.Screen name="Select Month" component={ViewAttendanceMonths} />
      <Stack.Screen name="Date" component={ViewAttendanceDate} />
    </Stack.Navigator>
  );
};

const UpdateAttendanceStack = () => {
  return (
    <Stack.Navigator initialRouteName="UpdateAttendance">
      <Stack.Screen
        name="UpdateAttendance"
        component={UpdateAttendance}
        options={{header: () => null}}
      />
      <Stack.Screen
        name="Select Multiple Employees"
        component={SelectMultipleEmployees}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={Welcome} />
        <Drawer.Screen name="Register" component={RegisterStack} />
        <Drawer.Screen
          name="Update Attendance"
          component={UpdateAttendanceStack}
        />
        <Drawer.Screen name="Salary" component={Salary} />
        <Drawer.Screen name="View Attendance" component={ViewAttendanceStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
