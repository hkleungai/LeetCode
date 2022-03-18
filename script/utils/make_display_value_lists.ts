import { DisplayValue } from '../types';

const sanitize_inline_html = (inline_html: string): string => (
  inline_html.replace(/\n|\s{2,}|(<!--.*-->)/g, '')
);

const make_display_value_lists = (topics: DisplayValue['multi_value'][]) => {
  const topic_elements = topics.map(({ display, value }) => (
    /* html */`<dt>${[display, ...value].map(sanitize_inline_html).join('&nbsp;&nbsp;')}</dt>`
  ));
  return /* html */`<dl>${topic_elements.join('')}</dl>`;
};

export default make_display_value_lists;
