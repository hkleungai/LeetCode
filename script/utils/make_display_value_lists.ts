import { DisplayValues } from '../types';

const sanitize_inline_html = (inline_html: string): string => (
  inline_html.replace(/\n|\s{2,}|(<!--.*-->)/g, '')
);

const make_display_value_lists = (topics: DisplayValues[]) => {
  const topic_elements = topics.map(({ display, values }) => {
    const sanitized_display = /* html */`<dt>${sanitize_inline_html(display)}</dt>`;
    const sanitized_values = (
      values
        .map(v => (/* html */`<dd>${sanitize_inline_html(v)}</dd>`))
        .join('<br />')
    );
    return sanitized_display + sanitized_values;
  });
  // const full_topic_list = /* html */`<dl>${topic_elements.join('')}</dl>`;
  return /* html */`<dl>${topic_elements.join('')}</dl>`;
};

export default make_display_value_lists;
