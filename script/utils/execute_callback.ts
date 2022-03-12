const execute_callback = async (
  callback: (() => void | Promise<void>),
  id: string,
  level = 0
) => {
  const indent = ' '.repeat(level * 4);
  console.time(indent + id);
  await callback();
  console.timeEnd(indent + id);
}

export default execute_callback;
