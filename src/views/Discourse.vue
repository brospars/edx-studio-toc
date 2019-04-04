<template>
  <div class="discourse container" v-if="rawData">
    <div v-if="rawData">

    </div>
    <div v-else>
      No data. Please go to <router-link to="/">Data</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Discourse',
  computed: {
    rawData () {
      return this.$store.state.rawData
    }
  }
}
</script>

<style scoped>

</style>
