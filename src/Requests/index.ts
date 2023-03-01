import axios from 'axios';
import dotenv from 'dotenv';
import get from 'lodash.get';
import path from 'path';

import Constructor from './Constructor';
import { QUERY, GRAPHQL_URL } from '../constants';
import type { Nullable, RawQuestionDetail, RequestInterface } from '../types';
import {
  is_stringified_safe_integer,
  is_valid_question_detail,
  is_valid_string,
} from '../validators';

class Requests {
  static #axios_instance = axios.create();
  // TODO: SOLVE IT
  static async set_cookie(cookie?: string) {
    Constructor(this.#axios_instance, cookie);
  }

  static get axios_instance() {
    return this.#axios_instance;
  }

  static make_request(target: typeof Requests, _: string, descriptor: PropertyDescriptor) {
    const decorated_method = descriptor.value;
    descriptor.value = async <T>(...args) => {
      const api_options: RequestInterface<T> = await decorated_method.apply(target, args);
      try {
        const { data } = await Requests.axios_instance.request({
          data: api_options.request_body,
          method: api_options.method,
          url: GRAPHQL_URL,
        });
        const requested_data = get<Nullable<T>>(data, api_options.response_path, null);
        if (requested_data === null) {
          throw new Error(`[ERROR]: No data found on path ${api_options.response_path}`);
        }
        if (!api_options.is_valid_response(requested_data)) {
          throw new Error('[ERROR]: Response data format is incorrect');
        }
        return requested_data;
      } catch (error) {
        console.error(error?.response?.data || error?.response || error);
        return null;
      }
    };
  }

  @Requests.make_request
  static async get_question_count(): Promise<Nullable<number>> {
    const method = 'GET';
    const request_body = {
      query: QUERY.COUNT,
      variables: {},
    };
    const response_path = 'data.questionList.total';
    const is_valid_response = (count: unknown): count is number => (
      is_stringified_safe_integer(`${count}`)
    );
    const result: RequestInterface<Nullable<number>> = {
      is_valid_response,
      method,
      request_body,
      response_path,
    };
    return result as unknown as Promise<Nullable<number>>;
  }

  @Requests.make_request
  static async get_question_details(skip: number, limit: number): Promise<Nullable<RawQuestionDetail[]>> {
    const method = 'POST';
    const request_body = {
      query: QUERY.DETAIL,
      variables: {
        skip,
        limit,
        filters: {},
      },
    };
    const response_path = 'data.questionList.data';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const is_valid_response = (details: any): details is RawQuestionDetail[] => (
      // true
      Array.isArray(details)
      && !!details.length
      && details.every(is_valid_question_detail)
    );
    const result: RequestInterface<Nullable<RawQuestionDetail>> = {
      is_valid_response,
      method,
      request_body,
      response_path,
    };
    return result as unknown as Promise<Nullable<RawQuestionDetail[]>>;
  }

  @Requests.make_request
  static async get_discuss_post_id(backend_id: number, query: string): Promise<Nullable<string>> {
    const method = 'POST';
    const request_body = {
      query: QUERY.DISCUSS_TOPIC_List,
      variables: {
        backend_id,
        query,
        orderBy: "most_relevant",
      },
    };
    const response_path = 'data.questionTopics.data[0].post_id';
    const is_valid_response = (response: unknown): response is number => (
      is_stringified_safe_integer(`${response}`)
    );
    const result: RequestInterface<Nullable<string>> = {
      is_valid_response,
      method,
      request_body,
      response_path,
    };
    return result as unknown as Promise<Nullable<string>>;
  }

  @Requests.make_request
  static async get_discuss_post_content(topic_id: string): Promise<Nullable<string>> {
    const method = 'POST';
    const request_body = {
      query: QUERY.DISCUSS_TOPIC,
      variables: {
        topic_id
      },
    };
    const response_path = 'data.topic.post.content';
    const is_valid_response = is_valid_string;
    const result: RequestInterface<Nullable<string>> = {
      is_valid_response,
      method,
      request_body,
      response_path,
    };
    return result as unknown as Promise<Nullable<string>>;
  }
}

const ENV_PATH = path.resolve(__dirname, '../../.env');
dotenv.config({ path: ENV_PATH });

Requests.set_cookie(process.env.cookie);
export { Requests }
export default Requests;
