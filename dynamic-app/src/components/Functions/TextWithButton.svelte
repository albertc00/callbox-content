<script>
  import { fieldID } from '../store';
  export let post;

  function onClick(value) {
    $fieldID = value;
  }

  export let tableheader = ['nani', 'nandato'];
  export let selector = 'text';
  const text = selector.split('.').reduce((prev, curr) => prev[curr], post);
  // console.log(post);
</script>

<div class="title">
  {text}

  <button
    class="hide"
    class:btn-repo={tableheader.length >= 4}
    on:click={() => onClick(post.id)}
  >
    Preview
  </button>
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
  .title:hover .hide {
    display: inline-block;
    position: absolute;
    bottom: 5px;
  }
  .title:hover .hide.btn-repo {
    display: block;
  }
  .title {
    height: 100%;
    display: grid;
    align-items: center;
  }
</style>
