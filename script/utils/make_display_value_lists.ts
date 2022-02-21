import { DisplayValue } from '../types';

const sanitize_inline_html = (inline_html: string): string => (
  inline_html.replace(/\n|\s{2,}|(<!--.*-->)/g, '')
);

const make_display_value_lists = (topics: DisplayValue[]) => {
  const topic_elements = topics.map(({ display, value }) => (/* html */`
    <dt>
      [${sanitize_inline_html(display)}](${value})
    </dt>
  `));
  const full_topic_list = /* html */`
    <dl>
      ${topic_elements.join('')}
    </dl>
  `;
  return sanitize_inline_html(full_topic_list);
};

export default make_display_value_lists;
