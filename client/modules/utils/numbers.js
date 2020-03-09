import numeral from 'numeral';

export function intToAbbreviated(value) {
  return numeral(value).format('0a');
}
