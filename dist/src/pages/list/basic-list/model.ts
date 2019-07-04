import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {
  queryLogList,
  addFakeList,
  queryFakeList,
  removeFakeList,
  updateFakeList,
} from './service';

import { Member2 } from './data.d';

export interface StateType {
  logList: Member2[];
  searchList: Member2[];
  maxLogId: number | string;
  uploadTs: number | string;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
    filterList: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'listBasicList',

  state: {
    logList: [],
    maxLogId: '',
    uploadTs: '',
    searchList: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryLogList, payload);
      yield put({
        type: 'queryList',
        payload: {
          ...response,
          searchList: response.logList,
        },
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *filterList({ payload }, { put, select }) {
      let list = yield select(state => state.listBasicList.logList);
      list = list.filter((item: any) => {
        if (payload.id) {
          return item.id === payload.id;
        }
        return true;
      });
      // const response = yield call(queryLogList, payload);
      yield put({
        type: 'queryList',
        payload: {
          searchList: list,
        },
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    appendList(state = { logList: [] }, action) {
      return {
        ...state,
        logList: state.logList.concat(action.payload),
      };
    },
  },
};

export default Model;
