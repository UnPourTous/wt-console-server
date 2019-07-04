import request from '@/utils/request';

export async function queryDetail(params) {
  return request(`/v1/log/${params}`);
}
