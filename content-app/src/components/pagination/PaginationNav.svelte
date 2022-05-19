<script>
  import { createEventDispatcher } from 'svelte';
  import generateNavigationOptions from './generateNavigationOptions';
  import {
    PREVIOUS_PAGE,
    NEXT_PAGE,
    ELLIPSIS,
  } from '../pagination/symbolTypes';
  const dispatch = createEventDispatcher();
  export let totalItems = 0;
  export let pageSize = 1;
  export let currentPage = 1;
  export let limit = null;
  export let showStepOptions = false;
  $: options = generateNavigationOptions({
    totalItems,
    pageSize,
    currentPage,
    limit,
    showStepOptions,
  });
  $: totalPages = Math.ceil(totalItems / pageSize);
  function handleOptionClick(option) {
    dispatch('setPage', { page: option.value });
  }
</script>

<div class="pagination-nav">
  {#each options as option}
    <span
      class="option"
      class:number={option.type === 'number'}
      class:prev={option.type === 'symbol' && option.symbol === PREVIOUS_PAGE}
      class:next={option.type === 'symbol' && option.symbol === NEXT_PAGE}
      class:disabled={(option.type === 'symbol' &&
        option.symbol === NEXT_PAGE &&
        currentPage >= totalPages) ||
        (option.type === 'symbol' &&
          option.symbol === PREVIOUS_PAGE &&
          currentPage <= 1)}
      class:ellipsis={option.type === 'symbol' && option.symbol === ELLIPSIS}
      class:active={option.type === 'number' && option.value === currentPage}
      on:click={() => handleOptionClick(option)}
    >
      {#if option.type === 'number'}
        <slot name="number" value={option.value}>
          <span>{option.value} </span>
        </slot>
      {:else if option.type === 'symbol' && option.symbol === ELLIPSIS}
        <slot name="ellipsis">
          <svg
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            width="24px"
            height="24px"
            ><path d="M0 0h24v24H0z" fill="none" /><path
              d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
            /></svg
          >
        </slot>
      {:else if option.type === 'symbol' && option.symbol === PREVIOUS_PAGE}
        <slot name="prev">
          <svg
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            width="24px"
            height="24px"
            ><path d="M0 0h24v24H0z" fill="none" /><path
              d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
            /></svg
          >
        </slot>
      {:else if option.type === 'symbol' && option.symbol === NEXT_PAGE}
        <slot name="next">
          <svg
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="black"
            width="24px"
            height="24px"
            ><path d="M0 0h24v24H0z" fill="none" /><path
              d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
            /></svg
          >
        </slot>
      {/if}
    </span>
  {/each}
</div>
