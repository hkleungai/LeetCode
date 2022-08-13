import is_valid_string from './is_valid_string';
import type { DisplayValue } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const is_valid_question_topic = (topic: any): topic is DisplayValue => (
  is_valid_string(topic.display) && is_valid_string(topic.value)
);

export default is_valid_question_topic;
