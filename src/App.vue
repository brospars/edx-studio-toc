<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  body{
    background-color: #f5f7fb!important;
  }

  #app{
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
