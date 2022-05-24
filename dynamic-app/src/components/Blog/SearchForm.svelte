<script>
  import { isSearching, SearchTerm, fields } from '../store';

  function handleOnSubmit() {
    $isSearching = true;
    $fields = $fields;
  }

  import Modal, { bind } from '../modal/index.js';
  import { writable } from 'svelte/store';
  import Filter from '../modal/Filter.svelte';
  const modal = writable(null);
  const showModal = () => modal.set(bind(Filter));
</script>

<div class="wrapper-spacer" />
<div class="wrapper-bar">
  <!-- <Modal show={$modal}>
    <button class="menubar" on:click={showModal} aria-label="Start search">
      <div class="menubarlabel">
        <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"
          ><path
            d="M17.75 28.917V27.917H22.25V28.917ZM6.083 10.417V9.417H33.917V10.417ZM11.083 19.667V18.667H28.917V19.667Z"
          /></svg
        ><span class="menulabel">Filters</span>
      </div>
    </button>
  </Modal> -->
  <div class="wrapper-spacer" />
  <form class="form" on:submit|preventDefault={handleOnSubmit}>
    <div class="wrapper svelte-iqmikt">
      <input
        class="searchBox svelte-iqmikt"
        type="search"
        name="search"
        spellcheck="true"
        placeholder="Type keywords to find case studies"
        aria-label="Search case studies"
        bind:value={$SearchTerm}
        required
      />

      <button
        class="button svelte-iqmikt"
        disabled={$SearchTerm === ''}
        type="submit"
        aria-label="Start search"
        title="Click to search"
        ><svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          width="24px"
          height="24px"
          ><path d="M0 0h24v24H0z" fill="none" /><path
            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
          /></svg
        ></button
      >
    </div>
    <!-- dropdown -->

    <!-- <div class="dropdown">
      <ul class="checbox-filters">
        {#each selects as { n, id, label } (id)}
          <li class="check-svelte">
            <input
              class="checkbox-svelte"
              type="checkbox"
              bind:group={$fields}
              value={n}
            />
            <label class="checkbox-label" for={id}> {label} </label>
          </li>
        {/each}
      </ul>
    </div> -->
    <!-- dropdown -->
  </form>
</div>

<style>
  .wrapper-bar {
    display: grid;
    grid-template-columns: max-content 370px;
    align-items: center;
    padding-top: 15px;
    justify-content: end;
    background-color: #f7f7f7;
    padding-right: 37px;
  }
  .menubar {
    background: none;
    border: 0;

    cursor: pointer;
  }
  .menulabel {
    color: #231f20;
    font-family: 'open Sans', sans-serif;
    font-weight: 400;
    font-size: 1.15rem;
  }
  .menubarlabel {
    display: grid;
    grid-template-columns: 2fr 3fr;
    align-items: center;
  }

  .form {
    max-width: 350px;
    width: 100%;

    padding: 10px;
  }
  .wrapper.svelte-iqmikt {
    position: relative;
    border-radius: 0.375rem;
    background: #fff;
  }
  .searchBox.svelte-iqmikt {
    display: inline-block;
    width: 100%;
    padding: 0.75rem 2.875rem 0.75rem 0.75rem;
    margin: 0;
    font-family: 'Lato', sans-serif;
    font-size: 1.125rem;
    color: #5f7380;
    border: 1px solid #c4cbcf;
    border-radius: 0.375rem;
    box-shadow: 0px 8px 9px -6px rgb(95 115 128 / 44%);
  }
  .button.svelte-iqmikt {
    position: absolute;
    right: 0;
    top: 0;
    height: 2.875rem;
    width: 2.875rem;
    padding: 0;
    background: none;
    border: 0 none;
    border-radius: 0 0.375rem 0.375rem 0;
    padding: 0.6875rem;
    cursor: pointer;
  }
  .button.svelte-iqmikt:disabled {
    cursor: not-allowed;
  }

  .button.svelte-iqmikt:disabled > svg {
    fill: #c4cbcf;
  }
</style>
