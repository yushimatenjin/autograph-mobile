import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { Component } from 'react';
import { reduxForm, Field, SubmissionError, reset } from 'redux-form';
import { NavigationActions } from 'react-navigation';

import { required, isAccepted, minLength, passwordsMatch, email } from '../Lib/validators';
import RadioButtonsCollection from '../Components/RadioBoxPairInputField';
import PrimaryButton from '../Components/ButtonPrimary';
import AcceptTerms from '../Components/AcceptTerms';
import DateSelector from '../Components/DateSelector';
import InputField from '../Components/InputField';
import NavHeader from '../Components/NavHeader';
import Layout from '../Components/Layout';
import API from '../Services/Api';

const api = API.create();

const submit = navigation => values => {
  return api.signUp(values)
    .then(response => {
      if (response.ok) {
        const title = 'Congratulations!';
        const message = 'Your registration completed successfully. Please confirm your email in order to login to application.';
        const goToLogin = NavigationActions.reset({
          index: 1,
          actions: [
            NavigationActions.navigate({ routeName: 'launchScreen' }),
            NavigationActions.navigate({ routeName: 'login' })
          ]
        });
        const buttons = [{
          text: 'OK', onPress: () => {
            navigation.dispatch(goToLogin);
            navigation.dispatch(reset('signUp'));
          }
        }];
        Alert.alert(title, message, buttons);
      } else {
        const errors = {};
        Object.keys(response.data).forEach(field => {
          errors[field] = { all: response.data[field] }
        });
        throw new SubmissionError(errors);
      }
    })
};

class SignUpScreen extends Component {
  static navigationOptions = {
    header: props => <NavHeader navigation={props.navigation} title={'Załóż konto'}/>
  };

  constructor(props) {
    super(props);
  }

  render() {
    const typeData = [
      { boundValue: 'Employee', label: 'Employee' },
      { boundValue: 'Student', label: 'Student' }
    ];

    const genderData = [
      { boundValue: 'male', label: 'Male' },
      { boundValue: 'female', label: 'Female' }
    ];

    const { handleSubmit, change, submitting, navigation } = this.props;

    return (
      <Layout>
        <Field name={'type'} data={typeData} setValue={val => () => this.props.change('type', val)}
               component={RadioButtonsCollection} inputLabel={'Who are you?'} required={true} validate={required}/>

        <Field name={'email'} component={InputField} label={'Email'} required={true} validate={[required, email]}/>

        <Field name={'name'} component={InputField} label={'Imię'} required={true} validate={required}/>

        <Field name={'surname'} component={InputField} label={'Nazwisko'} required={true} validate={required}/>

        <Field name={'password'} component={InputField} label={'Haslo'} required={true}
               options={{ secureTextEntry: true }} validate={[required, minLength(8)]}/>

        <Field name={'passwordConfirmation'} component={InputField} label={'Potwierdź haslo '} required={true}
               options={{ secureTextEntry: true }} validate={[required, passwordsMatch]}/>

        <Field name={'gender'} data={genderData} setValue={val => () => change('gender', val)}
               component={RadioButtonsCollection} inputLabel={'Gender'} required={true} validate={required}/>

        <Field name={'birth_date'} setValue={val => change('birth_date', val)} maxDate={new Date()}
               component={DateSelector} inputLabel={'Date of birth'} required={true} validate={required}/>

        <Field name={'time_zone'} component={InputField} label={'Time Zone'} required={true} validate={required}/>

        <Field name={'accepted'} component={AcceptTerms} label={''}
               text={'Zgadzam się na zasady i warunki serwisu AutoGraph.'}
               setValue={value => () => change('accepted', value)}
               validate={isAccepted('You must accept terms and conditions.')}/>

        <PrimaryButton onPress={handleSubmit(submit(navigation))}>
          {submitting ? 'Wysylanie..' : 'Zarejestruj'}
        </PrimaryButton>
      </Layout>
    )
  }
}

export default reduxForm({
  form: 'signUp',
  destroyOnUnmount: false,
  initialValues: { accepted: false, time_zone: 'UTC +01:00' }
})(SignUpScreen);