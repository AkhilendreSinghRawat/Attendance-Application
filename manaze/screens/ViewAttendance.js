import React from 'react';
import {FlatList, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {windowWidth} from '../utils/Dimensions';
import {useSelector} from 'react-redux';

const ViewAttendance = ({navigation}) => {
  const data = useSelector(state => state.appReducer);

  const onEmployeeNamePress = id => {
    navigation.navigate('Select Years', {
      id: id,
    });
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.renderContainer}
        onPress={() => onEmployeeNamePress(item.id)}>
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        renderItem={renderItem}
        data={data?.employeesData}
        keyExtractor={item => item.id}
      />
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

export default ViewAttendance;
