<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto, invalidateAll } from "$app/navigation";
  import { redirect, type ActionResult } from "@sveltejs/kit";
  import { tick } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";

  let messageId = 0;

  interface Message {
    id: number;
    type: "success" | "error";
    text: string;
    flying: boolean;
  }

  let loading: boolean = false;
  let messages: Message[] = [];

  async function showMessage(result: ActionResult) {
    loading = true;

    const messageText = result.data.message;

    console.log(result);

    let newMessage: Message = {
      id: messageId++,
      type: result.type === "success" ? "success" : "error",
      text: messageText,
      flying: false,
    };

    console.log(messageId);
    messages.push(newMessage);
    messages = messages;

    // Remove the message
    setTimeout(() => {
      messages = messages.filter((m) => m.id !== newMessage.id); // Use the ID to filter
    }, 3500); // Time to display the message

    if ((result.type = "success")) {
      setTimeout(async () => {
        loading = false;
        await goto("/login");
      }, 1000);
    } else {
      loading = false;
    }

    invalidateAll();
  }
</script>

<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<form
  method="POST"
  class="space-y-5 -my-5"
  use:enhance={({}) => {
    return async ({ result }) => {
      showMessage(result);
    };
  }}
>
  <h2>Register</h2>

  <div class="flex justify-between items-center">
    <label for="username">Benutzername</label>
    <input type="text" id="username" name="username" required />
  </div>
  <div class="flex justify-between items-center">
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required />
  </div>
  <button
    type="submit"
    class="bg-tvblue hover:bg-tvbluelight px-3 py-2 rounded-md text-white group"
  >
    <p class="group group-hover:scale-105">Registrieren</p>
  </button>
</form>

<div class="mt-10 mb-5">
  <p>Bereits registriert?</p>
</div>

<button
  class="bg-tvblue hover:bg-tvbluelight px-3 py-2 rounded-md text-white group"
  on:click={() => {
    window.location.href = "/login";
  }}
>
  <p class="group group-hover:scale-105">Login</p>
</button>

<div
  aria-live="assertive"
  class="pointer-events-none fixed inset-0 z-75 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-16"
>
  <div
    class="flex w-full flex-col items-center space-y-4 sm:items-end message-transition duration-300 transition-transform"
  >
    {#each messages as { id, type, text } (id)}
      <div
        class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-md {type ===
        'success'
          ? 'bg-green-500'
          : 'bg-red-500'} shadow-lg ease-in-out"
        in:fly={{ y: 250, duration: 300, easing: cubicOut }}
        out:fade={{ duration: 300, easing: cubicOut }}
      >
        <div class="p-4">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              {#if type === "success"}
                <svg
                  class="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              {:else}
                <svg
                  class="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path
                    d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                  />
                </svg>
              {/if}
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-white">
                {text}
              </p>
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>

{#if loading}
  <div
    class="fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-60 w-full h-full flex items-center justify-center z-50"
  >
    <div class="spinner"></div>
  </div>
{/if}

<style>
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: white;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
