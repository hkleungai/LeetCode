import { exit } from 'process';
import requests, { Requests } from './Requests';
import { splice_array_chunks } from './utils';
import { RawQuestionDetail } from './types';

async function main() {
  try {
    LeetCode.set_requests(requests);
    await LeetCode.run();
    console.log(LeetCode.question_count);
    console.log(LeetCode.raw_question_details[0]);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  catch (error: Error) {
    // console.log(error.stack.split('\n').slice(1, 4));
    console.error(error.message);
    exit(1);
  }
}

class LeetCode {
  static #requests: Requests;
  static set_requests(requests: Requests) {
    this.#requests = requests;
  }

  static async run() {
    if (!this.#requests || !(this.#requests instanceof Requests)) {
      throw new Error('[Warning]: Please set request first.');
    }
    await this.#get_question_count();
    await this.#get_raw_question_details()
  }

  static #question_count: number;
  static async #get_question_count() {
    const question_count = await this.#requests.get_question_count();
    if (!question_count) {
      throw new Error('Question count cannot be retrieved');
    }
    this.#question_count = question_count;
  }
  static get question_count() {
    return this.#question_count;
  }

  static #raw_question_details: RawQuestionDetail[] = [];
  static async #get_raw_question_details() {
    const raw_question_details_promises: ReturnType<Requests['get_question_details']>[] = [];
    for (let skip = 0; skip < this.#question_count; skip += 50) {
      raw_question_details_promises.push(requests.get_question_details(skip, 50));
    }
    const raw_question_details_chunks = splice_array_chunks(raw_question_details_promises, 15);
    for (const chunk of raw_question_details_chunks) {
      const sub_chunks = await Promise.all(chunk);
      for (const sub_chunk of sub_chunks) {
        if (!sub_chunk) {
          throw new Error('Questions cannot be retrieved');
        }
        this.#raw_question_details.push(...sub_chunk);
      }
    }
    if (!this.#raw_question_details.length || this.#raw_question_details.length !== this.#question_count) {
      throw new Error('Questions cannot be retrieved');
    }
  }
  static get raw_question_details() {
    return this.#raw_question_details;
  }
}

main();
