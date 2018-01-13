import { takeLatest, all } from 'redux-saga/effects';
import { API as api } from '../Services/Api';

/* ------------- Types ------------- */

import { resetPasswordTypes } from '../Redux/ResetPasswordRedux';
import { drivingSchoolActionTypes } from '../Redux/DrivingSchoolRedux';
import { scheduleSettingsTypes } from '../Redux/ScheduleSettingsRedux';
import { scheduleBoundariesTypes } from '../Redux/ScheduleBoundariesRedux';
import { notificationSettingsActionTypes } from '../Redux/EmployeeNotificationsSettingsSetRedux';
/* ------------- Sagas ------------- */

import { LogIn } from './LogInSaga';
import { resetPassword } from './ResetPasswordSaga';

import {
  create as createDrivingSchoolSaga,
  update as updateDrivingSchoolSaga,
  index as fetchDrivingSchools,
  show as showDrivingSchoolSaga
} from './DrivingSchoolSagas';

import {
  update as updateNotificationSettingsSaga,
  show as showNotificationSettingsSaga
} from './NotificationSettingsSaga';

import {
  update as updateScheduleBoundariesSaga,
  show as  showScheduleBoundariesSaga
} from './ScheduleBoundariesSaga';

import {
  update as updateScheduleSettingsSaga,
  show as  showScheduleSettingsSaga } from './ScheduleSettingsSaga';

import { create as createInvitation } from './InvitationsSaga';

/* ------------- ReduxForm - Sagas actions------------- */
import { invite } from '../Redux/InvitationsRedux';
import { createDrivingSchool } from '../Redux/DrivingSchoolRedux';
import { updateDrivingSchool } from '../Redux/DrivingSchoolRedux';
import { updateNotificationSettings } from '../Redux/EmployeeNotificationsSettingsSetRedux';
import { updateScheduleBoundaries } from '../Redux/ScheduleBoundariesRedux';
import { updateScheduleSettings } from '../Redux/ScheduleSettingsRedux';
import { login } from '../Redux/SessionRedux';
/* ------------- API ------------- */

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    takeLatest(login.REQUEST, LogIn, api),
    takeLatest(resetPasswordTypes.RESET_PASSWORD_REQUEST, resetPassword, api),

    takeLatest(createDrivingSchool.REQUEST, createDrivingSchoolSaga, api),
    takeLatest(updateDrivingSchool.REQUEST, updateDrivingSchoolSaga, api),
    takeLatest(drivingSchoolActionTypes.INDEX_REQUEST, fetchDrivingSchools, api),
    takeLatest(drivingSchoolActionTypes.SHOW_REQUEST, showDrivingSchoolSaga, api),

    takeLatest(updateScheduleBoundaries.REQUEST, updateScheduleBoundariesSaga, api),
    takeLatest(scheduleBoundariesTypes.SHOW_REQUEST, showScheduleBoundariesSaga, api),

    takeLatest(updateScheduleSettings.REQUEST, updateScheduleSettingsSaga, api),
    takeLatest(scheduleSettingsTypes.SHOW_REQUEST, showScheduleSettingsSaga, api),

    takeLatest(updateNotificationSettings.REQUEST, updateNotificationSettingsSaga, api),
    takeLatest(notificationSettingsActionTypes.SHOW_REQUEST, showNotificationSettingsSaga, api),

    takeLatest(invite.REQUEST, createInvitation, api),
  ])
}
