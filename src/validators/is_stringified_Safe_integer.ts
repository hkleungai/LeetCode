const is_stringified_safe_integer = (instance: string): boolean => (
  Number.parseInt(instance).toString() === instance
);

export default is_stringified_safe_integer;
