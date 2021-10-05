<template>
  <div class="discourse container">
    <div v-if="plan && plan.length">
      <div class="columns">
        <div class="column col-12">
          <discourse-options></discourse-options>
        </div>
        <div class="column col-12" v-if="existingCategories.length">
          <div class="card">
            <div class="card-body">
              <table class="table">
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>color</th>
                  <th>parent</th>
                  <th>actions</th>
                </tr>
                <tr v-for="(category, index) in existingCategories" :key="index" :class="category.parent_category_id ? 'subcategory':''">
                  <td>{{category.id}}</td>
                  <td><input type="text" v-model="category.name"/></td>
                  <td>#<input type="text" v-model="category.color"/></td>
                  <td>{{category.parent_category_id}}</td>
                  <td>
                    <button class="btn btn-sm btn-success" v-on:click="updateCategory(category)">Update</button>
                    <button class="btn btn-sm btn-error" v-on:click="deleteCategory(category.id)">Delete</button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div class="column col-12">
          <button class="btn btn-primary" :disabled="!$store.state.discourseUrl || !$store.state.discourseUsername || !$store.state.discourseToken" v-on:click="fetchCategories()">
            Fetch existing categories
          </button>
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
      parentCategories: [],
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
      this.$http.get(this.$store.state.discourseUrl + 'categories.json', {
        headers: {
          'Api-Key': this.$store.state.discourseToken,
          'Api-Username': this.$store.state.discourseUsername
        }
      }).then(response => {
        if (response.body.category_list && response.body.category_list.categories) {
          this.parentCategories = response.body.category_list.categories

          this.$http.get(this.$store.state.discourseUrl + 'site.json', {
            headers: {
              'Api-Key': this.$store.state.discourseToken,
              'Api-Username': this.$store.state.discourseUsername
            }
          }).then(response => {
            if (response.body.categories) {
              this.existingCategories = this.parentCategories.reduce((categories, parentCategory) => {
                categories.push(parentCategory)
                if (parentCategory.subcategory_ids) {
                  parentCategory.subcategory_ids.forEach((subcategoryId) => {
                    categories.push(response.body.categories.find(category => category.id === subcategoryId))
                  })
                }
                return categories
              }, [])
            }
          }, response => {
            alert('Error while fetching categories, please check discourse options')
          })
        }
      }, response => {
        alert('Error while fetching categories, please check discourse options')
      })
    },
    updateCategory (category) {
      this.$http.put(this.$store.state.discourseUrl + 'categories/' + category.id, this.getFormData({
        name: category.name,
        color: category.color,
        text_color: category.text_color
      }), {
        headers: {
          'Api-Key': this.$store.state.discourseToken,
          'Api-Username': this.$store.state.discourseUsername
        }
      }).then(response => {
        this.fetchCategories()
      }, response => {
        alert('Error updating category')
      })
    },
    deleteCategory (categoryId) {
      this.$http.delete(this.$store.state.discourseUrl + 'categories/' + categoryId, null, {
        headers: {
          'Api-Key': this.$store.state.discourseToken,
          'Api-Username': this.$store.state.discourseUsername
        }
      }).then(response => {
        this.fetchCategories()
      }, response => {
        alert('Error deleting category (category is not empty or doesn\'t exist)')
      })
    },
    createCategories () {
      let self = this
      this.logs = []
      this.plan.forEach((section, i) => {
        setTimeout(function () {
          let categoryColor = self.randomColor()
          self.$http.post(self.$store.state.discourseUrl + 'categories.json', self.getFormData({
            name: section.title.substring(0, 50),
            color: categoryColor,
            text_color: 'ffffff'
          }), {
            headers: {
              'Api-Key': self.$store.state.discourseToken,
              'Api-Username': self.$store.state.discourseUsername
            }
          }).then(response => {
            let category = response.body.category
            self.log('Create category ' + category.id + ': ' + section.title, 'success')

            section.subsections.forEach((subsection, i) => {
              setTimeout(function () {
                self.$http.post(self.$store.state.discourseUrl + 'categories.json', self.getFormData({
                  name: subsection.title.substring(0, 50),
                  color: categoryColor,
                  text_color: 'ffffff',
                  parent_category_id: category.id
                }), {
                  headers: {
                    'Api-Key': self.$store.state.discourseToken,
                    'Api-Username': self.$store.state.discourseUsername
                  }
                }).then(response => {
                  let subcategory = response.body.category
                  self.log('__ Create subcategory ' + subcategory.id + ': ' + subsection.title, 'success')
                }, response => {
                  self.log('Error : ' + response.body.errors.reduce((acc, elem) => acc + elem, ''), 'error')
                })
              }, 500 * i)
            })
          }, response => {
            self.log('Error : ' + response.body.errors.reduce((acc, elem) => acc + elem, ''), 'error')
          })
        }, 500 * i)
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

  .btn{
    margin-left: 5px;
  }

  .subcategory{
    padding-left: 5px;
    border-left: .05rem solid #5755d9;
    background:#f5f5f5;
  }

  .subcategory td:first-child{
    margin-left: 2em;
  }
</style>
