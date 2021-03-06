import { AxiosInstance, Method } from 'axios';

export type Nullable<T> = T | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NullableRecord<T = any> = Nullable<Record<string, T>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NullableRecordArray<T = any> = Nullable<Record<string, T>[]>;

export interface QueryBody {
  query: string;
  variables?: NullableRecord;
}

export interface DisplayValue {
  single_value: { display: string, value: string; }
  multi_value: Omit<DisplayValue['single_value'], 'value'> & { value: string[]; }
}

export interface RawQuestionDetail {
  content: string;
  difficulty: string;
  id: string;
  is_premium: boolean;
  title_display: string;
  title_value: string;
  topics: DisplayValue['single_value'][];
  similar_questions: string;
  status: string | null;
}

// export interface PostProcessedQuestionDetail
//   extends Omit<RawQuestionDetail, 'id' | 'is_premium' | 'similar_questions' | 'title_display' | 'title_value'> {
//   is_free_access: boolean;
//   similar_questions: DisplayValue[];
//   status: string;
//   title: DisplayValue;
// }

export interface PseudoRequestInterface<T> {
  method: Method;
  request_body: QueryBody;
  response_path: string;
  is_valid_response: (data: T) => boolean;
}

export interface RequestInterface<T> extends PseudoRequestInterface<T> {
  axios_instance: AxiosInstance
}
