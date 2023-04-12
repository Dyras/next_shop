import { atom } from "jotai";
import { IProductSaved } from "./iproduct";

export const cart = atom<IProductSaved[]>([]);
