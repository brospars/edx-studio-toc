<template>
  <ul ref="render">
    <li v-for="section in plan" :key="section.id">
      <a :href="buildUrl(section.locator)">{{section.title}}</a>
      <ul v-if="section.subsections.length > 0 && depth >= 2">
        <li v-for="subsection in section.subsections" :key="subsection.id">
          <a :href="buildUrl(subsection.locator)">{{subsection.title}}</a>
          <ul v-if="subsection.units.length > 0 && depth >= 3">
            <li v-for="unit in subsection.units" :key="unit.id">
              <a :href="buildUrl(unit.locator)">{{unit.title}}</a>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ListTemplate',
  computed: {
    depth () {
      return this.$store.state.depth
    },
    baseUrl () {
      return this.$store.state.baseUrl
    },
    plan () {
      return this.$store.state.plan
    }
  },
  methods: {
    buildUrl (locator) {
      return this.baseUrl + locator
    }
  },
  mounted () {
    this.$store.commit('updateSource', this.$refs.render.outerHTML)
  },
  updated () {
    this.$store.commit('updateSource', this.$refs.render.outerHTML)
  }
}
</script>
