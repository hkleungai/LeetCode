import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import path from 'path';

import Constructor from './Constructor';
import get_question_count_config from './get_question_count_config';
import get_question_details_config from './get_question_details_config';
import make_request from './make_request';

import type { RawQuestionDetail } from '../types';

class Requests {
  #axios_instance: AxiosInstance;

  constructor(cookie?: string) {
    this.#axios_instance = axios.create();
    Constructor(this.#axios_instance, cookie);
  }

  get axios_instance() {
    return this.#axios_instance;
  }

  make_request = make_request;

  get_question_count() {
    return this.make_request<number>({
      ...get_question_count_config(),
      axios_instance: this.#axios_instance,
    })
  }

  get_question_details(skip: number, limit: number) {
    return this.make_request<RawQuestionDetail[]>({
      ...get_question_details_config(skip, limit),
      axios_instance: this.#axios_instance,
    })
  }
}

const ENV_PATH = path.resolve(__dirname, '../../.env');
dotenv.config({ path: ENV_PATH });

export { Requests }
export default new Requests(process.env.cookie);
