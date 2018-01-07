export const deepClone = entity => (JSON.parse(JSON.stringify(entity)));
export const arrayToHash = array => array.reduce((accumulator, current) => {accumulator[current.id] = current; return accumulator}, {})
export const mergeArraysUniq = (a, b) => [...new Set([...a ,...b])];
export const FETCHING_STATUS = { READY: 'READY', FETCHING: 'FETCHING', SUCCESS: 'SUCCESS', ERROR: 'ERROR' };