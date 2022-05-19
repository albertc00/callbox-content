<script>
  import { fieldID } from './store';

  export let tableheaderData = [
    {
      id: 'hello',
      label: 'dolorem',
    },
    {
      id: 'world',
      label: 'amet',
    },
  ];
  export let tableheader = ['nani', 'nandato'];

  export let tableData = [
    {
      n: 3,
      id: 'client-location',
      label: 'Client Location/HQ',
      icon: 'location_on',
      posts: [
        {
          id: 74422,
          link: 'https://www.callboxinc.com/case-studies/insurance-tech-innovator-claimed-insurance-made-easy-all-over-the-us/',
          title:
            'Insurance Tech Innovator Claimed “Insurance Made Easy” All over the US',
          excerpt:
            'The Client is a global leader in insurance technology, serving hundreds of carriers and agents, brokers, and other industry players in more than 30 countries.',
          image:
            'https://www.callboxinc.com/wp-content/uploads/2022/04/CS_SW_Insurance-Tech-Innovator-Claimed-Insurance-Made-Easy-All-over-the-US-img-768x432.webp',
          clientLocation: 'USA',
          product: 'Software',
          campaign: [
            {
              value: '0',
              label: 'Lead Generation',
            },
            {
              value: '1',
              label: 'Appointment Setting',
            },
          ],
          linkUnlocked:
            'https://www.callboxinc.com/case-studies/insurance-tech-innovator-claimed-insurance-made-easy-all-over-the-us/?user=benb',
          pdf: 'https://www.callboxinc.com/external/casestudies/CS_SW_Insurance-Tech-Innovator-Claimed-Insurance-Made-Easy-All-over-the-US.pdf',
          clientHQ: 'Shanghai, China',
          targetLocation: 'All over US',
          targetIndustry: 'Property Casualty Insurance',
          targetDM:
            'CIO, CTO, Product Manager, Claims Manager, Lead Technical Architect, Digital Officer, Underwriting Manager, Chief Operating Officer',
          results: [
            {
              label: 'Sales Qualified Leads',
              value: '88',
            },
            {
              label: 'Marketing Qualified Leads',
              value: '68',
            },
            {
              label: 'Profiled Contacts',
              value: '651',
            },
            {
              label: 'Social Media Connections',
              value: '1485',
            },
          ],
        },
      ],
      total: 7,
      hasMore: true,
    },
    {
      n: 4,
      id: 'target-location',
      label: 'Target Location',
      icon: 'location_on',
      posts: [
        {
          id: 68153,
          link: 'https://www.callboxinc.com/case-studies/top-telco-found-new-iot-partners-using-callbox-account-based-marketing/',
          title:
            'Global Telco Widens APAC Market with Callbox Lead Generation Campaign',
          excerpt:
            'The Client is a leading telecommunications provider, offering the latest voice and data solutions to multinational enterprises and communication service providers, with a global coverage combined with local, on the ground knowledge that builds best in class connections across the globe.',
          image:
            'https://www.callboxinc.com/wp-content/uploads/2022/03/CS_IT_Global-Telco-Widens-APAC-Market-with-Callbox-Lead-Generation-Campaign-768x432.webp',
          clientLocation: 'Singapore',
          product: 'IT',
          campaign: [
            {
              value: '0',
              label: 'Lead Generation',
            },
            {
              value: '1',
              label: 'Appointment Setting',
            },
          ],
          linkUnlocked:
            'https://www.callboxinc.com/case-studies/top-telco-found-new-iot-partners-using-callbox-account-based-marketing/?user=benb',
          pdf: 'https://www.callboxinc.com/external/casestudies/CS_IT_Global-Telco-Widens-APAC-Market-with-Callbox-Lead-Generation-Campaign.pdf',
          clientHQ: 'Hong Kong',
          targetLocation:
            'China, Hong Kong, Japan, Singapore, South Korea, Taiwan, Australia, Indonesia, Thailand, Vietnam, India',
          targetIndustry: 'Any (Employee Size: 20 up, Annual Rev: USD20M$ up)',
          targetDM:
            'CEO, CCO, CMO, IoT Business Unit Heads, Partnership Managers, Marketing Managers, VP of Marketing, Product Managers, VP of Products, Sales Managers, VP of Sales, Practice Managers, Senior Consultants, Project Managers, CTO, Internet of Things Experts/Managers, Information Technology Experts/Managers, CFO, Finance Manager',
          results: [
            {
              label: 'Sales Qualified Leads',
              value: '72',
            },
            {
              label: 'Marketing Qualified Leads',
              value: '155',
            },
            {
              label: 'Social Media Connections',
              value: '1192',
            },
          ],
        },
      ],
      total: 2,
      hasMore: true,
    },
    {
      n: 7,
      id: 'content',
      label: 'Others',
      icon: 'text_snippet',
      posts: [
        {
          id: 73678,
          link: 'https://www.callboxinc.com/case-studies/ict-lead-caps-app-upgrade-for-channel-partner-with-callbox-abm/',
          title:
            'ICT Lead Caps App Upgrade for Channel Partner with Callbox ABM',
          excerpt:
            'The Client is a leading ICT products and services provider in the APAC region with a network of more than 40,000 active channel partners.',
          image:
            'https://www.callboxinc.com/wp-content/uploads/2022/02/CS_IT_ICT-Lead-Caps-App-Upgrade-for-Channel-Partner-with-Callbox-ABM-img-768x432.webp',
          clientLocation: 'Singapore',
          product: 'IT / Software',
          campaign: [
            {
              value: '0',
              label: 'Lead Generation',
            },
            {
              value: '1',
              label: 'Appointment Setting',
            },
          ],
          linkUnlocked:
            'https://www.callboxinc.com/case-studies/ict-lead-caps-app-upgrade-for-channel-partner-with-callbox-abm/?user=benb',
          pdf: 'https://www.callboxinc.com/external/casestudies/CS_IT_ICT-Lead-Caps-App-Upgrade-for-Channel-Partner-with-Callbox-ABM.pdf',
          clientHQ: 'Singapore',
          targetLocation: 'Philippines',
          targetIndustry: 'All, small to medium (except competitors)',
          targetDM:
            'IT Director/Manager, Owner, General Manager, Managing Director',
          results: [
            {
              label: 'Marketing-Qualified Leads',
              value: '200',
            },
            {
              label: 'Social Media Connections',
              value: '263',
            },
          ],
        },
      ],
      total: 4,
      hasMore: true,
    },
  ];

  function onClick(value) {
    $fieldID = value;
    //$viewfield = true;
    // $isSearching = false;
  }
  import ViewResult from './ViewResult.svelte';
  import Modal, { bind } from './modal/index.js';
  import { writable } from 'svelte/store';
  const modalss = writable(null);
  const showModaall = () => modalss.set(bind(ViewResult));

  console.log($fieldID);
</script>

<div class="table-wrapper">
  {#each tableData as { posts, id } (id)}
    <table>
      <thead>
        <tr>
          {#each tableheaderData as { id, label } (id)}
            {#each tableheader as colsID}
              {#if colsID == id}
                <th>{label}</th>
              {/if}
            {/each}
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each posts as post}
          <tr>
            <!-- on:click={() => onClick(post.id)}  -->

            {#each tableheader as colsID}
              {#if colsID == 'title'}
                <td class="table-title"
                  >{post.title}
                  <button
                    class="hide"
                    class:btn-repo={tableheader.length >= 4}
                    on:click={() => onClick(post.id)}
                  >
                    Preview
                  </button>
                </td>
              {:else if colsID == 'client-location'}
                <td class="table-td" class:btn-repo={tableheader.length >= 4}
                  >{post.clientLocation}</td
                >
              {:else if colsID == 'product'}
                <td class="table-td" class:btn-repo={tableheader.length >= 4}
                  >{post.product}</td
                >
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
                <td class="table-res" class:btn-repo={tableheader.length >= 4}>
                  {#each post.results as { label }, index}
                    <span
                      >{index == post.results.length - 1
                        ? label
                        : `${label}, `}</span
                    >
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
</style>
