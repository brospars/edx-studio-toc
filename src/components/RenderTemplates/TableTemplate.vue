<template>
  <div ref="render" class="plan">
    <div v-for="section in plan" class="section">
      <h2>{{section.title}}</h2>
      <table v-if="section.subsections.length > 0 && depth >= 2">
        <tbody>
        <tr>
          <th>Sequences</th>
          <th v-if="depth >= 3">Units</th>
        </tr>
        <tr v-for="subsection in section.subsections">
          <td><h3>{{subsection.title}}</h3></td>
          <td v-if="subsection.units.length > 0 && depth >= 3">
            <ul>
              <li v-for="unit in subsection.units">
                <a :href="buildUrl(unit.locator)">{{unit.title}}</a>
              </li>
            </ul>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableTemplate',
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
  updated () {
    this.$store.commit('updateSource', this.$refs.render.outerHTML)
  }
}
</script>

<style lang="scss">
  .plan{
    table{
      text-align: left;
      vertical-align: top;
    }
    h2{
      margin-bottom: 15px;
      font-size: 19px;
      font-weight: bold;
      line-height: 1.4em;
      text-transform: uppercase;
      color: #646464;
    }

    h3{
      margin-bottom: 10px;
      font-size: 17px;
      font-weight: 600;
      line-height: 1.4em;
      text-transform: uppercase;
      color: #3c3c3c;
    }
  }
</style>
