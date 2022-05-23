<script>
  import { pages, fieldID } from '../store';
  import BlogTable from './BlogTable.svelte';
  import { LightPaginationNav } from '../pagination/index';
  import TableLoading from './TableLoading.svelte';
  import { useQuery } from '@sveltestack/svelte-query';

  import Modal, { bind } from '../modal/index';
  import { writable } from 'svelte/store';
  import BlogPost from './BlogPost.svelte';
  import Popup from '../modal/Popup.svelte';
  const showModal = () => modals.set(bind(Popup));
  const modals = writable(null);

  const url = `https://www.callboxinc.com/wp-json/wp/v2/posts`;

  let perPage = 10;
  $: page = $pages;
  async function fetchPosts(page, perPage = 10) {
    const res = await fetch(`${url}?_embed&page=${page}&per_page=${perPage}`);

    const totalPage = res.headers.get('x-wp-totalpages');
    const data = await res.json();

    return { data, totalPage };
  }

  $: queryResult = useQuery(
    ['posts', page, perPage],
    () => fetchPosts(page, perPage),
    {
      keepPreviousData: true,
      cacheTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    }
  );

  $: d = $queryResult.data;
  $: isFetching = $queryResult.isFetching;
  $: isLoading = $queryResult.isLoading;
  $: isError = $queryResult.isError;
  $: data = d?.data;
  $: totalPage = d?.totalPage;

  import { onMount } from 'svelte';
  import SearchForm from './SearchForm.svelte';
  let box;
  let yTop = 0;

  function parseScroll() {
    yTop = box.scrollTop;
  }

  onMount(async () => parseScroll());
</script>

<SearchForm />
{#if $fieldID > 0}
  <Modal show={modals.set(bind(BlogPost))} />
{/if}
<Modal show={$modals}>
  <button class="modal-button" style="display:none" on:click={showModal}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="#014e89"
      height="30"
      width="35"
      viewBox="-5 7 55 35"
      ><path
        d="M9 39H11.2L35.45 14.75L34.35 13.65L33.25 12.55L9 36.8ZM6 42V35.6L35.4 6.2Q36.25 5.35 37.525 5.375Q38.8 5.4 39.65 6.25L41.8 8.4Q42.65 9.25 42.65 10.5Q42.65 11.75 41.8 12.6L12.4 42ZM39.5 10.45 37.45 8.4ZM35.45 14.75 34.35 13.65 33.25 12.55 35.45 14.75Z"
      /></svg
    >
    <span class="modal-text">Edit Columns</span>
  </button>
</Modal>

<div class="cntnr">
  <div class="results svelte-fhxlyi">
    {#if isFetching || isLoading}
      <div class="loading">
        <div
          class="table-wrapper"
          class:tableScrolled={yTop > 50}
          bind:this={box}
          on:scroll={parseScroll}
          on:mousemove={parseScroll}
        >
          <TableLoading />
        </div>
      </div>
    {:else if isError}
      <span>Error</span>
    {:else}
      <h2 class="table-label">Blog</h2>
      <div class="table-container">
        <div
          class="table-wrapper"
          class:tableScrolled={yTop > 50}
          bind:this={box}
          on:scroll={parseScroll}
          on:mousemove={parseScroll}
        >
          <BlogTable tableData={data} />
        </div>
      </div>
      <div class="area-2">
        <LightPaginationNav
          totalItems={totalPage}
          pageSize={10}
          currentPage={$pages}
          limit={1}
          on:setPage={(e) => ($pages = e.detail.page)}
        />
      </div>
    {/if}
  </div>
</div>

<style>
  /* .loading {
    padding-top: 20px;
  } */
  .table-label {
    position: absolute;
    top: 5.5rem;
    left: 3rem;
    font-family: 'open Sans', sans-serif;
    font-weight: 650;
    font-size: 2rem;
  }
  .table-container {
    overflow: auto;
    width: 100%;
    margin: auto;
  }

  .table-wrapper {
    overflow: scroll;
    width: 95vw;
    max-height: 73vh;
    margin: 0 auto;
  }

  .cntnr {
    padding-top: 20px;
    background-color: #f7f7f7;
  }

  .area-2 {
    grid-column-start: 2;
    padding-left: 0;
    display: flex;
    justify-content: flex-start;
    padding: 10px;
  }
</style>
