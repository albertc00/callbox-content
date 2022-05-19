import { writable } from 'svelte/store';

export const isSearching = writable('');
export const SearchTerm = writable('');
export const Industries = writable(0);
export const seeMore = writable('');
export const MoreField = writable('');
export const fields = writable('');
export const cols = writable(['title', 'product', 'pdf']);
export const selection = writable(1);
export const modal = writable(null);
export const seecol = writable(false);
export const fieldID = writable('');
export const viewfield = writable(false);
export const pages = writable(1);
export const category = writable(1);
