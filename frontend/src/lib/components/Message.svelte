<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";
  import { cubicOut } from "svelte/easing";
  import { fade, fly } from "svelte/transition";

  interface Message {
    id: number;
    type: "success" | "error" | "warning";
    text: string;
    flying: boolean;
  }

  let messageId = 0;
  let messages: Message[] = [];

  export function showMessage(result: ActionResult) {
    const messageText = result.data.message;

    let newMessage: Message = {
      id: messageId++,
      type: result.type === "success" ? "success" : "error",
      text: messageText,
      flying: false,
    };

    if (messageText.includes("wurde gelöscht")) {
      newMessage.type = "warning";
    }

    messages.push(newMessage);
    messages = messages;

    // Remove the message
    setTimeout(() => {
      messages = messages.filter((m) => m.id !== newMessage.id); // Use the ID to filter
    }, 3500); // Time to display the message

    invalidateAll();
  }
</script>

<div
  aria-live="assertive"
  class="pointer-events-none fixed inset-0 z-75 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-16"
>
  <div
    class="flex w-full flex-col items-center space-y-4 sm:items-end message-transition duration-300 transition-transform"
  >
    {#each messages as { id, type, text } (id)}
      {#if text}
        <div
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-md {type ===
          'success'
            ? 'bg-green-500'
            : type === 'warning'
              ? 'bg-yellow-500'
              : 'bg-red-500'} shadow-lg ease-in-out"
          in:fly={{ y: 250, duration: 300, easing: cubicOut }}
          out:fade={{ duration: 300, easing: cubicOut }}
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                {#if type == "success"}
                  <svg
                    class="h-6 w-6 text-white fill-none"
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
                {:else if type == "error"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e8eaed"
                    ><path
                      d="M330-120 120-330v-300l210-210h300l210 210v300L630-120H330Zm36-190 114-114 114 114 56-56-114-114 114-114-56-56-114 114-114-114-56 56 114 114-114 114 56 56Zm-2 110h232l164-164v-232L596-760H364L200-596v232l164 164Zm116-280Z"
                    /></svg
                  >
                {:else}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e8eaed"
                    ><path
                      d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"
                    /></svg
                  >
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
      {/if}
    {/each}
  </div>
</div>
