import { writable } from "svelte/store";

export let currentPage = writable(0);

export let error = writable([]);
