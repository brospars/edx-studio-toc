<template>
    <div class="render">
        <div class="card">
            <div class="card-body">
              <div id="render">
                <table-template v-if="template === 'table'"></table-template>
                <list-template v-if="template === 'list'"></list-template>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import ListTemplate from './RenderTemplates/ListTemplate'
import TableTemplate from './RenderTemplates/TableTemplate'
export default {
  name: 'Render',
  components: { TableTemplate, ListTemplate },
  computed: {
    template () {
      return this.$store.state.template
    }
  }
}
</script>
