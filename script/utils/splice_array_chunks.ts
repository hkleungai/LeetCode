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


// const test_string = "2006. Count";
// console.log(
//   splice_array_chunks(test_string.split(''), 9, {
//     delimiter: (items: string[]) => {
//       if (items[0] === ' ') {
//         items.shift();
//       }
//       else {
//         items.unshift('-');
//       }
//     },
//   })
//     .map(it => it.join(''))
//     // .join('<br />')
// )

export default splice_array_chunks;
