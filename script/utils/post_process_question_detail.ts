import make_display_value_lists from './make_display_value_lists';
import { DIFFICULTY, STATUS, PROBLEMS_URL, TAG_URL } from '../constants';
import { DisplayValue, RawQuestionDetail } from '../types';

const post_process_question_detail = (
  {
    title_display,
    title_value,
    similar_questions: raw_similar_questions,
    topics: raw_topics,
    id,
    is_premium,
    difficulty,
  }: RawQuestionDetail,
  completed_ids_set: Set<RawQuestionDetail['id']>,
  attempted_ids_set: Set<RawQuestionDetail['id']>,
  title_value_to_id: Record<string, string>,
): Record<string, string> => {
  const post_process_title = (display: string, value: string) => ({
    display: `${title_value_to_id[value]}. ${display}`,
    value: `${PROBLEMS_URL}/${value}`,
  });

  // Fine to have question that have no similar questions
  // TODO: Enhance stricter type
  let similar_questions: DisplayValue[];
  try {
    similar_questions = (
      JSON.parse(raw_similar_questions)
        // Seems like data returned from backend is well-sorted
        // BUT, just in case any data is dirty due to unknown issues
        .sort((q1, q2) => +title_value_to_id[q1.titleSlug as string] - +title_value_to_id[q2.titleSlug as string])
        .map(({ title, titleSlug }) => post_process_title(title, titleSlug))
    );
  }
  catch {
    similar_questions = [];
  }

  // Average-level LeetCoders might have more todo questions than the other two.
  const status = (
    attempted_ids_set.has(id)
      ? STATUS.ATTEMPTED
      : completed_ids_set.has(id)
        ? STATUS.COMPLETED
        : STATUS.TODO
  );

  const title: DisplayValue = post_process_title(title_display, title_value);

  const topics = raw_topics.map(({ display, value }) => ({
    display,
    value: `${TAG_URL}/${value}`
  }));

  const is_free_access = !is_premium;

  return {
    title: make_display_value_lists([title]),
    is_free_access: is_free_access ? '🆓' : '💰',
    status: status === STATUS.COMPLETED ? '✅' : status === STATUS.ATTEMPTED ? '👀' : '',
    difficulty: difficulty === DIFFICULTY.EASY ? '⭐️' : difficulty === DIFFICULTY.MEDIUM ? '⭐️⭐️' : '⭐️⭐️⭐️',
    topics: make_display_value_lists(topics),
    similar_questions: make_display_value_lists(similar_questions),
  };
}

export default post_process_question_detail;
