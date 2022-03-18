const count_digits = (n: number): number => (
  Math.ceil(Math.log10(n + 1))
);

const left_pad_digits = (n: number, upper_bound: number): string => {
  const num_pad = count_digits(upper_bound) - count_digits(n);
  if (num_pad < 0) {
    throw new Error('Invalid num_pad value')
  }
  return '0'.repeat(num_pad) + n.toString();
};

export default left_pad_digits;
