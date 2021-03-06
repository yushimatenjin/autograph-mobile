import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Colors, Fonts } from '../Themes/';
import Icon from 'react-native-vector-icons/Entypo';
import { slotHelper } from '../Lib/SlotHelpers';

export default Slot = ({ id, active=false, containerStyles = {}, onPress = () => {} }) => {
  const CHECK_BULLET_SIZE = 15;

  const styles = StyleSheet.create({
    container: {
      height: 44,
      flexDirection: 'row',
    },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: Colors.mediumGrey,
    },
    rightSection: {
      flex: 1,
    },
    leftSection: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: 45,
    },
    timeText: {
      fontSize: Fonts.size.small,
      fontFamily: Fonts.type.base,
      // fontWeight: minutes === '00' ? '600' : '400',
      // flex: 1,
      marginRight: 5
    },
    intervalInfo: {
      color: Colors.softBlack,
      fontSize: Fonts.size.extraSmall,
      fontFamily: Fonts.type.light,
      textAlign: 'center'
    },
    title: {
      color: Colors.softBlack,
      fontFamily: Fonts.type.medium,
      fontSize: Fonts.size.small,
    },
    textContainer: {
      alignItems: 'center',
    },
    check: {
      width: CHECK_BULLET_SIZE,
      height: CHECK_BULLET_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: CHECK_BULLET_SIZE/2,
      backgroundColor: Colors.primaryWarm,
      marginRight: 15,
    },
    body: {
      flex: 1
    },
    booked: {
      //flex: 1 why does NOT work?
      width: '100%',
      height: '100%',
      backgroundColor: Colors.snow,
      borderRightWidth: 5,
      borderRightColor: Colors.primaryCold,
      borderLeftWidth: 5,
      borderLeftColor: Colors.primaryCold,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    notBooked: {
      //flex: 1 why does NOT work?
      width: '100%',
      height: '100%',
      backgroundColor: Colors.subtleGray,
      justifyContent: 'center',
      alignItems: 'center'
    },
    freeSlotLabel: {
      color: Colors.mediumGrey,
      fontFamily: Fonts.type.medium
    }
  });

  const renderBody = () => {
    if(active) {
      return (
        <View style={styles.booked}>
          <View style={styles.check}>
            <Icon name={'check'} color={Colors.snow} size={10}/>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.intervalInfo}>{`${slotHelper.getSlotInterval(id)}`}</Text>
            <Text style={styles.title}>DYSPOZYCJA</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.notBooked}><Text style={styles.freeSlotLabel}>WOLNE</Text></View>
      )
    }
  };

  return (
    <View style={[styles.container, containerStyles]}>
      <View style={styles.leftSection}>
        <Text style={styles.timeText}>{slotHelper.idToHour(id)}</Text>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          {renderBody()}
        </TouchableOpacity>
      </View>
    </View>
  );
};
