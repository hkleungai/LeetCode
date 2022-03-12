import { is_stringified_safe_integer } from '../validators';

const splice_array_chunks = <T, >(
  raw_array: T[],
  chunkSize: number,
  options?: {
    delimiter?: (items: T[]) => void;
  },
  // delimiter?: T
) => {
  if (!is_stringified_safe_integer(chunkSize.toString())) {
    return [];
  }
  if (chunkSize > raw_array.length) {
    return [raw_array];
  }
  const result: T[][] = [];
  while (raw_array.length > 1) {
    result.push(raw_array.splice(0, chunkSize));
    options?.delimiter?.(raw_array);
  }
  return result;
}

export default splice_array_chunks;
