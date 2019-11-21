export interface Member {
  avatar: string;
  name: string;
  id: string;
}

export interface Member2 {
  ecif: string;
  nickname: string;
  env: string;
  id: string;
}

export interface BasicListItemDataType {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success';
  percent: number;
  logo: string;
  href: string;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
  ecif: string;
  nickname: string;
  env: string;
  logList: Member2[];
  maxLogId: number | string;
  uploadTs: number | string;
}
