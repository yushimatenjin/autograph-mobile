import React, { Component } from 'react';
import { View } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import CellSwitch from '../../Components/CellWithSwitch';
import NavHeader from '../../Components/NavHeader';
import StepsIndicators from '../../Components/StepsIndicators';
import Layout from '../../Components/Layout';
import FormErrorMessage from '../../Components/GenerealFormErrorMessage';
import { updateScheduleSettings } from '../../Redux/ScheduleSettingsRedux';
import FORM_IDS from './Constants';

const renderSwitch = ({ input, meta, componentProps }) => (
  <CellSwitch value={input.value} {...componentProps}/>
);

const FORM_ID = FORM_IDS.SCHEDULE_SETTINGS;

class ScheduleSettings extends Component {
  static navigationOptions = {
    header: props => {
      return (<View><NavHeader navigation={props.navigation} title={'Notifications'}/><StepsIndicators
        labels={['Informacje', 'Powiadomienia', 'Kalendarz', 'Ustawienia']} activeIndex={3}/></View>)
    }
  };

  constructor(props) {
    super(props);

    const key = this.props.navigation.state.routeName;
    this.props.screenProps.bindScreenRef(key, this);
  }

  // componentWillReceiveProps(nextProps) {
  //   if(this.props.submitting && !nextProps.submitting && nextProps.submitSucceeded) {
  //     const { navigation, screenProps } = this.props;
  //     const { navKey } = screenProps;
  //     const title = 'Congratulations!';
  //     const message = 'Your registration completed successfully. Once we verify your request you can start your work.';
  //     const goToStartScreen = NavigationActions.back({
  //       key: navKey,
  //     });
  //     const buttons = [{
  //       text: 'OK', onPress: () => {
  //         navigation.dispatch(goToStartScreen);
  //       }
  //     }];
  //     Alert.alert(title, message, buttons);
  //   }
  // }

  submitForm() {
    this.props.handleSubmit(updateScheduleSettings)();
  }

  render() {
    const { change, error } = this.props;

    return (
      <Layout>
        <FormErrorMessage>{error}</FormErrorMessage>
        <Field name={'last_minute_booking_enabled'} component={renderSwitch}
               componentProps={{
                 label: 'Zapisy na ostatnia chwile',
                 description: 'Pozwalaj na zapisy mniej niż dzień przed planowaną jazdą..',
                 onChangeHandler: value => change('last_minute_booking_enabled', value)
               }}/>
        <Field name={'holidays_enrollment_enabled'} component={renderSwitch}
               componentProps={{
                 label: 'Święta i dni wolne od pracy',
                 description: 'Zablokuj możliwoś zapisów w dnia ustawowo wolne od pracy.',
                 onChangeHandler: value => change('holidays_enrollment_enabled', value)
               }}/>
      </Layout>
    )
  }
}

export default reduxForm({
  form: FORM_ID,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  initialValues: {
    last_minute_booking_enabled: true,
    holidays_enrollment_enabled: false
  }
})(ScheduleSettings);
