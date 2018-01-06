/** Built-in modules */
import React, { Component } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { Field, reduxForm, FormSection } from 'redux-form';
import { invite } from '../../Redux/InvitationsRedux';
/** Custom components */
import NavHeader from '../../Components/NavHeader';
import CellSwitch from '../../Components/CellWithSwitch';
import StepsIndicators from '../../Components/StepsIndicators';
import Layout from '../../Components/Layout';
import FormErrorMessage from '../../Components/GenerealFormErrorMessage';

const renderSwitch = ({ input, meta, componentProps }) => (
  <CellSwitch value={input.value} {...componentProps}/>
);

class PrivilegesScreen extends Component {
  static navigationOptions = {
    header: props => {
      return (<View><NavHeader navigation={props.navigation} title={'Uprawnienia'}/><StepsIndicators
        labels={['Informacje', 'Uprawnienia']} activeIndex={1}/></View>)
    },
    headerStyle: { elevation: 0, shadowOpacity: 0 }
  };

  constructor(props) {
    super(props);

    const key = this.props.navigation.state.routeName;
    this.props.screenProps.bindScreenRef(key, this);
  }

  submitForm = () => {
    this.props.handleSubmit(invite)();
  };

  componentWillReceiveProps(nextProps) {
    if(!this.props.submitSucceeded && nextProps.submitSucceeded)
      this.renderSuccessDialog();
  }

  renderSuccessDialog = () => {
      const title = 'Congratulations!';
      const message = 'Your Invitation has been sent to given email address.';

      const buttons = [{
        text: 'OK', onPress: () => {
          this.props.screenProps.takeMeBack();
        }
      }];

      Alert.alert(title, message, buttons);
  };

  render() {
    const { change, error } = this.props;

    return (
      <Layout>
        <FormErrorMessage>{error}</FormErrorMessage>
        <FormSection name={'employee_privilege_set'}>
          <ScrollView>
            <Field name={'can_manage_employees'} component={renderSwitch}
                   componentProps={{
                     label: 'Zarzadzanie pracownikami',
                     description: 'Zaproszony uzytkownik bedzie mogl dodawac, usuwac pracownikow ze szkoly oraz nadawac im przywileje.',
                     onChangeHandler: value => change('employee_privilege_set.can_manage_employees', value)
                   }}/>
            <Field name={'can_manage_students'} component={renderSwitch}
                   componentProps={{
                     label: 'Zarzadzanie kursantami',
                     description: 'Zaproszony uzytkownik bedzie mogl dodawac, usuwac, archwiizowac kursanow oraz nadawać im dostepne lekcje..',
                     onChangeHandler: value => change('employee_privilege_set.can_manage_students', value)
                   }}/>
            <Field name={'can_modify_schedules'} component={renderSwitch}
                   componentProps={{
                     label: 'Pozwalaj na ustalanie grafiku',
                     description: 'Zaproszony uzytkownik bedzie mogl ustawiac grafik.',
                     onChangeHandler: value => change('employee_privilege_set.can_modify_schedules', value)
                   }}/>
            <Field name={'is_driving'} component={renderSwitch}
                   componentProps={{
                     label: 'Jest instruktorem',
                     description: 'Lorem ipsum dolor sit melt',
                     onChangeHandler: value => change('employee_privilege_set.is_driving', value)
                   }}/>
          </ScrollView>
        </FormSection>
      </Layout>
    )
  }
}

export default reduxForm({
  form: 'InviteEmployee',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(PrivilegesScreen);
