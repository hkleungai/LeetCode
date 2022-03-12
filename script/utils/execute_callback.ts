const execute_callback = async (
  callback: (() => void | Promise<void>),
  id: string,
  level = 0
) => {
  const indent = ' '.repeat(level * 4);
  console.log(indent + `Begin ${id}`);
  await callback();
  console.log(indent + `End ${id}`);
}

export default execute_callback;
