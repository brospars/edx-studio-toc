import Vue from 'vue'
import Vuex from 'vuex'
import beautify from 'js-beautify/js/lib/beautify-html'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: '',
    rawData: null,
    plan: [],
    source: '',
    depth: 3,
    template: 'table'
  },
  mutations: {
    updateBaseUrl (state, baseUrl) {
      Vue.set(state, 'baseUrl', baseUrl)
    },
    updateRawData (state, data) {
      Vue.set(state, 'rawData', data)
    },
    updatePlan (state, plan) {
      Vue.set(state, 'plan', plan)
    },
    updateSource (state, source) {
      Vue.set(state, 'source', beautify.html_beautify(source))
    },
    updateDepth (state, depth) {
      Vue.set(state, 'depth', depth)
    },
    updateTemplate (state, template) {
      Vue.set(state, 'template', template)
    }
  },
  actions: {

  }
})
