import { atom } from "jotai";

export const isLoggedInAtom = atom(false);
export const modeAtom = atom<"light" | "dark">("light");
