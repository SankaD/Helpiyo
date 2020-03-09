import moment from 'moment';

export function getUtcTime() {
  return moment().utc().toDate();
}
export function getTime() {
  return moment().toDate();
}

export function toUtc(time) {

}
