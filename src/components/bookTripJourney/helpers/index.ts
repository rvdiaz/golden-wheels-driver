import { DeepPartial } from 'react-hook-form';

export const deepMerge = <T extends Record<string, any>>(base: T, override: DeepPartial<T>): T => {
  const result: Record<string, any> = { ...base };
  for (const key in override) {
    const val = override[key];
    if (val !== undefined && val !== null) {
      if (
        typeof val === 'object' &&
        !Array.isArray(val) &&
        typeof result[key] === 'object' &&
        !Array.isArray(result[key])
      ) {
        result[key] = deepMerge(result[key], val);
      } else {
        result[key] = val;
      }
    }
  }
  return result as T;
};
