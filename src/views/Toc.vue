<template>
  <div class="toc container">
    <div v-if="rawData">
      <div class="columns">
        <div class="column col-12">
          <options></options>
        </div>
        <div class="column col-6">
          <render></render>
        </div>
        <div class="column col-6">
          <html-source></html-source>
        </div>
      </div>
    </div>
    <div v-else>
      No data. Please go to <router-link to="/">Data</router-link>
    </div>
  </div>
</template>

<script>
import Render from '../components/Render'
import HtmlSource from '../components/Source'
import Options from '../components/Options'
export default {
  name: 'Toc',
  components: { Options, HtmlSource, Render },
  computed: {
    rawData () {
      return this.$store.state.rawData
    }
  }
}
</script>

<style scoped>

</style>
