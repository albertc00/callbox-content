<script>
  import BlogTable from './Blog/BlogTable.svelte';
  import ButtonLink from './Functions/ButtonLink.svelte';
  import { fieldID } from './store';

  function onClick(value) {
    $fieldID = value;
  }
  import ViewResult from './ViewResult.svelte';
  // import Modal, { bind } from './modal/index.js';
  // import { writable } from 'svelte/store';
  // const modalss = writable(null);
  // const showModaall = () => modalss.set(bind(ViewResult));
  export let data;

  export let colDef;
</script>

<div class="table-wrapper">
  <!-- {#each tableData as { posts, id } (id)} -->
  <table>
    <thead>
      <tr>
        {#each colDef as { title, headerComponent, hidden }, i}
          <th>
            <svelte:component this={headerComponent} text={title} />
          </th>
        {/each}
      </tr>
    </thead>
    {#each data as { posts }}
      <tbody>
        {#each posts as row}
          <tr>
            {#each colDef as { cellComponent, args }, i}
              <td>
                <svelte:component this={cellComponent} post={row} {...args} />
              </td>
            {/each}
          </tr>
        {/each}
        <!-- {:else if colsID == 'product'}
                  <td class="table-td" class:btn-repo={tableheader.length >= 4}
                    >{post.product}
                  </td>
                {:else if colsID == 'campaign'}
                  <td class="table-td" class:btn-repo={tableheader.length >= 4}>
                    {#each post.campaign as { label }}
                      <span>{label}</span><br />
                    {/each}
                  </td>
                {:else if colsID == 'link'}
                  <td class="table-td" class:btn-repo={tableheader.length >= 4}
                    ><a class="cs_linkunlock" href={post.link} target="_blank"
                      >See Webpage</a
                    ></td
                  >
                {:else if colsID == 'linkUnlocked'}
                  <td class="table-td" class:btn-repo={tableheader.length >= 4}
                    ><div class="link-unlock">
                      <a
                        class="cs_linkunlock"
                        href={post.linkUnlocked}
                        target="_blank"
                        >See full version
                      </a>
                    </div>
                  </td>
                {:else if colsID == 'pdf'}
                  <td class="table-td" class:btn-repo={tableheader.length >= 4}
                    ><a class="cs_linkunlock" href={post.pdf} target="_blank"
                      >See PDF</a
                    ></td
                  >
                {:else if colsID == 'clientHQ'}
                  <td class="table-td" class:btn-repo={tableheader.length >= 4}
                    >{post.clientHQ}</td
                  >
                {:else if colsID == 'target-location'}
                  <td class="table-td" class:btn-repo={tableheader.length >= 4}
                    >{post.targetLocation}</td
                  >
                {:else if colsID == 'target-industry'}
                  <td class="table-ind" class:btn-repo={tableheader.length >= 4}
                    >{post.targetIndustry}</td
                  >
                {:else if colsID == 'target-dm'}
                  <td class="table-dm" class:btn-repo={tableheader.length >= 4}
                    >{post.targetDM}</td
                  >
                {:else if colsID == 'results'}
                  <td
                    class="table-res"
                    class:btn-repo={tableheader.length >= 4}
                  >
                    {#each post.results as { label }, index}
                      <span
                        >{index == post.results.length - 1
                          ? label
                          : `${label}, `}</span
                      >
                    {/each}</td
                  > 
                {/if}-->
      </tbody>
    {/each}
  </table>
  <!-- {/each} -->
</div>

<style>
  .hide {
    display: none;

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
    left: 0;
  }
  .hide.btn-repo {
    display: none;
    position: absolute;
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
    left: 0;
  }
  .hide:hover {
    text-decoration: none;
    background-color: #014e89;
    color: #fff;
  }

  .hide.btn-repo:hover {
    text-decoration: none;
    background-color: #014e89;
    color: #fff;
  }
  .table-td {
    text-align: center;
  }
  .table-ind,
  .table-dm,
  .table-res {
    text-align: left;
  }

  /* .table-title:hover {
    position: absolute;
    height: 75px;
  } */

  tr:hover .hide {
    display: inline-block;
  }
  tr:hover .hide.btn-repo {
    display: block;
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
  .cs_linkunlock {
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
  .link-unlock {
    text-align: center;
  }
  .cs_linkunlock:hover {
    text-decoration: none;
    background-color: #014e89;
    color: #fff;
  }
  .tableScrolled table thead {
    position: sticky;
    top: -1px;
    left: 0;
    z-index: 999;
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

  td.btn-repo {
    height: 125px;
  }
  tr {
    border-bottom: 1px solid rgb(199, 198, 198);
    border-top: 1px solid rgb(199, 198, 198);
    border-collapse: collapse;
  }
  tr:nth-child(even) {
    background-color: rgb(255, 255, 255);
  }
  tbody tr:hover td button:not(.btn-repo) {
    position: absolute;
    left: unset !important;
    top: 15%;
  }
  table,
  tr,
  td {
    height: 100%;
  }
</style>
