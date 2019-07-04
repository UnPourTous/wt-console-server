export interface LogList {
  logType: string;
  msg: any[];
  ts: string | number;
}
export interface Meta {
  id: string;
  uploadIp: string;
  uploadTs: string | number;
}

export interface BasicInfo {
  ecif: string;
  env: string;
  nickname: string;
  meta: Meta[];
  logList: LogList[];
}

export interface BasicProfileDataType {
  basicInfo: BasicInfo[];
}
