<script>
  import PaginationNav from './PaginationNav.svelte';
</script>

<div class="light-pagination-nav">
  <PaginationNav {...$$props} on:setPage />
</div>

<!-- 
.light-pagination-nav :global(.option.number),
  .light-pagination-nav :global(.option.ellipsis) {
    /* padding: 10px 15px; */

    padding: 0;
    height: 2rem;
    width: 2rem;
    font-family: 'Lato', sans-serif;
    font-size: 0.875rem;
    line-height: 1.25rem;
    border: 0 none;
    border-radius: 999px;
    margin: 0 0.125rem;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in;
  } -->

<!-- .light-pagination-nav :global(.option.number),
  .light-pagination-nav :global(.option.ellipsis) {
    /* padding: 10px 15px; */

    padding: 0;
    height: 2rem;
    width: 2rem;
    font-family: 'Lato', sans-serif;
    font-size: 0.875rem;
    line-height: 1.25rem;
    border: 0 none;
    border-radius: 999px;
    margin: 0 0.125rem;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in;
  } -->
<style>
  .light-pagination-nav :global(.pagination-nav) {
    /* display: flex;
    justify-content: center; */
    display: flex;
    margin: 0 1rem;
  }
  .light-pagination-nav :global(.option) {
    /* padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s all ease-out;
    user-select: none;
    color: hsl(200, 90%, 10%); */

    padding: 0;
    height: 2rem;
    width: 2rem;
    font-family: 'Lato', sans-serif;
    font-size: 0.875rem;
    line-height: 1.25rem;
    border: 0 none;
    border-radius: 999px;
    margin: 0 0.125rem;
    background: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .light-pagination-nav :global(.option:hover) {
    background: rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  .light-pagination-nav :global(.option.active) {
    /* color: hsl(200, 70%, 50%); */
    color: #fff;
    background-color: #196fd9;
    cursor: default;
  }
</style>
