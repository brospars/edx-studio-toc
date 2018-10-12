<template>
    <div class="source">
        <div class="card">
            <div class="card-body">
                <form>
                    <div class="form-group">
                      <label class="form-label" for="sourceCode">Source code</label>
                      <textarea id="sourceCode" class="form-input" v-model="source" readonly></textarea>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Source',
  computed: {
    source: {
      get () {
        return this.$store.state.source
      },
      set (value) {
        this.$store.commit('updateSource', value)
      }
    }
  }
}
</script>

<style scoped>
    textarea{
        min-height: 300px;
    }
</style>
