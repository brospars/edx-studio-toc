<template>
  <div ref="render" class="plan">
    <div v-for="section in plan" class="section">
      <h2>{{section.title}}</h2>
      <table style="background: #f5f5f5;" v-if="section.subsections.length > 0 && depth >= 2">
        <tbody>
        <tr>
          <th style="width:50%"><h2>Sequences</h2></th>
          <th style="width:50%" v-if="depth >= 3"><h2>Units</h2></th>
        </tr>
        <tr v-for="subsection in section.subsections">
          <td><p style="font-size: 1.2em;">{{subsection.title}}</p></td>
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
    h2{
      color: #646464;
      font: normal 1.2em/1.2em "Open Sans",Verdana,Geneva,sans-serif,sans-serif;
      letter-spacing: 1px;
      margin-bottom: 15px;
      text-transform: uppercase;
      -webkit-font-smoothing: antialiased;
    }

    table{
      width: 100%;
      margin: 20px 0;
      border-collapse: collapse;
      border-spacing: 0;
      font-size: 16px;
      text-align: left;
      font-family: "Open Sans",Verdana,Geneva,sans-serif,sans-serif;
      vertical-align: top;

      th{
        background: #eee;
        margin: 20px 0;
        padding: 10px;
        border: 1px solid #c8c8c8;
        font-size: 14px;

        h2{
          color: #646464;
          font: normal 1.2em/1.2em "Open Sans",Verdana,Geneva,sans-serif,sans-serif;
          letter-spacing: 1px;
          margin-bottom: 15px;
          text-transform: uppercase;
          -webkit-font-smoothing: antialiased;
        }
      }

      td{
        margin: 20px 0;
        padding: 10px;
        border: 1px solid #c8c8c8;
        font-size: 14px;
      }
    }

    a, a:hover, a:visited{
      color: #0078b0;
      text-decoration: none;
    }
  }
</style>
