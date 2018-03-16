/** Built-in modules */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Text,
  FlatList,
  SectionList,
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../Themes/index';
/** Custom modules */
import { drivingSchoolActionCreators } from '../../Redux/DrivingSchoolRedux';
import { contextActionCreators } from '../../Redux/ContextRedux';
import { modalActionCreators, MODALS_IDS } from '../../Redux/ModalRedux';
import { schoolActivationActionCreators } from '../../Redux/SchoolActivationRedux';
import { invitationActionCreators } from '../../Redux/InvitationsRedux';

import AccountHeader from '../../Components/AccountHeader';
import DrivingSchoolCell from '../../Components/DrivingSchoolCell';
import ButtonText from '../../Components/ButtonText';
import SchoolActivationInput from './SchoolActivationInput';
import ModalTemplate from '../../Components/ModalTemplate';
import SectionHeader from '../../Components/SectionHeader';
import { isEmployee, isStudent, isDrivingSchoolOwner } from '../../Lib/AuthorizationHelpers'
import {
  isDrivingSchoolRelationActive,
  isDrivingSchoolAwaitingActivation,
  isDrivingSchoolRelationPending,
} from '../../Lib/DrivingSchoolHelpers';
import { FETCHING_STATUS } from '../../Lib/utils';
import Fonts from '../../Themes/Fonts';

/** Constants */
const SECTION_TITLES = {
  mySchools: 'Moje szkoły',
  invitingSchools: 'Zaproszenia do współpracy'
};

/** Screen */
class MySchoolsScreen extends Component {
  componentWillMount = () => {
    this.props.fetchSchoolsRequest();
  };

  navigateToNewDrivingSchoolForm = () => {
    this.props.setCurrentSchoolContext(null);
    this.props.navigation.navigate('newDrivingSchool');
  };

  navigateToSchoolContext = school => {
    const { user } = this.props;
    this.props.setCurrentSchoolContext(school.id);

    if(isEmployee(user)) {
      if(isDrivingSchoolOwner(school))
        this.props.navigation.navigate('ownerMain', {drivingSchool: school});
      else
        this.props.navigation.navigate('employeeMain', {drivingSchool: school});
    }else if(isStudent(user)){
      this.props.navigation.navigate('studentMain', {drivingSchool: school});
    }
  };

  blockUIWhenInvitationResponseRequestIsPending = () => {
    if ( this.props.invitations.status === FETCHING_STATUS.FETCHING )
      return <View style={styles.loading}>
        <ActivityIndicator size='large' color={Colors.snow}/>
      </View>;
  };

  renderListItem = ({item}) => {
    if (item.sectionPlaceholder) {
      return <View style={styles.helperContainer}>
        <Text style={styles.helperText}>
          {item.sectionPlaceholder}
        </Text>
      </View>
    } else {
      return <DrivingSchoolCell drivingSchool={item}
                                acceptInvitationRequest={this.props.acceptInvitationRequest}
                                rejectInvitationRequest={this.props.rejectInvitationRequest}
                                navigateToSchool={this.navigateToSchoolContext}
                                openActivateSchoolModal={this.props.triggerSchoolActivationDialog}
      />
    }
  };

  renderSectionHeader = ({section}) => {
    switch(section.title) {
      case SECTION_TITLES.mySchools:
        return (
          <View style={styles.headerWithBtn}>
            <SectionHeader title={section.title}/>
            <ButtonText
              onPress={this.navigateToNewDrivingSchoolForm}
              customTextStyle={{ fontSize: Fonts.size.small }}
              icon={<Icon name={'plus'} size={16} color={Colors.primaryWarm}/>}
              visible={isEmployee(this.props.user)}>
              Dodaj Szkołę
            </ButtonText>
          </View>
        );
      case SECTION_TITLES.invitingSchools:
        return <SectionHeader title={section.title}/>;
    }
  };

  dataOrPlaceHolder = (data, placeHolder) =>
    data.length === 0 ? [{sectionPlaceholder: placeHolder}] : data;

  render() {
    const { activeDrivingSchools,
      awaitingActivationDrivingSchools,
      invitingDrivingSchools,
      schoolActivationStatus,
      resetSchoolActivationState,
      drivingSchools: { status }
    } = this.props;

    const mySchools = [...activeDrivingSchools, ...awaitingActivationDrivingSchools];

    const sections = [
      {title: SECTION_TITLES.mySchools,
        data: this.dataOrPlaceHolder(mySchools,
          'Tutaj wyświetlą się szkoły, do których należysz.') },
      {title: SECTION_TITLES.invitingSchools,
        data: this.dataOrPlaceHolder(invitingDrivingSchools,
          'Tutaj wyświetlą się zaproszenia do szkół.') }
    ];

    return (
      <View style={{ flex: 1 }}>
        <AccountHeader user={this.props.user}/>

        { status === FETCHING_STATUS.SUCCESS &&
          <SectionList
            contentContainerStyle={styles.listContainer}
            sections={sections}
            stickySectionHeadersEnabled={true}
            keyExtractor={(s, _) => `drivingSchool-${s.id}`}
            renderSectionHeader={this.renderSectionHeader}
            renderItem={this.renderListItem}
          />
        }

        {status === FETCHING_STATUS.FETCHING &&
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={'large'} color={Colors.primaryWarm}/>
          </View>
        }

        {this.blockUIWhenInvitationResponseRequestIsPending()}

        <ModalTemplate
          modalID={MODALS_IDS.ACTIVATE_SCHOOL}
          status={schoolActivationStatus}
          successTitle={'Pomyślnie aktywowano szkołę.'}
          successMsg={'Możesz teraz w pełni korzystać z usług platformy Autograph.'}
          closeModalCallback={resetSchoolActivationState}>
            <SchoolActivationInput/>
        </ModalTemplate>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerWithBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.snow
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15
  },
  helperContainer: {
    backgroundColor: Colors.lightGrey,
    marginVertical: 15,
    paddingVertical: 15,
    borderRadius: 5,
  },
  helperText: {
    color: Colors.strongGrey,
    alignSelf: 'center',
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 100,
  }
});

const mapStateToProps = ({ drivingSchools, invitations, user, schoolActivation }) => ({
  activeDrivingSchools: Object.values(drivingSchools.hashMap).
    filter(isDrivingSchoolRelationActive),
  invitingDrivingSchools: Object.values(drivingSchools.hashMap).
    filter(isDrivingSchoolRelationPending),
  awaitingActivationDrivingSchools: Object.values(drivingSchools.hashMap).
    filter(isDrivingSchoolAwaitingActivation),
  drivingSchools,
  invitations,
  user,
  schoolActivationStatus: schoolActivation.status
});

const mapDispatchToProps = dispatch => ( {
  fetchSchoolsRequest: () => dispatch(drivingSchoolActionCreators.indexRequest()),
  setCurrentSchoolContext: id => dispatch(contextActionCreators.setCurrentDrivingSchool(id)),
  acceptInvitationRequest: id => dispatch(invitationActionCreators.acceptRequest(id)),
  rejectInvitationRequest: id => dispatch(invitationActionCreators.rejectRequest(id)),
  triggerSchoolActivationDialog: id => {
    dispatch(schoolActivationActionCreators.setSchoolToBeActivated(id));
    dispatch(modalActionCreators.open(MODALS_IDS.ACTIVATE_SCHOOL));
  },
  resetSchoolActivationState: () => dispatch(
    schoolActivationActionCreators.resetState()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MySchoolsScreen);
