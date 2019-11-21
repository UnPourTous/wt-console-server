import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { BasicProfileDataType } from './data.d';
import { queryDetail } from './service';

export interface StateType {
  basicInfo: BasicProfileDataType[];
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchBasic: Effect;
  };
  reducers: {
    show: Reducer<StateType>;
    logDetail: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'profileBasic',

  state: {
    basicInfo: [],
  },

  effects: {
    *fetchBasic({ payload }, { call, put }) {
      const response = yield call(queryDetail, payload);
      yield put({
        type: 'logDetail',
        payload: response,
      });
    },
  },

  reducers: {
    logDetail(state, { payload }) {
      return {
        ...state,
        basicInfo: payload,
      };
    },

    show(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
