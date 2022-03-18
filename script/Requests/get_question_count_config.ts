import { QUERY } from '../constants';
import type { Nullable, PseudoRequestInterface } from '../types';
import { is_stringified_safe_integer } from '../validators';

const get_question_count_config = (): PseudoRequestInterface<Nullable<number>> => {
  const method = 'GET';
  const request_body = {
    query: QUERY.COUNT,
    variables: {},
  };
  const response_path = 'data.questionList.total';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const is_valid_response = (count: any): count is number => (
    is_stringified_safe_integer(count.toString())
  );
  return {
    is_valid_response,
    method,
    request_body,
    response_path,
  };
};

export default get_question_count_config;
