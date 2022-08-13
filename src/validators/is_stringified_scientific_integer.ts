/**
 * A well-written API should not really return
 * any string containing integers in scientific notations
 * In case this trust is broken,
 * the below util would be used to replace the use of `is_stringified_safe_integer`
 */
const is_stringified_scientific_integer = (instance: string): boolean => {
  const parsed_instance = +instance;
  if (Number.isNaN(parsed_instance)) {
    return false;
  }
  const stringified_parsed_instance = parsed_instance.toString();
  return Number.parseInt(stringified_parsed_instance).toString() === stringified_parsed_instance;
};

export default is_stringified_scientific_integer
