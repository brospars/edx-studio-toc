# Edx Studio Table of content

- [How to use](#how-to-use)
  * [Bookmarklet](#bookmarklet)
  * [Table of Contents](#table-of-contents)
  * [Discourse categories](#discourse-categories)
- [Development](#development)

## How to use

### Bookmarklet

1. Create a bookmark (right-click "add bookmark") and paste the code from [here](public/bookmark.js)  
![Bookmark](assets/add-bookmark.png)
2. Go to the course homepage in studio (ex : https://studio.fun-mooc.fr/course/course-v1:xxxxxxxxxx)  
![Studio](assets/studio.png)
3. Run the bookmarklet by clicking it  
![Course data](assets/course-data.png)
4. Click the button to copy and go to the app
5. Paste the data inside the "Raw data" field

### Table of Contents

1. Go to the Table of contents tab
![screenshot](assets/tab-toc.png)
3. Select options (base url, depth, template, etc)
![app](assets/toc-options.png)
4. Check the preview
![app](assets/toc-render.png)
5. Copy code from the left panel

### Discourse categories

1. Go to the Discourse tab
![screenshot](assets/tab-discourse.png)
2. Put Discourse options (API key are generated from Discourse Admin panel > API)
![screenshot](assets/discourse-options.png)
4. Check existing categories by clicking "Fetch existing categories"
![screenshot](assets/category-fetch.png)
5. Update or delete existing categories
![screenshot](assets/category-list.png)
6. Generate all categories and subcategories using "Create X categories and X subcategories"
![screenshot](assets/category-create.png)

## Development

```
npm install
```

**Compiles and hot-reloads for development**
```
npm run serve
```

**Compiles and minifies for production**
```
npm run build
```

**Run your tests**
```
npm run test
```

**Lints and fixes files**
```
npm run lint
```
