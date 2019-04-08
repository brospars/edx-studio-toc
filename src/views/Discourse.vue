<template>
  <div class="discourse container">
    <div v-if="plan">
      <div class="columns">
        <div class="column col-12">
          <discourse-options></discourse-options>
        </div>
        <div class="column col-12">
          <div class="card" v-if="existingCategories.length">
            <div class="card-body">
              <table class="table table-striped">
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>parent_id</th>
                  <th>actions</th>
                </tr>
                <tr v-for="(category, index) in existingCategories" :key="index">
                  <td>{{category.id}}</td>
                  <td>{{category.name}}</td>
                  <td>{{category.parent_category_id}}</td>
                  <td><button class="btn btn-sm" v-on:click="deleteCategory(category.id)">Delete</button></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="column col-12">
          <button class="btn btn-primary" :disabled="!$store.state.discourseUrl || !$store.state.discourseUsername || !$store.state.discourseToken" v-on:click="fetchCategories()">
            Fetch existing categories
          </button>&nbsp;
          <button class="btn btn-primary" :disabled="!$store.state.discourseUrl || !$store.state.discourseUsername || !$store.state.discourseToken" v-on:click="createCategories()">
            Create {{plan.length}} categories and {{subcategoryCount}} subcategories
          </button>
        </div>
        <div class="column col-12">
          <div class="log" v-for="(log, index) in logs" :key="index"  :class="'text-' + log.type">{{log.message}}</div>
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
      logs: [],
      existingCategories: []
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
    fetchCategories () {
      this.$http.get(this.$store.state.discourseUrl + 'site.json?api_username=' + this.$store.state.discourseUsername + '&api_key=' + this.$store.state.discourseToken).then(response => {
        if (response.body.categories) {
          this.existingCategories = response.body.categories
        }
      }, response => {
        alert('Error while fetching categories, please check discourse options')
      })
    },
    deleteCategory (categoryId) {
      this.$http.delete(this.$store.state.discourseUrl + 'categories/' + categoryId + '?api_username=' + this.$store.state.discourseUsername + '&api_key=' + this.$store.state.discourseToken).then(response => {
        this.fetchCategories()
      }, response => {
        alert('Error deleting category (category is not empty or doesn\'t exist)')
      })
    },
    createCategories () {
      this.logs = []
      this.plan.forEach((section) => {
        let categoryColor = this.randomColor()
        this.$http.post(this.$store.state.discourseUrl + 'categories.json', this.getFormData({
          api_username: this.$store.state.discourseUsername,
          api_key: this.$store.state.discourseToken,
          name: section.title.substring(0, 50),
          color: categoryColor,
          text_color: 'ffffff'
        })).then(response => {
          console.log(response.body.category.id)
          let category = response.body.category
          this.log('Create category ' + category.id + ': ' + section.title, 'success')

          section.subsections.forEach((subsection) => {
            this.$http.post(this.$store.state.discourseUrl + 'categories.json', this.getFormData({
              api_username: this.$store.state.discourseUsername,
              api_key: this.$store.state.discourseToken,
              name: subsection.title.substring(0, 50),
              color: categoryColor,
              text_color: 'ffffff',
              parent_category_id: category.id
            })).then(response => {
              console.log(response.body.category.id)
              let subcategory = response.body.category
              this.log('__ Create subcategory ' + subcategory.id + ': ' + subsection.title, 'success')
            }, response => {
              this.log('Error : ' + response.body.errors.reduce((acc, elem) => acc + elem, ''), 'error')
            })
          })
        }, response => {
          this.log('Error : ' + response.body.errors.reduce((acc, elem) => acc + elem, ''), 'error')
        })
      })
    },
    log (message, type) {
      this.logs.push({ message, type })
    },
    randomColor () {
      let letters = '0123456789ABCDEF'
      let color = ''
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    },
    getFormData (object) {
      const formData = new FormData()
      Object.keys(object).forEach(key => formData.append(key, object[key]))
      return formData
    }
  }
}
</script>

<style scoped>
  .log{
    font-size: 0.8em;
    font-family: Courier, monospace;
  }
</style>
