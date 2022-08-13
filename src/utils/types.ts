export const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] =>
  obj[key];

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Record<string, unknown>
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      DeepPartial<T[P]>
    : T[P];
};
