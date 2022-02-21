import { QUERY } from '../constants';
import type { Nullable, PseudoRequestInterface, RawQuestionDetail } from '../types';
import { is_stringified_safe_integer } from '../validators';

const get_question_ids_by_status_config = (
  question_count: number,
  status: string
): PseudoRequestInterface<Nullable<Pick<RawQuestionDetail, 'id'>[]>> => {
  const method = 'POST';
  const request_body = {
    query: QUERY.ID,
    variables: {
      limit: question_count,
      filters: { status },
    },
  };
  const response_path = 'data.questionList.data';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const is_valid_response = (details: any): details is Pick<RawQuestionDetail, 'id'>[] => (
    Array.isArray(details)
    // Allow empty array here
    // since there can be no questions in submitted / attempting state
    && details.every(detail => is_stringified_safe_integer(detail.id))
  );
  return {
    is_valid_response,
    method,
    request_body,
    response_path,
  };
};

export default get_question_ids_by_status_config;
