<script>
  export let post;
  export let selector = 'text';
  const text = selector.split('.').reduce((prev, curr) => prev[curr], post);
</script>

{#if selector === 'pdf'}
  <div class="center">
    <a class="cs_button" href={text} target="_blank">See PDF</a>
  </div>
{:else if selector === 'link'}
  <div class="center">
    <a class="cs_button" href={text} target="_blank">See WEBPAGE</a>
  </div>
{:else if selector === 'linkUnlocked'}
  <div class="center">
    <a class="cs_button" href={text} target="_blank">See Full Web page</a>
  </div>
{/if}

<style>
  .center {
    text-align: center;
  }
  .cs_button {
    margin: 10px;
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #014e89;
    color: #014e89;
    border-radius: 0.25rem;
    padding: 0.525rem 1.05rem;
    background-color: transparent;
    font-weight: 600;
    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
    text-decoration: none;
  }

  .cs_button:hover {
    text-decoration: none;
    background-color: #014e89;
    color: #fff;
  }
</style>
