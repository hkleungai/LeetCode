import dotenv from 'dotenv';
import markdownTable from 'markdown-table'
import path from 'path';

import Requests from './requests';
import safe_fs from './safe_fs';
import {
  execute_callback,
  left_pad_digits,
  post_process_question_content,
  post_process_question_detail,
  splice_array_chunks,
} from './utils';

const main = async () => {
  await execute_callback(request_for_question_details, 'request', 1);
  await execute_callback(build_question_folders, 'building question folders', 1);
  await execute_callback(process_raw_questions, 'processing', 1);
  await execute_callback(generate_table_ui, 'UI generation', 1);
  await execute_callback(write_table_files, 'Table Readme Edit', 1);
}

let raw_question_details: Awaited<ReturnType<Requests['get_question_details']>>;
let question_count: Awaited<ReturnType<Requests['get_question_count']>>;
const request_for_question_details = async () => {
  const ENV_PATH = path.resolve(__dirname, '../.env');
  dotenv.config({ path: ENV_PATH });

  const requests = new Requests(process.env.cookie);

  question_count = await requests.get_question_count();
  if (!question_count) {
    throw new Error('Question count cannot be retrieved');
  }

  raw_question_details = await requests.get_question_details(question_count);
  if (!raw_question_details) {
    throw new Error('Questions cannot be retrieved');
  }
};

const title_value_to_question_notes_path: Record<string, string> = {};
const build_question_folders = async () => {
  const question_parent_path = '../Notes/Questions';
  const readme_path = './readme.md';
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const readme_files_promise = raw_question_details!.map(async ({ id, title_value, content }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const question_path = left_pad_digits(+id, question_count!) + '__' + title_value;
    title_value_to_question_notes_path[title_value] = question_path;
    const absolute_question_path = path.resolve(__dirname, question_parent_path, question_path);
    const absolute_readme_path = path.resolve(absolute_question_path, readme_path);
    let readme_content = '# Problem Statement\n\n';
    readme_content += (
      content
        ? await post_process_question_content(absolute_question_path, content)
        : 'To Be Filled By LeetCode owners'
    );
    return [absolute_readme_path, readme_content];
  })
  const readme_files = await Promise.all(readme_files_promise);
  readme_files.forEach(([path, file_content]) => {
    safe_fs.writeFileSync(path, file_content);
  })
}

let post_processed_question_details: Record<string, string>[];
const process_raw_questions = () => {
  const title_value_to_id = Object.fromEntries(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    raw_question_details!.map(q => [q.title_value, q.id])
  )

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  post_processed_question_details = raw_question_details!.map(
    raw_detail => (
      post_process_question_detail(
        raw_detail,
        title_value_to_id,
        title_value_to_question_notes_path,
      )
    )
  );
}

let tables: string[];
let readme_text: string;
const generate_table_ui = () => {
  const PAGE_ITEM_SIZE = 100;
  const README_TEMPLATE_PATH = path.resolve(__dirname, '../readme_template.md');

  const question_details_chunks = splice_array_chunks(post_processed_question_details, PAGE_ITEM_SIZE);
  tables = question_details_chunks.map(question_chunk => (
    markdownTable([
      ['Question', 'Free?', 'Status', 'Difficulty', 'Topics', 'Similar Questions'],
      ...question_chunk.map(Object.values),
    ])
  ))
  const readme_template_text = safe_fs.readFileSync(README_TEMPLATE_PATH, { encoding: 'utf8' });
  const content_bullets = (
    question_details_chunks
      .map((c, i, { length }) => {
        const left_id = i * PAGE_ITEM_SIZE + 1;
        const right_id = i * PAGE_ITEM_SIZE + c.length;
        const table_id = left_pad_digits(i + 1, length);
        return `* [Questions ${left_id} to ${right_id}](./doc/table-${table_id}.md)`
      })
      .join('\n')
  );
  readme_text = readme_template_text.replace('{{ REPLACEMENT }}', content_bullets);
}

const write_table_files = () => {
  const README_TARGET_PATH = path.resolve(__dirname, '../readme.md');
  safe_fs.writeFileSync(README_TARGET_PATH, readme_text);
  tables.forEach((table, i, { length }) => {
    const table_file = path.resolve(__dirname, `../doc/table-${left_pad_digits(i + 1, length)}.md`);
    safe_fs.writeFileSync(table_file, table);
  })
}

execute_callback(main, 'script');
