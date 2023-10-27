<template>
  <div class="discourse container">
    <div v-if="plan && plan.length">
      <div class="columns">
        <div class="column col-12">
          <discourse-options></discourse-options>
        </div>
        <div class="column col-12">
          <button class="btn btn-primary" :disabled="!$store.state.discourseUrl || !$store.state.discourseUsername || !$store.state.discourseToken" v-on:click="fetchCategories()">
            Fetch existing categories
          </button>
          <button class="btn btn-primary" :disabled="!$store.state.discourseUrl || !$store.state.discourseUsername || !$store.state.discourseToken" v-on:click="createCategories()">
            Create {{categoryCount}} categories and {{subcategoryCount}} subcategories
          </button>
          <button class="btn btn-primary" :disabled="!$store.state.discourseUrl || !$store.state.discourseUsername || !$store.state.discourseToken" v-on:click="createCategories(true)">
            Create {{categoryCount}} categories and {{subcategoryCount}} subcategories (dry run)
          </button>
        </div>
        <div class="column col-12" v-if="logs && logs.length">
          <div class="card">
            <div class="card-body logs" ref="logContainer">
              <div class="log" v-for="(log, index) in logs" :key="index"  :class="'text-' + log.type">{{log.message}}</div>
            </div>
          </div>
        </div>
        <div class="column col-12" v-if="existingCategories.length">
          <div class="card">
            <div class="card-body">
              <table class="table">
                <tr>
                  <th>id</th>
                  <th>name</th>
                  <th>color</th>
                  <th></th>
                  <th>actions</th>
                </tr>
                <tr v-for="(category, index) in existingCategories" :key="index" :class="category.parent_category_id ? 'subcategory':''">
                  <td>{{category.id}}</td>
                  <td><input type="text" v-model="category.name"/></td>
                  <td>#<input type="text" v-model="category.color"/></td>
                  <td>{{category.read_restricted ? '🔒':''}}</td>
                  <td>
                    <button class="btn btn-sm btn-success" v-on:click="updateCategory(category)">Update</button>
                    <button class="btn btn-sm btn-error" v-on:click="deleteCategory(category.id)">Delete</button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
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
      dryRun: false,
      logs: [],
      parentCategories: [],
      existingCategories: []
    }
  },
  computed: {
    plan () {
      try {
        this.$store.commit('updatePlan', JSON.parse(this.$store.state.rawData))
      } catch (e) {
        console.log('invalid json')
      }
      return this.$store.state.plan
    },
    categoryCount () {
      return this.$store.state.plan.length
    },
    subcategoryCount () {
      return !this.$store.state.createUnit ? this.$store.state.plan.reduce((cpt, element) => {
        return cpt + element.subsections.length
      }, 0) : this.$store.state.plan.reduce((cpt, element) => {
        return cpt + element.subsections.reduce((cptSequence, sequence) => {
          return cptSequence + sequence.units.length
        }, 0)
      }, 0)
    }
  },
  methods: {
    fetchCategories () {
      return new Promise((resolve, reject) => {
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
              resolve()
            }, response => {
              alert('Error while fetching categories, please check discourse options')
              reject(response)
            })
          }
        }, response => {
          alert('Error while fetching categories, please check discourse options')
          reject(response)
        })
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
      this.$http.delete(this.$store.state.discourseUrl + 'categories/' + categoryId, {
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
    async createCategories (dryrun) {
      await this.fetchCategories()
      this.dryRun = !!dryrun
      this.logs = []
      for (const section of this.plan) {
        if (this.$store.state.createUnit) {
          const sectionTitle = section.title.replace('Module ', 'M')
          const category = await this.createCategory(sectionTitle)
          for (const subsection of section.subsections) {
            for (const subsubsection of subsection.units) {
              const prefix = section.title.indexOf('Module') !== -1 ? sectionTitle.split(':')[0].split('.')[0] + '. ' : ''
              const subtitle = subsubsection.title.replace('Lecture: ', '').replace('Video: ', '')
              const title = `${prefix}${subtitle}`.substring(0, 50)
              if (!new RegExp(['Forum', 'overview'].join('|')).test(title)) {
                await this.createCategory(title, category)
              }
            }
          }
        } else {
          const title = section.title.substring(0, 50)
          const category = await this.createCategory(title)
          for (const subsection of section.subsections) {
            const title = `${subsection.title}`.substring(0, 50)
            await this.createCategory(title, category)
          }
        }
      }
    },
    createCategory (title, parentCategory) {
      return new Promise((resolve, reject) => {
        const categoryColor = this.randomColor()
        const category = this.existingCategories.find((category) => {
          return category.name === title
        })
        const data = {
          name: title,
          color: categoryColor,
          text_color: 'ffffff'
        }
        let createMsg = title

        if (parentCategory) {
          data.color = parentCategory.color
          data.parent_category_id = parentCategory.id
          createMsg = '├── ' + title
        }

        if (category) {
          this.log(createMsg + ' (Category already exists)', 'warning')
          resolve({ id: category.id, color: category.color })
        } else {
          setTimeout(() => {
            this.postCategoryRequest(data).then(response => {
              let category = response.body.category
              this.log(createMsg + ` (id: ${category.id} ${category.parentId ? 'parentId: ' + category.parentId : ''})`, 'success')
              resolve({ id: category.id, color: categoryColor })
            }, response => {
              this.log(createMsg, 'error')
              reject(new Error(response.body))
            })
          }, this.dryRun ? 10 : 500)
        }
      })
    },
    postCategoryRequest (data) {
      return !this.dryRun ? this.$http.post(this.$store.state.discourseUrl + 'categories.json', this.getFormData(data), {
        headers: {
          'Api-Key': this.$store.state.discourseToken,
          'Api-Username': this.$store.state.discourseUsername
        }
      }) : Promise.resolve({
        body: {
          category: {
            id: Date.now().toString().substr(-4),
            color: '#fff',
            ...(!!data.parent_category_id) && { parentId: data.parent_category_id }
          }
        }
      })
    },
    log (message, type) {
      this.logs.push({ message, type })
      this.$nextTick(function () {
        if (this.$refs.logContainer) {
          this.$refs.logContainer.scrollTo(0, this.$refs.logContainer.scrollHeight + 20)
        }
      })
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
  .logs{
    height: 150px;
    overflow: auto;
    resize: vertical;
  }

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
