<template>
  <div class="home container">
    <div class="card card-data">
      <div class="card-body">
        <form class="form-horizontal">
          <div class="form-group">
            <div class="col-3 col-sm-12">
              <label class="form-label" for="rawData">Raw data</label>
            </div>
            <div class="col-9 col-sm-12">
              <input class="form-input" id="rawData" type="text" placeholder="Paste raw data here" v-model="rawData">
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  mounted () {
    let urlParams = new URLSearchParams(window.location.search)
    let baseUrl = urlParams.get('baseUrl')

    this.$store.commit('updateBaseUrl', baseUrl)
  },
  computed: {
    rawData: {
      get () {
        return this.$store.state.rawData
      },
      set (value) {
        this.$store.commit('updateRawData', value)

        try {
          this.$store.commit('updatePlan', JSON.parse(value))
          this.$router.push({ path: 'toc' })
        } catch (e) {
          console.log('invalid json')
        }
      }
    }
  }
}
</script>
