<script>
  export let post;
  export let selector = 'text';
  const text = selector.split('.').reduce((prev, curr) => prev[curr], post);
  console.log(text);
</script>

{#if selector === 'campaign'}
  <div class="center">
    {#each text as { label }}
      <span>{label}</span><br />
    {/each}
  </div>
{:else if selector === 'results'}
  <div class="center">
    <table>
      <thead>
        <tr>
          <th> Label </th>
          <th> Value </th>
        </tr>
      </thead>
      <tbody>
        {#each text as { label, value }}
          <tr>
            <td>
              {label}
            </td>
            <td>
              {value}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}

<style>
  .center {
    text-align: center;
  }
  table {
    border: 1px solid rgb(199, 198, 198);
    border-collapse: collapse;
  }

  table,
  td {
    /* border: 1px solid rgb(199, 198, 198); */
    /* border-collapse: collapse;  */
    margin-bottom: 10px;
    padding: 10px;
    width: 100%;
    position: relative;
  }
  th {
    background-color: #014e89;
    color: white;
    /* border: 1px solid rgb(199, 198, 198); */
    /* border-collapse: collapse; */
    margin-bottom: 10px;
    padding: 10px;
    font-family: 'Lato', sans-serif;
    font-size: 1.15rem;
    line-height: 1.2rem;
  }
  tr:hover {
    background-color: #f1efef;
  }
  td {
    font-family: 'Work Sans', sans-serif;
    letter-spacing: initial;
  }

  th {
    color: #fff;
    background-color: #014e89;
    font-weight: 600 !important;
    text-transform: uppercase;
    font-size: 1rem;
    line-height: 1.25rem;
    font-family: 'Work Sans', sans-serif;
    letter-spacing: 0.1px;
    padding: 15px 25px;
    min-width: 200px;
    text-align: center;
  }
  tr:nth-child(odd) {
    background-color: rgb(202, 199, 199);
  }
</style>
