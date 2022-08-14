import { AtomEffect, DefaultValue } from "recoil";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

function getFromStore(key: string) {
  const value = storage.getString(key);
  return value ? JSON.parse(value) : new DefaultValue();
}

export function persistAtom<T>(key: string): AtomEffect<T> {
  return ({ setSelf, onSet }) => {
    setSelf(getFromStore(key));
    // Subscribe to state changes and persist them to localForage
    onSet((newValue, _, isReset) => {
      isReset
        ? storage.delete(key)
        : storage.set(key, JSON.stringify(newValue));
    });
  };
}
