import axios, { AxiosInstance } from 'axios';

import Constructor from './Constructor';
import get_question_count_config from './get_question_count_config';
import get_question_details_config from './get_question_details_config';
import make_request from './make_request';

import type { Nullable, RawQuestionDetail } from '../types';

abstract class AbstractRequests {
  axios_instance: AxiosInstance;
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  constructor(cookie?: string) {}
  abstract get_question_count(): Promise<Nullable<number>>;
  abstract get_question_details(skip: number, limit: number): Promise<Nullable<RawQuestionDetail[]>>;
}

class Requests extends AbstractRequests {
  constructor(cookie?: string) {
    super();
    this.axios_instance = axios.create();
    Constructor(this.axios_instance, cookie);
  }

  make_request = make_request;

  get_question_count() {
    return this.make_request<number>({
      ...get_question_count_config(),
      axios_instance: this.axios_instance,
    })
  }

  get_question_details(skip: number, limit: number) {
    return this.make_request<RawQuestionDetail[]>({
      ...get_question_details_config(skip, limit),
      axios_instance: this.axios_instance,
    })
  }
}

export default Requests;
