import { QUERY } from '../constants';
import type { Nullable, PseudoRequestInterface, RawQuestionDetail } from '../types';
import { is_valid_question_detail } from '../validators';

const get_question_details_config = (question_count: number): PseudoRequestInterface<Nullable<RawQuestionDetail[]>> => {
  const method = 'POST';
  const request_body = {
    query: QUERY.DETAIL,
    variables: {
      limit: question_count,
      filters: {},
    },
  };
  const response_path = 'data.questionList.data';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const is_valid_response = (details: any): details is RawQuestionDetail[] => (
    Array.isArray(details)
    && !!details.length
    && details.every(is_valid_question_detail)
  );
  return {
    is_valid_response,
    method,
    request_body,
    response_path,
  };
};

export default get_question_details_config;
