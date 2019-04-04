<template>
  <div class="discourse-options">
    <div class="card">
      <div class="card-body">
        <form class="form-horizontal">
          <div class="form-group">
            <div class="col-3 col-sm-12">
              <label class="form-label" for="discourseURL">Discourse URL</label>
            </div>
            <div class="col-9 col-sm-12">
              <input class="form-input" id="discourseURL" type="text" placeholder="https://discourse.com/" v-model="discourseUrl">
            </div>
          </div>
          <div class="form-group">
            <div class="col-3 col-sm-12">
              <label class="form-label" for="discourseUsername">Discourse Username</label>
            </div>
            <div class="col-9 col-sm-12">
              <input class="form-input" id="discourseUsername" type="text" placeholder="foobar" v-model="discourseUsername">
            </div>
          </div>
          <div class="form-group">
            <div class="col-3 col-sm-12">
              <label class="form-label" for="discourseToken">Discourse API token</label>
            </div>
            <div class="col-9 col-sm-12">
              <input class="form-input" id="discourseToken" type="text" placeholder="5aef54e5a4f4e5a444e5feaf54a54e5f43e1af1" v-model="discourseToken">
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DiscourseOptions',
  computed: {
    discourseUrl: {
      get () {
        return this.$store.state.discourseUrl
      },
      set (value) {
        this.$store.commit('updateDiscourseUrl', value)
      }
    },
    discourseUsername: {
      get () {
        return this.$store.state.discourseUsername
      },
      set (value) {
        this.$store.commit('updateDiscourseUsername', value)
      }
    },
    discourseToken: {
      get () {
        return this.$store.state.discourseToken
      },
      set (value) {
        this.$store.commit('updateDiscourseToken', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
