<script>
  import {
    isSearching,
    SearchTerm,
    seeMore,
    fields,
    MoreField,
    viewfield,
  } from './store';

  function handleOnSubmit() {
    $isSearching = false;
    $SearchTerm = '';
    $seeMore = false;
    $fields = '';
    $MoreField = false;
    $viewfield = false;
  }
  function onClick() {
    $isSearching = true;
    $seeMore = false;
    $viewfield = false;
  }
  function handleClick() {
    $isSearching = true;
    $MoreField = false;
    $viewfield = false;
  }
</script>

<form on:submit|preventDefault={handleOnSubmit}>
  <div class="nav-bg svelte-17p2yix">
    <div class="cntnr svelte-y5n953">
      <div class="nav svelte-17p2yix">
        {#if $seeMore}
          <div class="resultsFor svelte-17p2yix">
            <button
              type="button"
              class="link svelte-1yo2ena primary"
              on:click={() => onClick()}
              aria-disabled="false"
              >« Back to all results for “{$SearchTerm}”</button
            >
          </div>
        {:else if $MoreField}
          <div class="resultsFor svelte-17p2yix">
            <button
              type="button"
              class="link svelte-1yo2ena primary"
              on:click={() => handleClick()}
              aria-disabled="false"
              >« Back to all results for “{$SearchTerm}”</button
            >
          </div>
        {:else if $viewfield}
          <div class="resultsFor svelte-17p2yix">
            <button
              type="button"
              class="link svelte-1yo2ena primary"
              on:click={() => handleClick()}
              aria-disabled="false"
              >« Back to all results for “{$SearchTerm}”</button
            >
          </div>
        {:else}
          <div class="resultsFor svelte-17p2yix">
            Results for "{$SearchTerm}"
          </div>
        {/if}

        <button
          class="close svelte-17p2yix"
          type="submit"
          aria-label="Start search"
          title="Click to search"
          disabled=""
          aria-disabled="true"
        >
          <svg
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            width="36px"
            height="36px"
            ><path d="M0 0h24v24H0z" fill="none" /><path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            /></svg
          >
        </button>
      </div>
    </div>
  </div>
</form>

<style>
  .nav-bg.svelte-17p2yix {
    position: sticky;
    top: 44px;
    z-index: 200;
    background-color: #f2f2f2;
  }

  .cntnr.svelte-y5n953 {
    padding-right: calc(1280px / 12);
    padding-left: calc(1280px / 12);
  }
  .nav.svelte-17p2yix {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }
  .resultsFor.svelte-17p2yix {
    color: #014e89;
    font-family: 'Lato', sans-serif;
    font-weight: 700;
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  .close.svelte-17p2yix {
    border: 0 none;
    background: none;
    padding: 1rem;
    height: calc(36px + 2rem);
    border-radius: 999px;
    cursor: pointer;
    transition: background-color 0.4s ease-in-out;
  }
  .close.svelte-17p2yix > svg {
    fill: #5f7380;
  }
  .close.svelte-17p2yix:hover {
    background-color: #e7e7e7;
  }
  .link.svelte-1yo2ena {
    font-family: inherit;
    font-size: inherit;
    font-weight: 700;
    letter-spacing: inherit;
    border: 0 none;
    padding: 0 0 0.125rem 0;
    border-radius: 0;
    cursor: pointer;
    background-color: transparent;
    color: #196ed9;
    box-shadow: none;
    transition: none;
  }
</style>
