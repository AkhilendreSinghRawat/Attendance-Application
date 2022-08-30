import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {windowWidth} from '../utils/Dimensions';

const InfoCard = ({heading, ...rest}) => {
  return (
    <View style={styles.infoCard}>
      <Text>{heading + ':'}</Text>
      <View style={styles.textInput}>
        <TextInput {...rest} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    backgroundColor: 'lightblue',
    width: windowWidth,
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#ddd',
    paddingHorizontal: 50,
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default InfoCard;
