import make_display_value_lists from './make_display_value_lists';
import { DIFFICULTY, STATUS, PROBLEMS_URL, TAG_URL } from '../constants';
import { DisplayValues, RawQuestionDetail } from '../types';
import { splice_array_chunks } from '../utils';

const delimiter = (items: string[]) => {
  if (items[0] === ' ') {
    items.shift();
  }
  else {
    items.unshift('-');
  }
};

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
  title_value_to_question_folder: Set<RawQuestionDetail['id']>,
): Record<string, string> => {
  const post_process_display_values = (pseudo_display: string, pseudo_value: string): DisplayValues => {
    const display = `${title_value_to_id[pseudo_value]}. ${pseudo_display}`;
    const values = ['[LeetCode Link]' + `(${PROBLEMS_URL}/${pseudo_value})`];
    if (title_value_to_question_folder.has(pseudo_value)) {
      values.push('[My Notes]' + `(to be filled)`);
    }
    return { display, values };
  };


  // Fine to have question that have no similar questions
  // TODO: Enhance stricter type
  let similar_questions: DisplayValues[];
  try {
    similar_questions = (
      JSON.parse(raw_similar_questions)
        // Seems like data returned from backend is well-sorted
        // BUT, just in case any data is dirty due to unknown issues
        .sort((q1, q2) => +title_value_to_id[q1.titleSlug as string] - +title_value_to_id[q2.titleSlug as string])
        .map(({ title, titleSlug }) => post_process_display_values(title, titleSlug))
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

  const title: DisplayValues = post_process_display_values(title_display, title_value);

  const topics: DisplayValues[] = raw_topics.map(({ display, value }) => {
    const values = ['[LeetCode Link]' + `(${TAG_URL}/${value})`];
    if (title_value_to_question_folder.has(value)) {
      values.push('[My Notes]' + `(to be filled)`);
    }
    return { display, values };
  });

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
