import dotenv from 'dotenv';
import fs from 'fs'
import markdownTable from 'markdown-table'
import path from 'path';

import { STATUS } from './constants';
import Requests from './requests';
import { post_process_question_detail, splice_array_chunks } from './utils';

const ENV_PATH = path.resolve(__dirname, '../.env');
const README_TEMPLATE_PATH = path.resolve(__dirname, '../doc/readme_template.md');
const README_TARGET_PATH = path.resolve(__dirname, '../readme.md');

dotenv.config({ path: ENV_PATH });

const PAGE_ITEM_SIZE = 200;

const main = async () => {
  const requests = new Requests(process.env.cookie);
  const question_count = await requests.get_question_count();
  if (!question_count) {
    console.error('Question count cannot be retrieved');
    return;
  }
  const raw_question_details = await requests.get_question_details(question_count);
  if (!raw_question_details) {
    console.error('Questions cannot be retrieved');
    return;
  }
  const completed_ids = await requests.get_question_ids_by_status(question_count, STATUS.COMPLETED);
  if (!completed_ids) {
    console.error('Ids for completed questions cannot be retrieved');
    return;
  }
  const attempted_ids = await requests.get_question_ids_by_status(question_count, STATUS.ATTEMPTED);
  if (!attempted_ids) {
    console.error('Ids for attempted questions cannot be retrieved');
    return;
  }
  const completed_ids_set = new Set(completed_ids.map(({ id }) => id));
  const attempted_ids_set = new Set(attempted_ids.map(({ id }) => id));
  const title_value_to_id = Object.fromEntries(
    raw_question_details.map(q => [q.title_value, q.id])
  )
  const post_processed_question_details = raw_question_details.map(
    q => post_process_question_detail(q, completed_ids_set, attempted_ids_set, title_value_to_id)
  );
  const question_details_chunks = splice_array_chunks(post_processed_question_details, PAGE_ITEM_SIZE);
  const tables = question_details_chunks.map(question_chunk => (
    markdownTable([
      ['Question', 'Free?', 'Status', 'Difficulty', 'Topics', 'Similar Questions'],
      ...question_chunk.map(Object.values),
    ])
  ))
  const readme_template_text = fs.readFileSync(README_TEMPLATE_PATH, { encoding: 'utf8' });
  const content_bullets = (
    question_details_chunks
      .map((c, i) => (
        '* '
        + `[Questions ${i * PAGE_ITEM_SIZE + 1} to ${i * PAGE_ITEM_SIZE + c.length}]`
        + `(./doc/table-${i + 1}.md)`
      ))
      .join('\n')
  );
  const readme_text = readme_template_text.replace('{{ REPLACEMENT }}', content_bullets);
  fs.writeFileSync(README_TARGET_PATH, readme_text);
  tables.forEach((table, i) => {
    fs.writeFileSync(path.resolve(__dirname, `../doc/table-${i + 1}.md`), table);
  })
}

main();
