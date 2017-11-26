import React, {Component} from 'react';
import {Text, View, TextInput} from 'react-native';
import {StyleSheet} from 'react-native';
import {Fonts, Colors} from '../Themes/';

export default InputField = ({input, meta, label, required=false, placeholder}) => {

  const styles = StyleSheet.create({
    container: {

    },
    labelContainer: {
      flexDirection: 'row'
    },
    label: {
      fontSize: Fonts.size.small,
      lineHeight: Fonts.size.small,
      color: Colors.strongGrey
    },
    input: {
      paddingVertical: 11,
      borderBottomWidth: 1,
      borderBottomColor: meta.error ? Colors.salmon : Colors.mediumGrey,
      fontSize: Fonts.size.medium,
      color: meta.error ? Colors.salmon : 'black'
    },
    footer: {
      height: 25

    },
    errorZone: {
      color: Colors.salmon,
      fontSize: Fonts.size.small
    },
    asterix: {
      color: Colors.salmon,
      fontSize: Fonts.size.small,
      lineHeight: Fonts.size.small,
      marginLeft: 3
    }
  });

  return (
    <View style={styles.container}>

      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        { required && <Text style={styles.asterix}>*</Text>}
      </View>

      <TextInput value={input.value} style={styles.input} placeholder={placeholder}/>

      <View style={styles.footer}>
        {meta.error && <Text style={styles.errorZone}>{meta.error}</Text> }
      </View>
    </View>
  );
}