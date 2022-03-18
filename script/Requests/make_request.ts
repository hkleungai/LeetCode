import get from 'lodash.get';

import { GRAPHQL_URL } from '../constants';
import type { Nullable, RequestInterface } from '../types';

const make_request = async <T>({
  axios_instance,
  method,
  request_body,
  response_path,
  is_valid_response,
}: RequestInterface<T>): Promise<Nullable<T>> => {
  try {
    const { data } = await axios_instance.request({
      data: request_body,
      method,
      url: GRAPHQL_URL,
    });
    const requested_data = get<Nullable<T>>(data, response_path, null);
    if (requested_data === null) {
      throw new Error(`No data found on path ${response_path}`);
    }
    if (!is_valid_response(requested_data)) {
      throw new Error('Response data format is incorrect');
    }
    return requested_data;
  } catch (error) {
    console.error(error as Error);
    return null;
  }
}

export default make_request;
