import { is_stringified_safe_integer } from '../validators';

const splice_array_chunks = <T, >(
  raw_array: T[],
  chunkSize: number,
) => {
  if (!is_stringified_safe_integer(chunkSize.toString())) {
    return [];
  }
  if (chunkSize > raw_array.length) {
    return [raw_array];
  }
  const result: T[][] = [];
  while (raw_array.length) {
    result.push(raw_array.splice(0, chunkSize));
  }
  return result;
}

export default splice_array_chunks;
