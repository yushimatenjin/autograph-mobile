import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Fonts, Colors } from '../Themes/';
import InputFieldLayout from './InputFieldLayout';
import DatePicker from 'react-native-datepicker';

export default DateSelector = ({ input, meta, setValue, inputLabel, asterix = false, maxDate }) => {
  const styles = StyleSheet.create({
    datepicker: {
      flex: 1,
      alignItems: 'center'
    },
    datepickerRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    datepickerLabel: {
      fontSize: Fonts.size.medium,
      color: Colors.primaryWarm
    }
  });

  const datepickerCustom = {
    dateInput: {
      borderWidth: 0,
      alignItems: 'flex-start',
      height: Fonts.size.medium
    },
    dateText: {
      textAlign: 'left',
      fontSize: Fonts.size.medium
    },
    dateTouchBody: {
      height: Fonts.size.medium
    },
    btnTextConfirm: {
      color: Colors.primaryWarm
    }
  };

  return (
    <InputFieldLayout meta={meta} label={inputLabel} required={asterix} line={false}>
      <View style={styles.datepickerRow}>
        <DatePicker
          style={styles.datepicker}
          customStyles={datepickerCustom}
          ref={(picker) => {
            this.datePicker = picker;
          }}
          date={input.value}
          showIcon={false}
          mode="date"
          placeholder="YYYY-MM-DD"
          format="YYYY-MM-DD"
          confirmBtnText="Potwierdz"
          cancelBtnText="Anuluj"
          onDateChange={(date) => {
            setValue(date)
          }}
          maxDate={maxDate}
        />
        <TouchableOpacity style={{ flex: 1 }} onPress={() => this.datePicker.onPressDate()}>
          <Text style={styles.datepickerLabel}>Wybierz datę</Text>
        </TouchableOpacity>
      </View>
    </InputFieldLayout>
  );
}
