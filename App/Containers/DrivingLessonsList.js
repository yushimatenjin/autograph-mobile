import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, FlatList } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment/moment';

import { Fonts, Colors } from '../Themes/index';
import { FETCHING_STATUS } from '../Lib/utils';
import { canModifySchedules, isStudent } from '../Lib/AuthorizationHelpers';

import { MODALS_IDS, modalActionCreators } from '../Redux/ModalRedux';
import { drivingLessonActionCreators } from '../Redux/DrivingLessonRedux';

import DrivingLessonsListItem from '../Components/DrivingLessonsListItem';
import { cancelDrivingLessonModalActionCreators } from '../Redux/Modals/CancelDrivingLesson';

class DrivingLessonsList extends Component {
  constructor(props) {
    super(props);
  }

  openCancelDrivingLessonModal = lesson => () => {
    this.props.initCancelLessonModal(lesson);
    this.props.openModal(MODALS_IDS.CANCEL_DRIVING_LESSON)
  };

  userCanCancelLessons = () => {
    const { user, drivingSchool } = this.props;

    return (isStudent(user) || canModifySchedules(drivingSchool))
  };

  sort = (drivingLessons) =>
    drivingLessons.sort((lesson1, lesson2) =>
      moment(lesson1.start_time).isBefore(lesson2.start_time)
    );

  renderDrivingLessons = () => {
    const {
      drivingLessons,
      userContext,
      scrollEnabled,
      fetchingStatus
    } = this.props;

    if (fetchingStatus === FETCHING_STATUS.READY || fetchingStatus === FETCHING_STATUS.SUCCESS)
      if (drivingLessons.length === 0) {
        return <Text style={styles.emptyDrivingLessons}>Brak jazd</Text>
      } else {
        return (
          <FlatList
            contentContainerStyle={{paddingBottom: 100}}
            scrollEnabled={scrollEnabled}
            data={this.sort(drivingLessons)}
            renderItem={({ item }) => (
              <DrivingLessonsListItem drivingLesson={item}
                                      userCanCancelLesson={this.userCanCancelLessons()}
                                      userContext={userContext}
                                      onCancelPress={this.openCancelDrivingLessonModal(item)} />
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={element => `drivingLesson-${element.id}`}
          />
        )
      }
  };

  render() {
    const { scrollEnabled } = this.props;

    return (
      <View style={scrollEnabled && { flex: 1 }}>
        {this.renderDrivingLessons()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subtitle: {
    color: Colors.strongGrey,
    fontSize: Fonts.size.small,
    fontWeight: '500'
  },
  emptyDrivingLessons: {
    color: Colors.strongGrey,
    fontSize: Fonts.size.medium,
    fontWeight: '500',
    alignSelf: 'center',
    margin: 15
  }
});

const mapStateToProps = state => ({
  user: state.user,
  drivingSchool: state.drivingSchools.hashMap[state.context.currentDrivingSchoolID],
});

const mapDispatchToProps = dispatch => ({
  openModal: (modalId) => dispatch(modalActionCreators.open(modalId)),
  resetDrivingLessonFetchingStatus: () => dispatch(drivingLessonActionCreators.changeStatus(FETCHING_STATUS.READY)),
  initCancelLessonModal: lesson => dispatch(cancelDrivingLessonModalActionCreators.init(lesson))
});

export default connect(mapStateToProps, mapDispatchToProps)(DrivingLessonsList)
