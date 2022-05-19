<script>
  import { Query } from '@sveltestack/svelte-query';
  import Table from './Table.svelte';
  import { LightPaginationNav } from './pagination/index';
  import TableLoading from './TableLoading.svelte';
  import { cols, pages, fieldID } from './store';
  import { col } from './SelectColumn';

  import Modal, { bind } from './modal/index.js';
  import { writable } from 'svelte/store';
  import ViewResult from './ViewResult.svelte';
  import Popup from './modal/Popup.svelte';
  const showModal = () => modal.set(bind(Popup));
  const modal = writable(null);

  const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;

  $: page = $pages;

  async function fetchPosts(page) {
    // const data = await fetch(
    //   `${url}?s=tech&page=${page}&per_page=10&fields=${[5]}`
    // ).then((res) => res.json());
    // console.log(data);
    // return data;
    const res = await fetch(`${url}?s=tech&page=${page}&per_page=10&fields=5`);

    const data = await res.json();

    return data;
  }
  $: queryOptions = {
    queryKey: ['posts', page],
    queryFn: () => fetchPosts(page),
    keepPreviousData: true,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  };

  import { onMount } from 'svelte';

  let box;
  let yTop = 0;
  let yHeight;
  let yScroll;

  function parseScroll() {
    yTop = box.scrollTop;
    yHeight = box.clientHeight;
    yScroll = box.scrollHeight;
  }

  onMount(async () => parseScroll());
</script>

{#if $fieldID > 0}
  <Modal show={modal.set(bind(ViewResult))} />
{/if}
<div class="top-wrapper">
  <div id="selection" class="modal">
    <Modal show={$modal}>
      <button class="modal-button" on:click={showModal}>
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
  </div>
  <Query options={queryOptions}>
    <div slot="query" let:queryResult={{ data, isFetching, isError }}>
      <div class="cntnr">
        <div class="results svelte-fhxlyi">
          {#if isFetching}
            <div class="loading">
              <div
                class="table-wrapper"
                class:tableScrolled={yTop > 45}
                bind:this={box}
                on:scroll={parseScroll}
                on:mousemove={parseScroll}
              >
                <TableLoading />
              </div>
            </div>
          {:else if isError}
            <span>Error</span>
          {:else if data?.length}
            <h2 class="table-label">Case Studies</h2>
            <div class="table-container">
              <div
                class="table-wrapper"
                class:tableScrolled={yTop > 50}
                bind:this={box}
                on:scroll={parseScroll}
                on:mousemove={parseScroll}
              >
                <!-- this is table -->
                <Table
                  tableData={data}
                  tableheaderData={col}
                  tableheader={$cols}
                />

                <!-- table helloworld -->
              </div>
            </div>
            <div class="area-2">
              <LightPaginationNav
                totalItems={data[0].total}
                pageSize={10}
                currentPage={$pages}
                limit={1}
                on:setPage={(e) => ($pages = e.detail.page)}
              />
            </div>
          {/if}
        </div>
      </div>
    </div>
  </Query>
</div>

<style>
  .top-wrapper {
    background-color: #f7f7f7;
  }
  .table-label {
    position: absolute;
    top: 7rem;
    left: 3rem;
    font-family: 'open Sans', sans-serif;
    font-weight: 650;
    font-size: 2rem;
  }
  .modal-button {
    display: grid;
    grid-template-columns: 0.4fr 1fr;
    padding-top: 20px;
    align-items: center;
  }
  .modal-text {
    color: #014e89;
    font-family: 'open Sans', sans-serif;
    font-weight: 650;
    font-size: 1rem;
    text-transform: capitalize;
  }

  .table-container {
    overflow: auto;
    width: 100%;
    margin: auto;
  }

  .table-wrapper {
    overflow: scroll;
    width: 95vw;
    max-height: 69vh;
    margin: 0 auto;
  }

  .loading {
    padding-top: 55px;
  }
  .modal {
    padding-top: 5px;
    padding-bottom: 10px;
    display: grid;
    grid-auto-flow: column;
    justify-content: end;
    width: 95vw;
    margin: 0 auto;
  }

  button.modal-button {
    background-color: #ffca09;
    border: 1px solid #ffca09;
    border-radius: 0.25rem;
    color: #004b84;
    font-weight: 600;
    letter-spacing: 0.0375rem;
    line-height: unset;
    padding: 0.3rem 0.6rem;
    transition: all 0.3s;
    text-transform: uppercase;
  }

  button.modal-button:hover {
    background-color: unset;
    cursor: pointer;
  }

  .area-2 {
    grid-column-start: 2;
    display: flex;
    justify-content: flex-start;
    padding-top: 15px;
    padding-left: 25px;
  }
</style>
