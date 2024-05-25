<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "../$types";
  import Order from "$lib/components/Order.svelte";
  import { tick } from "svelte";

  export let data: PageData;
  $: ({ tables, menues, drinks } = data);

  function adjustHeight(event: {
    target: { style: { height: string }; scrollHeight: number };
  }) {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + 15 + "px";
  }

  async function adjustAllTextareas() {
    // Wait for any pending state changes to be applied
    await tick();

    const textareas = document.querySelectorAll("textarea");
    textareas.forEach((textarea) => adjustHeight({ target: textarea }));
  }

  onMount(() => {
    adjustAllTextareas();
  });
</script>

<svelte:head>
  <title>Post</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mb-10">
  <h1>Beitrag erstellen</h1>

  <div class="flex items-center">
    <a class="flex mb-3" href="/post">
      <div class="flex mr-5 items-center group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 group-hover:scale-110"
          viewBox="0 -960 960 960"
          width="24"
          ><path
            d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"
          /></svg
        >
        <div class="pl-1 group-hover:scale-105">zurück</div>
      </div>
    </a>
  </div>

  <form action="?/createOrder" method="POST">
    <div class="mb-2">
      <label for="title">Titel</label>
      <input type="text" name="title" id="title" required autocomplete="off" />
    </div>
    <div class="mb-2">
      <label for="text">Text</label>
      <textarea name="text" id="text" required autocomplete="off" />
    </div>

    <div class="mb-2">
      <label for="image">Foto</label>
      <input
        type="file"
        id="image"
        name="image"
        accept=".jpg, .jpeg, .png, .webp"
      />
    </div>

    <div
      class="bg-tvblue hover:bg-tvbluelight w-min rounded-md px-3 py-2 text-white group"
    >
      <button class="" type="submit">
        <p class="flex group-hover:scale-105">Speichern</p></button
      >
    </div>
  </form>
</div>

<style>
  input[type="file"],
  input[type="text"],
  input[type="email"],
  textarea {
    @apply w-full;
  }
</style>
