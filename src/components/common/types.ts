/* eslint-disable @typescript-eslint/ban-types */
export type CustomModalProps = {
  handleVisible: Function;
  visibleBoolean: boolean;
  isSuccess: boolean;
  justOk?: boolean;
  msg?: string;
  headerText: string;
}

export type CustomSlideModalProps = {
  visibleBoolean: boolean;
  isSuccess?: boolean;
  msg: string;
  headerText: string;
  footerText?: string;
  onButtonPress: any;
}