<template>
  <div class="discourse container">
    <div v-if="plan">
      <div class="columns">
        <div class="column col-12">
          <discourse-options></discourse-options>
        </div>
        <div class="column col-12">
          <button class="btn btn-primary" :disabled="!$store.state.discourseUrl || !$store.state.discourseUsername || !$store.state.discourseToken" v-on:click="createCategories()">
            Create {{plan.length}} categories and {{subcategoryCount}} subcategories
          </button>
        </div>
        <div class="column col-12">
          {{output}}
        </div>
      </div>
    </div>
    <div v-else>
      No data. Please go to <router-link to="/">Data</router-link>
    </div>
  </div>
</template>

<script>
import DiscourseOptions from '../components/DiscourseOptions'
export default {
  name: 'Discourse',
  components: { DiscourseOptions },
  data () {
    return {
      output: ''
    }
  },
  computed: {
    plan () {
      return this.$store.state.plan
    },
    subcategoryCount () {
      return this.$store.state.plan.reduce((cpt, element) => {
        return cpt + element.subsections.length
      }, 0)
    }
  },
  methods: {
    createCategories () {
      this.plan.forEach((element) => {
        console.log(element.title)
      })
    },
    postCategory (data, cb) {
      this.$http.get('/someUrl').then(response => {
        // get body data
        this.someData = response.body
      }, response => {
        // error callback
      })
    }
  }
}
</script>

<style scoped>

</style>
