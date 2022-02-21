import { is_stringified_safe_integer } from '../validators';

const splice_array_chunks = <T, >(raw_array: T[], chunkSize: number) => {
  if (!is_stringified_safe_integer(chunkSize.toString()) || chunkSize > raw_array.length) {
    return [];
  }
  const res: T[][] = [];
  while (raw_array.length > 0) {
    res.push(raw_array.splice(0, chunkSize));
  }
  return res;
}

export default splice_array_chunks;
