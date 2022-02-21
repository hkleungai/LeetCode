import is_enum_instance from './is_enum_instance';
import is_stringified_safe_integer from './is_stringified_Safe_integer';
import is_valid_question_topic from './is_valid_question_topic';
import is_valid_string from './is_valid_string';
import { DIFFICULTY } from '../constants';
import type { RawQuestionDetail } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const is_valid_question_detail = (instance: any): instance is RawQuestionDetail => (
  is_enum_instance(instance.difficulty, DIFFICULTY)
  && is_stringified_safe_integer(instance.id)
  && typeof instance.is_premium === 'boolean'
  && is_valid_string(instance.title_display)
  && is_valid_string(instance.title_value)
  /**
   * Newest questions in Leetcode are not classified immediately after they are released.
   * FIXME: See if possible to do checking on instance.topics.length
   */
  && (
    Array.isArray(instance.topics)
    && instance.topics.every(is_valid_question_topic)
  )
  && is_valid_string(instance.similar_questions)
);

export default is_valid_question_detail;
