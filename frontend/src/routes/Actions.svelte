<script lang="ts">
  import { enhance } from "$app/forms";
  import { error } from "$lib/scripts/stores";
  import { onMount } from "svelte";

  let getErrors: HTMLFormElement;
  let errorJson: string;

  onMount(async () => {
    setInterval(async () => {
      await handleError();
    }, 5000);
  });

  async function handleError() {
    errorJson = await submitForm(getErrors);

    try {
      $error = JSON.parse(errorJson[1]);
    } catch (e) {
      console.log(e);
    }
  }

  async function submitForm(form: HTMLFormElement) {
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    return JSON.parse(result.data);
  }
</script>

<form
  action="/fetchErrors?/fetchErrors"
  use:enhance
  method="POST"
  bind:this={getErrors}
  on:submit|preventDefault={() => {}}
></form>
