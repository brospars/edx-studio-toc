<template>
  <div id="app">
    <div class="nav container">
      <ul class="tab">
        <li class="tab-item" :class="$route.name === 'home' ? 'active':''">
          <router-link to="/">Data</router-link>
        </li>
        <li class="tab-item" :class="$route.name === 'toc' ? 'active':''">
          <router-link to="/toc">Table of Content</router-link>
        </li>
        <li class="tab-item" :class="$route.name === 'discourse' ? 'active':''">
          <router-link to="/discourse">Discourse</router-link>
        </li>
      </ul>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
  body{
    background-color: #f5f7fb!important;
  }

  #app{
    .card-data{
      margin-bottom: .4rem;
    }
    .container{
      padding: 1rem;
    }

    .columns {
      margin-left: -.2rem;
      margin-right: -.2rem;
    }

    .column{
      padding-right: .2rem;
      padding-left: .2rem;
      margin-bottom: .4rem;
    }

    textarea{
      min-width: 100%;
      max-width: 100%;
    }
  }
</style>
