<template>
    <div class="options">
        <div class="card">
            <div class="card-body">
                <form class="form-horizontal">
                    <div class="form-group">
                        <div class="col-3 col-sm-12">
                            <label class="form-label" for="baseURL">Base URL</label>
                        </div>
                        <div class="col-9 col-sm-12">
                            <input class="form-input" id="baseURL" type="text" placeholder="https://fun-mooc.fr/courses/course-v1:XXXXXXXX+session01/jump_to_id/" v-model="baseUrl">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-3 col-sm-12">
                            <label class="form-label" for="cssText">CSS</label>
                        </div>
                        <div class="col-9 col-sm-12">
                            <textarea id="cssText" class="form-input" placeholder=".class{ // style }"></textarea>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-3 col-sm-12">
                            <label class="form-label" for="cssFile">CSS File</label>
                        </div>
                        <div class="col-9 col-sm-12">
                            <input class="form-input" id="cssFile" type="file">
                        </div>
                    </div>
                    <div class="form-group">
                      <div class="col-3 col-sm-12">
                        <label class="form-label">Depth</label>
                      </div>
                      <div class="col-9 col-sm-12">
                        <label class="form-radio form-inline">
                          <input type="radio" value="1" v-model="depth"><i class="form-icon"></i> Sections
                        </label>
                        <label class="form-radio form-inline">
                          <input type="radio" value="2" v-model="depth"><i class="form-icon"></i> Subsections
                        </label>
                        <label class="form-radio form-inline">
                          <input type="radio" value="3" v-model="depth"><i class="form-icon"></i> Units
                        </label>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-3 col-sm-12">
                        <label class="form-label">Template</label>
                      </div>
                      <div class="col-9 col-sm-12">
                        <label class="form-radio form-inline">
                          <input type="radio" value="table" v-model="template"><i class="form-icon"></i> Table
                        </label>
                        <label class="form-radio form-inline">
                          <input type="radio" value="list" v-model="template"><i class="form-icon"></i> List
                        </label>
                      </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Options',
  computed: {
    baseUrl: {
      get () {
        return this.$store.state.baseUrl
      },
      set (value) {
        this.$store.commit('updateBaseUrl', value)
      }
    },
    depth: {
      get () {
        return this.$store.state.depth
      },
      set (value) {
        this.$store.commit('updateDepth', value)
      }
    },
    template: {
      get () {
        return this.$store.state.template
      },
      set (value) {
        this.$store.commit('updateTemplate', value)
      }
    }
  }
}
</script>

<style scoped>

</style>
