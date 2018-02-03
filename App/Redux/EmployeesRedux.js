import { deepClone, FETCHING_STATUS, mergeArraysUniq } from '../Lib/utils';
import { createReducer, createActions } from 'reduxsauce';

export const INITIAL_STATE = {
  pending: {},
  pendingIds: [],
  active: {},
  activeIds: [],
  status: FETCHING_STATUS.READY,
  errorMsg: null
};

/** Action Types/Creators */

const { Types, Creators } = createActions({
    saveSingle: ['data'],
    saveCollection: ['data'],
    changeStatus: ['status'],
    indicateError: ['msg'],
    indexRequest: null, /* SAGA */
}, { prefix: 'EMPLOYEES_' });

export const employeesActionCreators = Creators;
export const employeesActionTypes = Types;

/** Handlers */
export const saveSingleHandler = (state, { data }) => {
  const dataKey = data.status;
  const idsKey = `${dataKey}Ids`;

  const collection = state[dataKey];
  const idsCollection = state[idsKey];

  const newCollection = deepClone(collection);
  newCollection[data.id] = data; // overwrite or add record returned from server

  const newIds = mergeArraysUniq(idsCollection, [data.id]);

  return {
    ...state,
    [data.status]: newCollection,
    [idsKey]: newIds
  };
};

export const indicateErrorHandler = (state, { msg }) => {
  return { ...deepClone(state), errorMsg: msg, status: FETCHING_STATUS.ERROR }
};

export const saveCollectionHandler = (state, { data }) => {
  const newData = data.reduce((prev, current) => {
    if(!!!prev[current.status]) {
      prev[current.status] = {};
      prev[`${current.status}Ids`] = [];
    }

    prev[current.status][current.id] = current;
    prev[`${current.status}Ids`].push(current.id);

    return prev;
  }, {});

  return {...deepClone(state), ...newData};
};

export const updateStatusHandler = (state, { status }) => ({ ...deepClone(state), status });

/** Reducer */

export const employeesReducer = createReducer(INITIAL_STATE, {
  [Types.SAVE_SINGLE]: saveSingleHandler,
  [Types.SAVE_COLLECTION]: saveCollectionHandler,
  [Types.CHANGE_STATUS]: updateStatusHandler,
  [Types.INDICATE_ERROR]: indicateErrorHandler,
});