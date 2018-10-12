<template>
  <div class="home container">
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
</template>

<script>
import Render from '../components/Render'
import HtmlSource from '../components/Source'
import Options from '../components/Options'
export default {
  name: 'home',
  components: { Options, HtmlSource, Render },
  mounted () {
    let urlParams = new URLSearchParams(window.location.search)
    let baseUrl = urlParams.get('baseUrl')
    let plan = JSON.parse(urlParams.get('plan'))

    if (!plan) {
      alert('Error parsing plan')
    } else {
      this.$store.commit('updateBaseUrl', baseUrl)
      this.$store.commit('updatePlan', plan)
    }
  }
}
</script>
