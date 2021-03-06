/** Built-in modules */
import React, { Component } from 'react';
import { FlatList, View, RefreshControl, Text } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import I18n from '../../I18n';
import ActionButton from 'react-native-action-button';
/** Custom modules */
import InfoBox from '../../Components/InfoBox';
import SegmentsControl from '../../Components/SegmentsControl';
import DefaultAvatar from '../../Components/DefaultAvatar';
import ButtonPrimary from '../../Components/ButtonPrimary';
import ButtonText from '../../Components/ButtonText';
import InvitationInformationTitle from '../../Components/InvitationInformationTitle';
import InvitationInformationSubtitle from '../../Components/InvitationInformationSubtitle';
import ModalTemplate from '../../Components/ModalTemplate';
import DestroyInvitationConfirmation from '../../Components/DestroyInvitationConfirmation';
import { canManageStudents } from '../../Lib/AuthorizationHelpers';
import { FETCHING_STATUS } from '../../Lib/utils';
import { studentsActionCreators } from '../../Redux/StudentsRedux';
import { contextActionCreators } from '../../Redux/ContextRedux';
import { invitationActionCreators } from '../../Redux/InvitationsRedux';
import { MODALS_IDS, modalActionCreators } from '../../Redux/ModalRedux';

import { Fonts, Colors } from '../../Themes/';
import listProjectorStyles from '../../Styles/ListProjector';

/** Screen */
class StudentsIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      segmentIndex: 0,
      studentId: null
    }
  }

  componentWillMount() {
    this.props.studentsIndexRequest();
  }

  changeTab = index => {
    this.setState({
      segmentIndex: index
    })
  };

  openConfirmationModal = (studentId) =>
    this.setState({ studentId }, this.props.openDestroyInvitationModal)

  goToStudentProfile = (user, index) => () => {
    this.props.setCurrentStudent(user.id);
    this.props.navigation.navigate('studentProfile', { user, index });
  };

  renderActiveStudent = ({item, index }) => (
    <ListItem
      title={`${item.name} ${item.surname}`}
      subtitle={
        <Text style={{color: Colors.strongGrey, fontSize: 12, fontWeight: '500'}}>
          {`Tel. ${item.phone_number}`}
        </Text>
      }
      onPress={this.goToStudentProfile(item, index)}
      leftIcon={<DefaultAvatar name={item.name} index={index}/>}
      containerStyle={{ borderBottomWidth: 0 }}
    />
  );

  renderPendingStudent = ({item, index}) => (
    <ListItem
      title={<InvitationInformationTitle email={item.email}/>}
      subtitle={
        <InvitationInformationSubtitle invitation_sent_at={item.invitation_sent_at}/>
      }
      leftIcon={<DefaultAvatar name={item.name} index={index}/>}
      rightIcon={
        <ButtonText
          onPress={() => this.openConfirmationModal(item.id)}
          customTextStyle={{color: Colors.salmon}}
          customStyle={{alignSelf: 'center', marginRight: 5}}>
          {I18n.t('withdraw_invitation')}
        </ButtonText>
      }
      onPressRightIcon={()=>{}}
      containerStyle={{ borderBottomWidth: 0 }}
      hideChevron={false}
    />
  );

  renderPlaceholder = () => {
    if ( this.props.status !== FETCHING_STATUS.FETCHING ) {
      return (
        <InfoBox description={'Nie masz jeszcze zadnych kursantów, zapros ich do wspolpracy juz teraz!'}
                 customContainerStyle={{marginHorizontal: 15}}
        />
      )
    } else {
      return null;
    }
  };

  render() {
    const {
      status,
      pendingStudents,
      activeStudents,
      navigation,
      drivingSchool
    } = this.props;

    const { segmentIndex } = this.state;

    const list = [
      { data: activeStudents,
        renderer: this.renderActiveStudent,
        segmentName: `Aktywni (${activeStudents.length})`
      },
      { data: pendingStudents,
        renderer: this.renderPendingStudent,
        segmentName: `Zaproszeni (${pendingStudents.length})`
      }
    ];

    if(!canManageStudents(drivingSchool)) {
      return (
        <InfoBox title={I18n.t('lacksPrivileges.canManageStudent')}
                 description={I18n.t('lacksPrivileges.generic')} />
      )
    } else {
      return (
        <View style={{flex: 1}}>
          <SegmentsControl componentProps={{
            values: list.map(item => item.segmentName),
            selectedIndex: segmentIndex,
            onTabPress: this.changeTab
          }}
          />
          <List containerStyle={[listProjectorStyles.containerStyle, {flex: 1}]}>
            <FlatList
              contentContainerStyle={listProjectorStyles.contentContainerStyle}
              data={list[segmentIndex].data}
              renderItem={list[segmentIndex].renderer}
              ListEmptyComponent={this.renderPlaceholder}
              showsVerticalScrollIndicator={false}
              keyExtractor={(element, _) => `employee-cell-${element.id}`}
              refreshControl={
                <RefreshControl
                  onRefresh={this.props.studentsIndexRequest}
                  refreshing={status === FETCHING_STATUS.FETCHING}
                  tintColor={Colors.primaryWarm}
                />
              }
            />
          </List>
          <ActionButton buttonColor={Colors.primaryWarm} onPress={()=>navigation.navigate('inviteStudent')} />
          <ModalTemplate
            modalID={MODALS_IDS.DESTROY_STUDENT_INVITATION}
            status={this.props.invitationDestroyStatus}
            closeModalCallback={this.props.resetInvitationFetchingStatus}>
            <DestroyInvitationConfirmation
              onPress={() => this.props.destroyInvitation({type: 'Student', user_id: this.state.studentId})}
            />
          </ModalTemplate>
        </View>
      );
    }
  }
}

const mapStateToProps = state => ({
  drivingSchool: state.drivingSchools.hashMap[state.context.currentDrivingSchoolID],
  activeStudents: state.students.activeIds.map( id => state.students.active[id]),
  pendingStudents: state.students.pendingIds.map( id => state.students.pending[id]),
  status: state.students.status,
  invitationDestroyStatus: state.invitations.status
});

const styles = {
  listPlaceholder: {}
};

const mapDispatchToProps = dispatch => ({
  studentsIndexRequest: () => dispatch(studentsActionCreators.indexRequest()),
  setCurrentStudent: (studentID) => dispatch(contextActionCreators.setCurrentStudent(studentID)),
  openDestroyInvitationModal: () => dispatch(modalActionCreators.open(MODALS_IDS.DESTROY_STUDENT_INVITATION)),
  destroyInvitation: (params) => dispatch(invitationActionCreators.destroyRequest(params)),
  resetInvitationFetchingStatus: () =>
    dispatch(invitationActionCreators.changeStatus(FETCHING_STATUS.READY))
});

export default connect(mapStateToProps, mapDispatchToProps)(StudentsIndex);
