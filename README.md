<p align='center'>
  <img src='https://raw.githubusercontent.com/flyer-ui/vue-i18n-manage/master/imgs/logo.png' alt='logo' width='160'/> 
</p>

## Vue i18n manage
A VS Code plugin for international file management. 
```
I didn't do the automatic translation function because the translation feeling is not accurate, and the positioning of the plugin itself is lightweight.
```
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/vue-i18n-manage.vue-i18n-manage.svg?style=flat-square)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/vue-i18n-manage.vue-i18n-manage.svg?style=flat-square)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/vue-i18n-manage.vue-i18n-manage.svg?style=flat-square)  

## Installation  

1. Install vue-i18n
2. Install vue-i18n-manage
3. In the settings.json file, set your internationalization file path.
4. In the settings.json file, set the main language you are developing.

## Features
1. I18n preview  
2. Extract the selected text to automatically generate the key


## Preview
![src/static/vue-i18n-manage.gif](src/static/vue-i18n-manage.gif)

## Directory structure
```
locale                              
├── en-US             
|   ├── demo.json       
|   ├── ...
├── zh-CN             
|   ├── demo.json       
|   ├──  ...
└── index.js          //Generally used to store the code needed to add to the Vue instance
```
## Example
```JS

// index.js
const enDemo = require('./en-US/demo.json')
const cnDemo = require('./zh-CN/demo.json')

export default {
  en: enDemo,
  cn: cnDemo
}

// main.js
import Vue from 'vue'
import App from './App'
import messages from './locale'
import VueI18n from 'vue-i18n'

const i18n = new VueI18n({
  locale: 'cn',
  messages: messages
})

window.instance = new Vue({
  el: '#app',
  i18n,
  render: h => h(App)
})

```

## About configuration  
```
  // Set your internationalization file path.
  "vue-i18n-manage.path": "",       

  // Set the main language you are developing.
  "vue-i18n-manage.primaryLanguage": "zh-CN"      
```

## License
[MIT](https://github.com/flyer-ui/vue-i18n-manage/blob/master/LICENSE)  © 2019 [Zheng peng fei](https://github.com/pfzhengd)