const foo = () => {
  const a: number[] = [];
  const start = Date.now();
  for (let i = 0; i < 100000; i++) {
    a.unshift(1);
  }
  return Date.now() - start;
}
console.log((foo()))
const bar = () => {
  const a: number[] = [];
  const start = Date.now();
  for (let i = 0; i < 100000; i++) {
    a.push(1);
  }
  return Date.now() - start;
}
console.log(bar())
