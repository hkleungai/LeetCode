// FIXME: Study for a proper way to do type-guard for enum
const is_enum_instance = <T>(instance: unknown, enum_type: T): boolean => (
  Object.values(enum_type).includes(instance)
);

export default is_enum_instance;
