import {
  widthPercentageToDP as wdp,
  heightPercentageToDP as hdp,
} from 'react-native-responsive-screen';

const customWidth = 375;
const customHeight = 812;

export const wp = (value: number): number => {
  const dimension = (value / customWidth) * 100;
  return wdp(`${dimension}%`);
};
export const hp = (value: number): number => {
  const dimension = (value / customHeight) * 100;
  return hdp(`${dimension}%`);
};


export const getCurrentDate = (data: any)=>{
 
  var date = new Date(data).getDate();
  var month = new Date(data).getMonth() + 1;
  var year = new Date(data).getFullYear();

  return date + '-' + month + '-' + year;//format: d-m-y;
}


export const numberFormat = (value: number) => {
  const re = '\\d(?=(\\d{' + 3 + '})+' + '\\D' + ')';
  const num = value?.toFixed(Math.max(0, ~~2));
  const str = num?.replace(new RegExp(re, 'g'), '$&' + ',');
  return str;
}


