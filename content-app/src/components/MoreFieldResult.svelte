<script>
  import Selection from './Selection.svelte';

  import SearchFormClose from './SearchFormClose.svelte';
  import { Query } from '@sveltestack/svelte-query';
  import { SearchTerm, selection, fields } from './store';

  import { LightPaginationNav } from './pagination/index.js';
  import { cols } from './store';
  import NoResult from './NoResult.svelte';

  import { writable } from 'svelte/store';
  import Modal, { bind } from 'svelte-simple-modal';
  import Popup from './modal/Popup.svelte';

  const modal = writable(null);
  const showModal = () => modal.set(bind(Popup));

  let page = 1;
  let s;

  $: s = $SearchTerm.toLowerCase();

  $: field = $fields;

  const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;
  async function fetchPosts({ page = 1, s, field, $selection }) {
    if ($selection > 0) {
      const res = await fetch(
        `${url}?s=${s}&page=${page}&per_page=10&fields=${$selection}`
      );

      const data = await res.json();
      console.log(data);
      return data;
    } else {
      const res = await fetch(
        `${url}?s=${s}&page=${page}&per_page=10&fields=${field.join(',')}`
      );

      const data = await res.json();

      return data;
    }
  }

  $: queryOptions = {
    queryKey: ['seeMore', page, s, field, $selection],
    queryFn: () => fetchPosts({ page, s, field, $selection }),
    enabled: $SearchTerm !== '',
    keepPreviousData: true,
    cacheTime: 1000 * 60 * 5,
  };
</script>

<!-- backup fect function-->
<!-- const res = await fetch(
  `${url}?s=${s}&page=${page}&per_page=10&fields=${field.join(',')}`
);

const data = await res.json();

return data; -->

<SearchFormClose />

<Selection />

<Modal show={$modal}>
  <button class="modal-button" on:click={showModal}>Show modal</button>
</Modal>

<Query options={queryOptions}>
  <div slot="query" let:queryResult={{ data, isFetching, isError }}>
    <div class="cntnr svelte-y5n953">
      <div class="results svelte-fhxlyi">
        {#if isFetching}
          <h2>Loading...</h2>
        {:else if isError}
          <span>Error</span>
        {:else if data?.length}
          {#if $selection > 0}
            <div class="area-4">
              <LightPaginationNav
                totalItems={data[0].total}
                pageSize={10}
                currentPage={page}
                limit={1}
                on:setPage={(e) => (page = e.detail.page)}
              />
            </div>
          {/if}
          <div class="table-wrapper">
            {#each data as { posts, label, id, total } (id)}
              <h4>{label}</h4>
              <table>
                <thead>
                  <tr>
                    <th>Title </th>

                    {#each $cols as c (c[0].id)}
                      <th>{c[0].label}</th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each posts as post (post.id)}
                    <tr>
                      <td>{post.title}</td>
                      {#each $cols as c (c[0].id)}
                        {#if c[0].id == 'client-location'}
                          <td>{post.clientLocation}</td>
                        {/if}
                        {#if c[0].id == 'product'}
                          <td>{post.product}</td>
                        {/if}
                        {#if c[0].id == 'campaign'}
                          <td>
                            {#each post.campaign as { label }}<span
                                >{label}</span
                              >
                            {/each}
                          </td>
                        {/if}
                        {#if c[0].id == 'link'}
                          <td>{post.link}</td>
                        {/if}
                        {#if c[0].id == 'linkUnlocked'}
                          <td>{post.linkUnlocked}</td>
                        {/if}
                        {#if c[0].id == 'pdf'}
                          <td>{post.pdf}</td>
                        {/if}
                        {#if c[0].id == 'clientHQ'}
                          <td>{post.clientHQ}</td>
                        {/if}
                        {#if c[0].id == 'target-location'}
                          <td>{post.targetLocation}</td>
                        {/if}
                        {#if c[0].id == 'target-industry'}
                          <td>{post.targetIndustry}</td>
                        {/if}
                        {#if c[0].id == 'target-dm'}
                          <td>{post.targetDM}</td>
                        {/if}
                        {#if c[0].id == 'results'}
                          <td>
                            {#each post.results as { label }}
                              <span>{label}</span>
                            {/each}</td
                          >
                        {/if}
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            {/each}
          </div>
        {:else}
          <NoResult />
        {/if}
      </div>
    </div>
  </div>
</Query>

<style>
  table,
  td {
    border: 1px solid rgb(199, 198, 198);
    border-collapse: collapse;
    margin-bottom: 10px;
    padding: 10px;
    width: 100%;
  }
  th {
    color: #014e89;
    border: 1px solid rgb(199, 198, 198);
    border-collapse: collapse;
    margin-bottom: 10px;
    padding: 10px;
    font-family: 'Lato', sans-serif;
    font-size: 1.15rem;
    font-size: 1.15rem;
    line-height: 1.2rem;
  }
  tr:nth-child(even) {
    background-color: #f1efef;
  }

  .area-4 {
    color: 1d1d1d;
    padding-left: 0;
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
  }

  .table-wrapper {
    padding: 1.5rem;

    overflow: auto;
  }
  .modal-button {
    padding: 10px;
  }
</style>
