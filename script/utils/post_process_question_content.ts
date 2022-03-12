import axios from "axios";
import path from 'path';

import safe_fs from '../safe_fs';

const url_regex = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*))/g;
const url_to_file_path = (url: string) => url.split('/')?.pop()?.split('#')[0].split('?')[0] || '';

const process_image_url = async (url: string, question_path: string) => {
  try {
    const { data, headers } = await axios.get(url, { responseType: 'stream' });
    if (!/image\//.test(headers['content-type'])) {
      return url;
    }
    const relative_file_path = url_to_file_path(url);
    const absolute_file_path = path.resolve(question_path, relative_file_path);
    return await new Promise<string>((resolve) => {
      const writer = safe_fs.createWriteStream(absolute_file_path);
      data.pipe(writer);
      resolve(relative_file_path);
    })
  }
  catch (error) {
    // Likely the scraped link won't be an image
    // For such cases simply return the original url
    // console.error(error);
    return url;
  }
}

const post_process_question_content = async (question_path: string, content: string) => {
  const url_promises: Promise<string>[] = [];
  content.replace(url_regex, (url) => {
    url_promises.push(process_image_url(url, question_path));
    return url;
  });
  const urls = await Promise.all(url_promises);
  let count = 0;
  return content.replace(url_regex, () => urls[count++]);
}

export default post_process_question_content;

