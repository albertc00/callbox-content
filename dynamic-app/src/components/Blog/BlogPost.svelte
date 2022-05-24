<script>
  import BlogLoading from './BlogLoading.svelte';
  import { Query } from '@sveltestack/svelte-query';
  import { fieldID, SearchTerm, pages } from '../store';

  const url = `https://www.callboxinc.com/wp-json/wp/v2/posts`;

  let perPage = 10;
  $: s = $SearchTerm.toLowerCase();

  async function fetchPosts({ s, $pages, perPage = 10 }) {
    if ($SearchTerm.length == 0) {
      const res = await fetch(
        `${url}?_embed&per_page=${perPage}&page=${$pages}`
      );

      const data = await res.json();

      return data;
    } else {
      const res = await fetch(
        `${url}?_embed&search=${s}&per_page=${perPage}&page=${$pages}`
      );

      const data = await res.json();

      return data;
    }
  }

  $: queryOptions = {
    queryKey: ['seeMore', s, $pages, perPage],
    queryFn: () => fetchPosts({ s, $pages, perPage }),
    enabled: $SearchTerm !== '' || $SearchTerm === '',
    keepPreviousData: true,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  };
</script>

<Query options={queryOptions}>
  <div slot="query" let:queryResult={{ data, isFetching, isError }}>
    {#if isFetching}
      <BlogLoading />
    {:else if isError}
      <span>Error</span>
    {:else}
      <div class="container">
        <main>
          {#each data as post (post.id)}
            {#if post.id == $fieldID}
              <article>
                <header class="entry-header">
                  <div class="entry-title">
                    <h1>{post.title.rendered}</h1>
                    <div class="entry-author">
                      Written by
                      <a href="https://www.callboxinc.com/author/meldoyr/"
                        >{post._embedded['author']['0'].name}</a
                      >
                    </div>
                  </div>

                  <img
                    class="wp-post-img"
                    src={post._embedded['wp:featuredmedia']['0'].link}
                    alt={post.slug}
                    width="800"
                    height="450"
                  />
                </header>
                <div class="entry-content">
                  <p>{@html post.content.rendered}</p>
                </div>
              </article>
            {/if}
          {/each}
        </main>
      </div>
    {/if}
  </div>
</Query>

<style>
  article {
    float: none;
    clear: initial;
    width: 100%;
    position: initial;
  }
  .entry-author {
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-family: 'Work Sans', sans-serif;
    color: #231f20;
  }
  .container {
    padding-top: 5rem;
    padding-bottom: 5rem;
    padding-right: calc(1280px / 12);
    padding-left: calc(1280px / 12);
  }
  .wp-post-img {
    width: 100%;
    height: auto;
  }
  .entry-header {
    grid-template-columns: 2fr 3fr;
    gap: 2rem;
    display: grid;
    order: 1;
  }
  .entry-title {
    order: 1;
    display: grid;
    row-gap: 0.75rem;
  }
  .entry-content {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  .entry-content p {
    font-size: 1.25rem;
    line-height: 2.375rem;
    color: rgba(35, 31, 32, 0.9);
    font-family: 'Lora', 'Lato', sans-serif;
    font-weight: 400;

    margin-block-start: 5rem;
    margin-block-end: 2.5rem;
  }
</style>
