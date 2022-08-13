const is_valid_string = (instance: unknown): instance is string => (
  typeof instance === 'string' && !!instance
);

export default is_valid_string;
