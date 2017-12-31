import React, { Component } from 'react';
import { Text, ScrollView, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Field, reduxForm, FormSection } from 'redux-form';
import NavHeader from '../../Components/NavHeader';
import CellSwitch from '../../Components/CellWithSwitch';
import StepsIndicators from '../../Components/StepsIndicators';
import { invitationActionCreators } from '../../Redux/InvitationsRedux';
import { NavigationActions } from 'react-navigation';

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
    this.props.handleSubmit(values => {
      this.props.dispatch(invitationActionCreators.inviteUserRequest(values));
    })();
  };

  render() {
    const { change } = this.props;
    return (
      <Layout customStyles={{ paddingTop: 0 }}>
        <FormSection name="employee_privilege_set">
          <View>
            <Field name={'can_manage_employees'} component={renderSwitch}
                   componentProps={{
                     label: 'Pozwalaj na zarzadzanie pracownikami',
                     description: 'Zaproszony uzytkownik bedzie mogl dodawac, usuwac pracownikow ze szkoly oraz nadawac im przywileje.',
                     onChangeHandler: value => change('employee_privilege_set.can_manage_employees', value)
                   }}/>
            <Field name={'can_manage_students'} component={renderSwitch}
                   componentProps={{
                     label: 'Pozwalaj na zarzadzanie kursantami',
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
          </View>
        </FormSection>
      </Layout>
    )
  }
}

/* FIX DEFAULT VALUES BECAUSe if empty param is missing*/
export default reduxForm({
  form: 'InviteEmployee',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  initialValues: {
    employee_privilege_set: {
      can_manage_employees: true,
      can_manage_students: true,
      can_modify_schedules: false,
      is_driving: false
    }
  }
})(PrivilegesScreen);
