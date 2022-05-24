<script>
  import { col } from '../SelectColumn';
  import {
    isSearching,
    SearchTerm,
    fields,
    cols,
    seecol,
    MoreField,
  } from '../store';
  import { selects } from '../selection';
  function handleOnSubmit() {
    $isSearching = false;
    $MoreField = true;

    $cols = $cols;
  }
  $: console.log($cols);
</script>

<!-- <form class="form" on:submit|preventDefault={handleOnSubmit}>
  <div class="wrapper svelte-iqmikt"> -->
<h2>Select What Column you want to display</h2>
<ul class="checbox-filters">
  {#each col as { id, label } (id)}
    <li class="check-svelte">
      <div class="filters">
        <input
          class="checkbox-svelte"
          type="checkbox"
          bind:group={$cols}
          value={id}
        />
        <!-- no array value, array is the problem -->
        <label class="checkbox-label" for={id}>
          {label}
        </label>
      </div>
    </li>
  {/each}
</ul>

<!-- </div>
</form> -->
<style>
  ul {
    list-style-type: none;
  }
  .filters {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    padding: 3px;
  }

  .checbox-filters {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    padding: 0;
  }
  .checkbox-svelte {
    -webkit-appearance: none;
    background-color: #fafafa;
    border: 1px solid #cacece;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
      inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05);
    padding: 8px;
    border-radius: 3px;
    display: inline-block;
    position: relative;
  }
  .checkbox-svelte:active,
  .checkbox-svelte:checked:active {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
      inset 0px 1px 3px rgba(0, 0, 0, 0.1);
  }

  .checkbox-svelte:checked {
    background-color: #e9ecee;
    border: 1px solid #adb8c0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
      inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05),
      inset 15px 10px -12px rgba(255, 255, 255, 0.1);
    color: #99a1a7;
  }
  .checkbox-svelte:checked:after {
    content: '\2714';

    font-size: 18px;
    position: absolute;
    top: -4px;
    left: 1px;

    color: #4e4e4e;
  }
  .checkbox-svelte:hover {
    transform: scale(1.2, 1.2);
  }
  .checkbox-label {
    font-family: 'Work Sans', work-sans, sans-serif;
    font-size: 1.15rem;
    line-height: 1.2rem;
    padding: 8px;
    color: #1f1f1f;
  }
</style>
