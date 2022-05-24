<script>
  import { Query } from '@sveltestack/svelte-query';
  import Skeleton from 'svelte-skeleton/Skeleton.svelte';
  import { SearchTerm, selection, fields } from './store';
  let page = 1;
  let s;

  $: s = $SearchTerm.toLowerCase();

  $: field = $fields;
  $: console.log(s.len);
  const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;
  async function fetchPosts({ page = 1, s, field }) {
    const res = await fetch(
      `${url}?s=${s}&page=${page}&per_page=10&fields=${field.join(',')}`
    );

    const data = await res.json();

    $selection = data[0].n;

    return data;
  }

  $: queryOptions = {
    queryKey: ['seeMore', page, s, field],
    queryFn: () => fetchPosts({ page, s, field }),
    enabled: $SearchTerm !== '',
    keepPreviousData: true,
    cacheTime: 1000 * 60 * 5,
  };
</script>

<Query options={queryOptions}>
  <div slot="query" let:queryResult>
    <div class="wrapper">
      {#if queryResult.isFetching}
        <Skeleton height="42" width="180" />
      {:else if queryResult.isError}
        <span>Error</span>
      {:else}
        <select class="rc-select" bind:value={$selection}>
          {#each queryResult.data as { n, label, id } (id)}
            <option value={n}>
              {label}
            </option>
          {/each}
        </select>
      {/if}
    </div>
  </div>
</Query>

<style>
  .wrapper {
    padding: 5px;
    position: relative;
  }
  select {
    -webkit-appearance: none;
    border-radius: 0px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAANCAYAAAC+ct6XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjBBRUQ1QTQ1QzkxMTFFMDlDNDdEQzgyNUE1RjI4MTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjBBRUQ1QTU1QzkxMTFFMDlDNDdEQzgyNUE1RjI4MTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMEFFRDVBMjVDOTExMUUwOUM0N0RDODI1QTVGMjgxMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMEFFRDVBMzVDOTExMUUwOUM0N0RDODI1QTVGMjgxMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk5mU4QAAACUSURBVHjaYmRgYJD6////MwY6AyaGAQIspCieM2cOjKkIxCFA3A0TSElJoZ3FUCANxAeAWA6IOYG4iR5BjWwpCDQCcSnNgxoIVJCDFwnwA/FHWlp8EIpHSKoGgiggLkITewrEcbQO6mVAbAbE+VD+a3IsJTc7FQAxDxD7AbEzEF+jR1DDywtoCr9DbhwzDlRZDRBgACYqHJO9bkklAAAAAElFTkSuQmCC);
    background-position: center right;
    background-repeat: no-repeat;
    border-radius: 2px;
    outline: none;
    font: 1em 'HelveticaNeue', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #181818;
    margin: 0;
    width: 100%;

    margin-bottom: 5px;
  }

  select.rc-select {
    width: 30%;
    padding: 7px;
    background-color: transparent;
    border: 1px solid rgba(95, 115, 128, 0.7);
    font-family: 'Lato', sans-serif;
    color: #292929;
  }
  select.rc-select {
    border: 1px solid rgba(95, 115, 128, 0.7);
    border-radius: 4px;
    color: #777;
    font-family: 'Lato', sans-serif;
    min-width: 200px;
    min-height: 43px;
    margin: 0;
    width: 100%;
  }
  .wrapper {
    padding: 0;
  }
</style>
