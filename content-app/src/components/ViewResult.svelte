<script>
  import ViewResultLoading from './ViewResultLoading.svelte';
  import { fieldID, SearchTerm, fields, pages } from './store.js';
  import { Query } from '@sveltestack/svelte-query';

  $: s = $SearchTerm.toLowerCase();

  $: field = $fields;
  const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;
  async function fetchPosts({ s, field }) {
    if ($SearchTerm.length == 0) {
      const res = await fetch(
        `${url}?s=tech&page=${$pages}&per_page=10&fields=5`
      );

      const data = await res.json();

      return data;
    } else if ($fields.length == 0) {
      const res = await fetch(
        `${url}?s=${s}&page=${$pages}&per_page=10&fields=7`
      );

      const data = await res.json();

      return data;
    } else {
      const res = await fetch(
        `${url}?s=${s}&page=${$pages}&per_page=10&fields=${field}`
      );

      const data = await res.json();

      return data;
    }
  }

  $: queryOptions = {
    queryKey: ['seeMore', s, field],
    queryFn: () => fetchPosts({ s, field }),
    enabled: $SearchTerm !== '' || $SearchTerm === '',
    keepPreviousData: true,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  };
</script>

<!-- <SearchFormClose /> -->
<div class="wrapper">
  <Query options={queryOptions}>
    <div slot="query" let:queryResult={{ data, isFetching, isError }}>
      <div class="results svelte-fhxlyi">
        {#if isFetching}
          <ViewResultLoading />
        {:else if isError}
          <span>Error</span>
        {:else}
          {#each data as { posts, id } (id)}
            {#each posts as post}
              {#if post.id == $fieldID}
                <div class="cs-hero">
                  <div class="client-success-story">client success story</div>
                </div>
                <div class="container">
                  <div class="case-study-outer">
                    <article class="post">
                      <section class="cs-entry">
                        <div>
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            width="800px"
                            height="450px"
                            sizes="(max-width: 800px) 100vw, 800px"
                          />
                        </div>
                        <div class="entry-outer">
                          <header>
                            <h1 class="cs-title">{post.title}</h1>
                          </header>
                          <footer>
                            <!-- <a class="pdf-button" href={post.pdf}
                              >DOWNLOAD PDF</a
                            > -->
                          </footer>
                        </div>
                      </section>
                      <div class="cs-results">
                        {#each post.results as result}
                          <div class="cs-result">
                            <div class="cs-result-value">{result.value}</div>
                            <div class="cs-result-label">{result.label}</div>
                          </div>
                        {/each}
                      </div>
                      <div class="cs-campaign">
                        <div class="cs-specs">
                          <div>
                            <span class="fa fa-briefcase" />
                            <div class="cs-specs-label">Industry</div>
                            <div class="cs-specs-post">{post.product}</div>
                          </div>
                          <div>
                            <span class="fa fa-map-marker-alt" />
                            <div class="cs-specs-label">Location</div>
                            <div class="cs-specs-post">
                              {post.clientLocation}
                            </div>
                          </div>
                          <div>
                            <span class="fa fa-building" />
                            <div class="cs-specs-label">Headquarters</div>
                            <div class="cs-specs-post">{post.clientHQ}</div>
                          </div>
                          <div>
                            <span class="fa fa-chart-line" />
                            <div class="cs-specs-label">Campaign Type</div>
                            {#each post.campaign as campaign}
                              <div>
                                <div class="cs-specs-post">
                                  {campaign.label}
                                </div>
                              </div>
                            {/each}
                          </div>
                          <div>
                            <span class="fa fa-map-marker-alt" />
                            <div class="cs-specs-label">Target Location</div>
                            <div class="cs-specs-post">
                              {post.targetLocation}
                            </div>
                          </div>
                          <div>
                            <span class="fa fa-briefcase" />
                            <div class="cs-specs-label">Target Industries</div>
                            <div class="cs-specs-post">
                              {post.targetIndustry}
                            </div>
                          </div>
                          <div>
                            <span class="fa fa-user" />
                            <div class="cs-specs-label">Target Contacts</div>
                            <div class="cs-specs-post">
                              {post.targetDM}
                            </div>
                          </div>
                        </div>
                        <div class="cs-content">
                          <div>
                            <h2>The Client</h2>
                            <p>
                              The Client is a global leader in insurance
                              technology, serving hundreds of carriers and
                              agents, brokers, and other industry players in
                              more than 30 countries.
                            </p>
                            <p>
                              <strong>Lines of Business</strong><br /> PaaS
                              (Platform as a Service)<br /> SaaS (Software as a Service)
                            </p>
                            <h2>The Challenge</h2>
                            <p>
                              The Client has been dedicated to insurtech
                              innovation since its founding in 2000, and
                              consecutively developed insurance platforms in the
                              succeeding years: the world’s first browser/server
                              based insurance core system suite, leading the
                              advent and adoption of Java-based 3G insurance IT,
                              and a cloud-native and microservices-based 4G
                              insurance platform that provides a complete set of
                              insurance APIs across an insurance policy’s full
                              lifecycle.
                            </p>
                            <p>
                              In this campaign, the Client wanted to address the
                              challenges that the property casualty insurance
                              market is facing through its cloud-based solution
                              that enables digital insurance and enterprise
                              level core system insurance software.
                            </p>
                          </div>
                        </div>
                      </div>
                      <!-- <div class="btn-btm">
                        <a class="pdf-button" href={post.pdf}>DOWNLOAD PDF</a>
                      </div> -->
                    </article>
                  </div>
                </div>
              {/if}
            {/each}
          {/each}
        {/if}
      </div>
    </div>
  </Query>
</div>

<style>
  h2 {
    font-family: 'Work Sans', work-sans, sans-serif;
    font-weight: 700;
    margin: 0;
    padding: 0;
    color: #014e89;
  }
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  .cs-content {
    display: grid;
    row-gap: 3rem;
  }
  .cs-campaign {
    display: grid;
    row-gap: 3rem;
  }
  .cs-specs-label {
    font-family: 'Work Sans', work-sans, sans-serif;
    font-weight: 700;
    color: #5f7380;
    margin: 0.25rem 0;
  }
  .cs-specs-post {
    font-size: 0.975rem;
    line-height: 1.5rem;
    font-family: 'Lato', sans-serif;
    font-weight: 400;
    color: #5f7380;
  }
  .cs-highlights {
    padding: 1.5rem;
    border: 1px solid #f76823;
    border-radius: 0.875rem;
    width: auto;
    margin-left: 0;
    background-color: rgba(247, 104, 35, 0.07);
  }
  .cs-specs {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    display: grid;

    gap: 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .entry-outer {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  .cs-title {
    color: #014e89;
    font-size: 1.875rem;
    line-height: 2.25rem;
    margin: 0 0 2rem;
  }
  .btn-btm {
    text-align: center;
  }
  .pdf-button {
    display: inline-block;
    width: 100%;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-family: 'Work Sans', work-sans, sans-serif;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
    background-color: #ffca09;
    color: #014e89;
    border-radius: 0.25rem;
    box-shadow: 0px 8px 9px -6px rgb(95 115 128 / 44%);
    cursor: pointer;
    transition: all 300ms ease 0ms;
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-family: 'Work Sans', work-sans, sans-serif;
    background-color: #fa450e;
    color: #fff;
    border-color: unset;
    outline: 0;
    max-width: 150px;
  }
  .pdf-button:hover {
    color: #fff;
    text-decoration: none;
    box-shadow: 0px 13px 9px -6px rgb(95 115 128 / 44%);
    transform: translateX(0px) translateY(-5px);
  }
  .cs-results {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1.5rem;
    display: grid;
  }
  .cs-result {
    padding: 2rem;
    border: 1px solid #14b37d;
    border-radius: 0.875rem;
    color: #14b37d;
    text-align: center;
    transition: background-color 0.3s linear;
    display: grid;
    row-gap: 0.375rem;
    align-content: center;
  }
  .cs-result-label {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  .cs-result-value {
    font-size: 2.25rem;
    line-height: 2.5rem;
  }
  .cs-entry {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    display: grid;
  }
  .cs-hero {
    height: 35vh;
    padding: calc(15vh / 2 - 1.125rem) 0 0;
    letter-spacing: 0.05em;
    background-color: #063060;
  }
  .client-success-story {
    font-size: 2.25rem;
    line-height: 2.5rem;
    font-family: 'Work Sans', work-sans, sans-serif;
    font-weight: 700;
    color: #ffca09;
    text-align: center;
    text-transform: capitalize;
    letter-spacing: 0.05em;
    margin: 0;
  }
  .case-study-outer {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  .post {
    padding: 3rem;
    background-color: #fff;
    border-radius: 0.875rem;
    position: relative;
    top: -25vh;
    display: grid;
    row-gap: 3rem;
  }
  .container {
    padding-right: calc(1280px / 12);
    padding-left: calc(1280px / 12);
    background-color: #f7f7f7;
  }
</style>
