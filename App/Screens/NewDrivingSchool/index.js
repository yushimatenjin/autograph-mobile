/** Built in modules */
import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import { reset } from 'redux-form';
import { connect } from 'react-redux';

/** Form steps */
import InformationStep from './Information';
import CalendarStep from './Calendar';
import NotificationsStep from './Notifications';
import ScheduleSettings from './ScheduleSettings';

/** Other */
import navStyles from '../../Navigation/Styles/NavigationStyles';
import ButtonPrimary from '../../Components/ButtonPrimary';
import StepsIndicators from '../../Components/StepsIndicators';
import { drivingSchoolActionCreators } from '../../Redux/DrivingSchoolRedux';

const routeConfigs = {
  step0: {
    screen: InformationStep,
    navigationOptions: {title: 'Information'}
  },
  step1: {
    screen: NotificationsStep,
    title: 'Notification'
  },
  step2: {
    screen: CalendarStep,
    title: 'Schedule Boundaries'
  },
  step3: {
    screen: ScheduleSettings,
    title: 'Schedule Settings'
  }
};

const navigationConfigs = {
  navigationOptions: {
    header: props => {
      console.log('header::');
      console.log(props);
      return (<View>
        <NavHeader navigation={props.navigation} title={'dsas'}/>
        <StepsIndicators labels={['Informacje', 'Powiadomienia', 'Kalendarz', 'Ustawienia']}
                         activeIndex={props.navigation.state.index}/>
      </View>)
    },
    headerStyle: { elevation: 0, shadowOpacity: 0 }
  },
  initialRouteName: 'step0',
  cardStyle: navStyles.card
};

const StepFormNavigator = StackNavigator(routeConfigs, navigationConfigs);

class NewDrivingSchoolWizardForm extends Component {
  static navigationOptions = { header: null };

  constructor(props) {
    super(props);

    const { drivingSchool } = this.props;

    this.screensInfo = {
      step0: {
        formID: 'basicInformation',
        submitAction: (...args) => {
          const action = drivingSchool ? 'updateDrivingSchoolRequest' : 'createDrivingSchoolRequest';
          return drivingSchoolActionCreators[action](...args);
        },
        ref: null
      },
      step1: {
        formID: 'notificationSettings',
        submitAction: drivingSchoolActionCreators.updateEmployeeNotificationsRequest,
        ref: null
      },
      step2: {
        formID: 'scheduleBoundaries',
        submitAction: drivingSchoolActionCreators.updateScheduleBoundariesRequest,
        ref: null
      },
      step3: {
        formID: 'scheduleSettings',
        submitAction: drivingSchoolActionCreators.updateScheduleSettingsRequest,
        ref: null
      }
    };

    this.bindScreenRef = this.bindScreenRef.bind(this);
  }

  bindScreenRef = (key, ref) => this.screensInfo[key].ref = ref;

  nextStep = () => {
    const { index, routes } = this.props.navigation.state,
      currentRouteName = routes[index].routeName,
      nextRouteIndex = index + 1,
      nextRoute = currentRouteName === 'step3' ? 'main' : `step${nextRouteIndex}`,
      redirectAction = NavigationActions.navigate({ routeName: nextRoute }),
      { formID, ref, submitAction } = this.screensInfo[currentRouteName],
      { navigation } = this.props;

    ref.props.handleSubmit(values => navigation.dispatch(submitAction(values, formID, redirectAction)))();

    if (currentRouteName === 'step3') this.resetForm();
  };

  resetForm = () => Object.keys(this.screensInfo).forEach(step => this.props.resetForm(this.screensInfo[step].formID));

  isSubmitting = () => {
    const { index, routes } = this.props.navigation.state,
      currentRouteName = routes[index].routeName,
      { formID } = this.screensInfo[currentRouteName],
      { form } = this.props;

    return form[formID] && form[formID].submitting
  };

  render() {

    return (
      <View style={{ flex: 1 }}>
        <StepFormNavigator navigation={this.props.navigation} screenProps={{ bindScreenRef: this.bindScreenRef }}/>

        <ButtonPrimary onPress={this.nextStep} submitting={this.isSubmitting()}>Dalej</ButtonPrimary>
      </View>
    )
  }
}

NewDrivingSchoolWizardForm.router = StepFormNavigator.router;

const mapStateToProps = state => ({ form: state.form, drivingSchool: state.context.currentDrivingSchoolID });
const mapDispatchToProps = dispatch => ({
  resetForm: formID => {
    dispatch(reset(formID))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewDrivingSchoolWizardForm);
