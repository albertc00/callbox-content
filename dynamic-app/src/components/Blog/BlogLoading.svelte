<script>
  import Skeleton from 'svelte-skeleton/Skeleton.svelte';
</script>

<div class="container">
  <main>
    <article>
      <header class="entry-header">
        <div class="entry-title">
          <h1>
            <Skeleton height="32" width="650" secondaryColor="#f5f4f4" />
            <Skeleton height="32" width="600" secondaryColor="#f5f4f4" />
            <Skeleton height="32" width="200" secondaryColor="#f5f4f4" />
          </h1>
        </div>

        <div class="wp-post-img">
          <Skeleton height="210" width="400" secondaryColor="#f5f4f4" />
        </div>
      </header>
      <div class="entry-content">
        <p>
          <Skeleton height="25" width="850" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="810" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="845" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="830" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="590" secondaryColor="#f5f4f4" />
        </p>
        <p>
          <Skeleton height="25" width="850" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="800" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="845" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="830" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="750" secondaryColor="#f5f4f4" />
        </p>
        <h1><Skeleton height="45" width="750" secondaryColor="#f5f4f4" /></h1>

        <p>
          <Skeleton height="25" width="850" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="820" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="780" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="800" secondaryColor="#f5f4f4" />
          <Skeleton height="25" width="650" secondaryColor="#f5f4f4" />
        </p>
      </div>
    </article>
  </main>
</div>

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
    color: #f5f4f4;
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
