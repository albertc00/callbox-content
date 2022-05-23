<script>
  import Result from './Result.svelte';
  import { QueryClient, QueryClientProvider } from '@sveltestack/svelte-query';
  import {
    SearchTerm,
    isSearching,
    fields,
    seeMore,
    MoreField,
    viewfield,
    category,
  } from './store';
  import SearchForm from './SearchForm.svelte';
  import FieldResult from './FieldResult.svelte';
  import SearchResult from './SearchResult.svelte';
  import Dashboard from './Dashboard.svelte';
  import ContentSelector from './ContentSelector.svelte';
  import UserAccount from './UserAccount.svelte';
  import BlogResult from './Blog/BlogResult.svelte';
  import BlogSearchResult from './Blog/BlogSearchResult.svelte';
  import TableLoading from './Blog/TableLoading.svelte';

  const queryClient = new QueryClient();

  function onClick() {
    $isSearching = false;
    $SearchTerm = '';
    $seeMore = false;
    $fields = '';
    $MoreField = false;
    $viewfield = false;
  }
</script>

<QueryClientProvider client={queryClient}>
  <div
    style="height: 100vh;
  background-color: #f7f7f7;"
  >
    <div class="navbar-selection">
      <div class="nav-wrapper">
        <Dashboard />
        <ContentSelector />
        <div class="divider">|</div>
        <UserAccount />
      </div>
    </div>
    {#if $category == 1}
      {#if $isSearching}
        {#if $fields.length}
          <SearchForm />
          <FieldResult />
        {:else}
          <SearchForm />
          <SearchResult />
        {/if}
      {:else}
        <SearchForm />
        <Result />
      {/if}
    {:else if $category == 2}
      {#if $isSearching}
        <BlogSearchResult />
      {:else}
        <BlogResult />
      {/if}
    {/if}
  </div>
</QueryClientProvider>

<style lang="scss">
  @use '../styles/app';

  @include app.reset;

  @include app.root {
    main {
      text-align: center;
      padding: 1rem;
      max-width: 240px;
      margin: 0 auto;

      @include app.screen-sm {
        max-width: none;
      }
    }

    h1 {
      color: app.$colors-blue-400;
      text-transform: uppercase;
      font-size: 3.75rem;
      line-height: 1;
    }
  }
  .divider {
    color: #f7f7f7;
    text-align: center;
    font-size: 40px;
    height: 54px;
  }
  .navbar-selection {
    top: 44px;
    z-index: 200;
    background-color: #014e89;
  }

  .nav-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr max-content 50px 65px;
    padding: 0 30px;
    align-items: center;
  }
  .close.svelte-17p2yix {
    border: 0 none;
    background: none;
    padding-top: 15px;
    padding-left: 58rem;
    height: calc(36px + 2rem);
    border-radius: 999px;
    cursor: pointer;
    transition: background-color 0.4s ease-in-out;
  }
  .close.svelte-17p2yix > svg {
    fill: #f7f7f7;
  }
  // .close.svelte-17p2yix:hover {
  //   background-color: #e7e7e7;
  // }
</style>
