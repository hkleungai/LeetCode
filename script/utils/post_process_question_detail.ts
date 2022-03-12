import make_display_value_lists from './make_display_value_lists';
import { DIFFICULTY, STATUS, PROBLEMS_URL, TAG_URL } from '../constants';
import { DisplayValues, RawQuestionDetail } from '../types';

const post_process_question_detail = (
  {
    title_display,
    title_value,
    similar_questions: raw_similar_questions,
    topics: raw_topics,
    is_premium,
    difficulty,
    status: raw_status,
  }: RawQuestionDetail,
  title_value_to_id: Record<string, string>,
  title_value_to_question_notes_path: Record<string, string>,
): Record<string, string> => {
  const post_process_display_values = (pseudo_display: string, pseudo_value: string): DisplayValues => {
    const display = `${title_value_to_id[pseudo_value]}. ${pseudo_display}`;
    const values = [
      '[:link:]' + `(${PROBLEMS_URL}/${pseudo_value})`,
      '[:memo:]' + `(../Notes/Questions/${title_value_to_question_notes_path[pseudo_value]})`
    ];
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
  const status = `${raw_status}`;

  const title: DisplayValues = post_process_display_values(title_display, title_value);

  const topics: DisplayValues[] = raw_topics.map(({ display, value }) => {
    const values = [
      '[:link:]' + `(${TAG_URL}/${value})`
    ];
    // // if (title_value_to_question_folder.has(value)) {
    // values.push('[My Notes]' + `(to be filled)`);
    // // }
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
