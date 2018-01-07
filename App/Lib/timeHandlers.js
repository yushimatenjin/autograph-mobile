export const roundTimeToHalfHourInterval = (hour, minutes) => {
  if(minutes < 15) {
    minutes = 0;
  } else if(minutes >45) {
    minutes = 0;
    hour++;
  } else if(minutes >= 15 && minutes <= 45) {
    minutes = 30;
  }
  return {hour, minutes};
};