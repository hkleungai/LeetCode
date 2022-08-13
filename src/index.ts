import markdownTable from 'markdown-table'
import path from 'path';

import requests, { Requests } from './Requests';
import safe_fs from './safe_fs';
import {
  execute_callback,
  left_pad_digits,
  post_process_question_content,
  post_process_question_detail,
  splice_array_chunks,
} from './utils';

const main = async () => {
  await execute_callback(request_for_question_details, 'request for question details', 1);
  await execute_callback(build_question_folders, 'build question folders', 1);
  await execute_callback(process_raw_questions, 'process raw questions', 1);
  await execute_callback(generate_question_list_ui, 'generate question list UI', 1);
  await execute_callback(write_question_lists, 'write question lists', 1);
}

let raw_question_details: Awaited<ReturnType<Requests['get_question_details']>>;
let question_count: Awaited<ReturnType<Requests['get_question_count']>>;
const request_for_question_details = async () => {
  question_count = await requests.get_question_count();
  if (!question_count) {
    throw new Error('Question count cannot be retrieved');
  }

  const raw_question_details_promises: ReturnType<Requests['get_question_details']>[] = [];
  for (let skip = 0; skip < question_count; skip += 50) {
    raw_question_details_promises.push(requests.get_question_details(skip, 50));
  }
  raw_question_details = [];
  const raw_question_details_chunks = splice_array_chunks(raw_question_details_promises, 15);
  for (const chunk of raw_question_details_chunks) {
    const sub_chunks = await Promise.all(chunk);
    for (const sub_chunk of sub_chunks) {
      if (!sub_chunk) {
        throw new Error('Questions cannot be retrieved');
      }
      raw_question_details.push(...sub_chunk);
    }
  }
  if (!raw_question_details.length || raw_question_details.length !== question_count) {
    throw new Error('Questions cannot be retrieved');
  }
};

const title_value_to_question_notes_path: Record<string, string> = {};
const build_question_folders = async () => {
  const question_parent_path = '../public/Questions';
  const readme_path = './readme.md';
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const readme_files_promise = raw_question_details!.map(async ({ id, title_value, content }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const question_path = left_pad_digits(+id, question_count!) + '__' + title_value;
    title_value_to_question_notes_path[title_value] = question_path;
    const absolute_question_path = path.resolve(__dirname, question_parent_path, question_path);
    const absolute_readme_path = path.resolve(absolute_question_path, readme_path);
    // Skip rewriting problem statement to existing folder
    if (safe_fs.existsSync(absolute_question_path) || safe_fs.existsSync(absolute_readme_path)) {
      return [];
    }
    let readme_content = '# Problem Statement\n\n';
    readme_content += (
      content
        ? await post_process_question_content(absolute_question_path, content)
        : 'To Be Filled By LeetCode owners'
    );
    return [absolute_readme_path, readme_content];
  });
  if (!readme_files_promise.length) {
    return;
  }
  const readme_files: string[][] = [];
  const readme_files_promise_chunks = splice_array_chunks(readme_files_promise, 20);
  for (const chunk of readme_files_promise_chunks) {
    readme_files.push(...(await Promise.all(chunk)));
  }
  readme_files.forEach(([path, file_content]) => {
    if (path && file_content) {
      safe_fs.writeFileSync(path, file_content);
    }
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

let question_lists: string[];
let readme_text: Record<string, string>;
const generate_question_list_ui = () => {
  const PAGE_ITEM_SIZE = 100;
  const README_TEMPLATE_PATH = path.resolve(__dirname, '../readme_template.md');

  const question_details_chunks = splice_array_chunks(post_processed_question_details, PAGE_ITEM_SIZE);
  question_lists = question_details_chunks.map(question_chunk => (
    markdownTable([
      ['Question', 'Free?', 'Status', 'Difficulty', 'Topics', 'Similar Questions'],
      ...question_chunk.map(Object.values),
    ])
  ))
  const readme_template_text = safe_fs.readFileSync(README_TEMPLATE_PATH, { encoding: 'utf8' });
  const make_content_bullets = (options: { make_public: boolean }) => (
    question_details_chunks
      .map((c, i, { length }) => {
        const left_id = i * PAGE_ITEM_SIZE + 1;
        const right_id = i * PAGE_ITEM_SIZE + c.length;
        const label = `Questions ${left_id} to ${right_id}`;

        const question_list_id = left_pad_digits(i + 1, length);
        const url = `./${options.make_public ? 'public/' : ''}QuestionList/list-${question_list_id}`;

        return `* [${label}](${url})`
      })
      .join('\n')
  );
  readme_text = {
    index: readme_template_text.replace('{{ REPLACEMENT }}', make_content_bullets({ make_public: true })),
    public: readme_template_text.replace('{{ REPLACEMENT }}', make_content_bullets({ make_public: false })),
  };
}

const write_question_lists = () => {
  safe_fs.writeFileSync(path.resolve(__dirname, '../readme.md'), readme_text.index);
  safe_fs.writeFileSync(path.resolve(__dirname, '../public/readme.md'), readme_text.public);
  question_lists.forEach((question_list, i, { length }) => {
    const question_list_id = left_pad_digits(i + 1, length);
    const question_list_file = path.resolve(__dirname, `../public/QuestionList/list-${question_list_id}/readme.md`);
    safe_fs.writeFileSync(question_list_file, question_list);
  })
}

execute_callback(main, 'script');
