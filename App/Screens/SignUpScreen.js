import { Text, View, ScrollView } from 'react-native';
import React, { Component } from 'react';
import NavHeader from '../Components/NavHeader';
import {reduxForm, Field } from 'redux-form';
import RadioButton from '../Components/RadioButton';
import InputField from '../Components/InputField';
import CheckBox from '../Components/CheckBox';
import InputLabel from '../Components/InputLabel';
import {StyleSheet} from 'react-native';
import {Fonts, Colors} from '../Themes/';
import PrimaryButton from '../Components/ButtonPrimary';
import Layout from '../Components/Layout';
import DatePicker from 'react-native-datepicker';

const styles = StyleSheet.create({
  selectRow: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingTop: 10
  },
  selectOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectLabel: {
    fontSize: Fonts.size.medium,
    color: Colors.strongGrey,
    marginLeft: 10
  },
  acceptTermsRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  acceptTermsLabel: {
    fontSize: Fonts.size.small,
    color: Colors.strongGrey,
    marginLeft: 20
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    marginTop: 43
  },
  datepicker: {
    marginBottom: 15,
  },
});

const datepickerCustom = {
  dateInput: {
    borderWidth: 0,
    alignItems: 'flex-start'
  },
  dateText: {
    textAlign: 'left',
    fontSize: Fonts.size.medium
  }
};

class SignUpScreen extends Component {
  static navigationOptions = {
    header: (props) => <NavHeader navigation={props.navigation} title={'Załóż konto'} />
  };

  constructor (props) {
    super(props);
    this.state = {date:"2016-05-15"};
  }

  render () {
    return (
      <Layout>
        <InputLabel label={'Kim jestes?'} required={true}/>
        <View style={styles.selectRow} >
          <View style={styles.selectOption}>
            <Field name={'role'} boundValue={'employee'} setValue={ ()=> this.props.change('role', 'employee') } component={RadioButton} />
            <Text style={styles.selectLabel}>Pracownik</Text>
          </View>
          <View style={styles.selectOption}>
            <Field name={'role'} boundValue={'student'} setValue={ ()=> this.props.change('role', 'student') } component={RadioButton} />
            <Text style={styles.selectLabel}>Kursant</Text>
          </View>
        </View>

        <Field name={'email'} component={InputField} label={'Email'} required={true} />
        <Field name={'firstName'} component={InputField} label={'Imię'} required={true}/>
        <Field name={'lastName'} component={InputField} label={'Nazwisko'} required={true}/>
        <Field name={'password'} component={InputField} label={'Haslo'} required={true} options={{secureTextEntry: true}} />
        <Field name={'passwordConfirmation'} component={InputField} label={'Potwierdź haslo '} required={true} options={{secureTextEntry: true}} />

        <InputLabel label={'Plec'}/>
        <View style={styles.selectRow} >
          <View style={styles.selectOption}>
            <Field name={'gender'} boundValue={'male'} setValue={ ()=> this.props.change('gender', 'male') } component={RadioButton} />
            <Text style={styles.selectLabel}>Mężczyzna</Text>
          </View>
          <View style={styles.selectOption}>
            <Field name={'gender'} boundValue={'female'} setValue={ ()=> this.props.change('gender', 'female') } component={RadioButton} />
            <Text style={styles.selectLabel}>Kobieta</Text>
          </View>
        </View>

        <InputLabel label={'Data urodzenia'} required={true}/>
        <DatePicker
          style={styles.datepicker}
          customStyles={datepickerCustom}
          date={this.state.date}
          showIcon={false}
          mode="date"
          placeholder="Kliknij aby prowadzic date"
          format="YYYY-MM-DD"
          confirmBtnText="Potwierdz"
          cancelBtnText="Anuluj"
          onDateChange={(date) => {this.setState({date: date})}}
        />

        <View style={styles.acceptTermsRow}>
          <Field name={'accepted'} setValue={ (value)=> () => this.props.change('accepted', value) } component={CheckBox} />
          <Text style={styles.acceptTermsLabel}>Zgadzam się na zasady i warunki serwisu AutoGraph.</Text>
        </View>
        <View style={styles.wrapper}>
          <PrimaryButton>Zarejestruj</PrimaryButton>
        </View>
      </Layout>
    )
  }
}

export default reduxForm({form: 'signUp', initialValues: { accepted: false, gender: 'male' } })(SignUpScreen);
