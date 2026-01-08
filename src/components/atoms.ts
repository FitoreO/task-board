import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// export const isLoggedInAtom = atom(false);
export const modeAtom = atom<"light" | "dark">("light");
export const isLoggedInAtom = atomWithStorage("isLoggedIn", false);
