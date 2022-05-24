<script>
  import Skeleton from 'svelte-skeleton/Skeleton.svelte';
  import { LightPaginationNav } from './pagination/index';
  let page = 1;

  const loading = [555, 450, 530, 528, 562, 524, 500, 500, 500, 500];
</script>

<h2 class="table-label">Case Studies</h2>
<div class="table-container">
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th> Title </th>
          <th> PRODUCT OR SERVICE </th>
          <th> PDF </th>
        </tr>
      </thead>
      <tbody>
        <!-- {#each range(begin, end, step) as i} -->
        {#each loading as load}
          <tr>
            <td><Skeleton height="18" width={load} /> </td>
            <td class="table-td"><Skeleton height="20" width="80" /> </td>
            <td class="table-td"><Skeleton height="40" width="90" /> </td>
          </tr>
        {/each}
        <!-- {/each} -->
      </tbody>
    </table>
  </div>
</div>
<div class="footer" style="min-height: 35rem; overflow: hidden;" />

<style>
  .table-wrapper {
    overflow: scroll;
    width: 95vw;
    max-height: 72vh;
    margin: 0 auto;
    position: absolute;
    top: 11.35rem;
  }
  .table-container {
    overflow: auto;
    width: 100%;
    margin: auto;
  }
  .footer {
    overflow: hidden;
  }

  table,
  td {
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
    background-color: #fff;
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
  .table-td {
    text-align: center;
  }

  .tableScrolled table thead {
    position: sticky;
    top: -1px;
    left: 0;
    z-index: 999;
  }
  .table-label {
    position: absolute;
    top: 5.5rem;
    left: 3rem;
    font-family: 'open Sans', sans-serif;
    font-weight: 650;
    font-size: 2rem;
  }
  table {
    border: 1px solid rgb(199, 198, 198);
    border-collapse: collapse;
  }
  table thead th {
    background-color: #014e89;
  }
  table tbody tr td {
    font-size: 0.875rem;
    font-family: 'Lora', 'Lato', sans-serif;
  }
  tbody tr td:first-child {
    padding: 0 10px;
    height: 75px;
  }

  tr {
    border-bottom: 1px solid rgb(199, 198, 198);
    border-top: 1px solid rgb(199, 198, 198);
    border-collapse: collapse;
  }
  tr:nth-child(even) {
    background-color: rgb(255, 255, 255);
  }
</style>
