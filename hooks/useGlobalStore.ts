import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";
import { OmitProperties, Prettify } from "ts-essentials";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type StateValues = Prettify<OmitProperties<GlobalStoreState, Function>>;
type ValueKey = keyof StateValues;

type GlobalStoreState = {
  baseUrl: string;
  port: number | null;
  username: string;
  password: string;
  cookie: string;
  updateByKey: <T extends ValueKey>(key: T, value: StateValues[T]) => void;
  /**
   * Set multiple value at once
   */
  bulkUpdate: (update: Partial<StateValues>) => void;
  /**
   * Sets key to its default value
   */
  resetByKey: <T extends ValueKey>(key: T) => void;
  /**
   * Sets all keys to their default values
   */
  reset: () => void;
};

const defaultState: StateValues = {
  baseUrl: "http://192.168.0.192",
  port: 9999,
  username: "",
  password: "",
  cookie: "",
};

export const useGlobalStore = create<GlobalStoreState>()(
  persist(
    (set) => ({
      ...defaultState,
      updateByKey: (key, value) => set({ [key]: value }),
      bulkUpdate: (update: Partial<StateValues>) => set({ ...update }),
      resetByKey: (key) => set({ [key]: defaultState[key] }),
      reset: () => set(defaultState),
    }),
    {
      name: `dlManager:global`,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/**
 * @returns [value, setter, resetter] for sync-storage key
 */
export const useGlobalStoreItem = <T extends ValueKey>(key: T) => {
  const value = useGlobalStore((s) => s[key]);
  const updateByKey = useGlobalStore((s) => s.updateByKey);
  const resetByKey = useGlobalStore((s) => s.resetByKey);

  const setter = useCallback<(value: StateValues[T]) => void>(
    (value) => {
      updateByKey(key, value);
    },
    [key, updateByKey],
  );

  const resetter = useCallback<() => void>(() => {
    resetByKey(key);
  }, [key, resetByKey]);

  return [value, setter, resetter] as const;
};
