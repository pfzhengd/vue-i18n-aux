<p align='center'>
  <img src='https://raw.githubusercontent.com/flyer-ui/vue-i18n-manage/master/imgs/logo.png' alt='logo' width='160'/> 
</p>

## Vue i18n aux
项目中开发使用到Vue-i18n的辅助工具。

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/vue-i18n-manage.vue-i18n-manage.svg?style=flat-square)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/vue-i18n-manage.vue-i18n-manage.svg?style=flat-square)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/vue-i18n-manage.vue-i18n-manage.svg?style=flat-square)  

## Installation  

1. 安装Vue-i18n依赖
2. 在VS Code中搜索安装vue-i18n-aux
3. 文件-首选项-设置-配置Primary Language

## Features
1. 开发文件中预览i18n
2. 选中提取自动生成Key


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
└── index.js          
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

## configuration  
```
  //配置当前开发的主要语言目录名
  "vue-i18n-manage.primaryLanguage": "zh-CN"      
```

## License
[MIT](https://github.com/flyer-ui/vue-i18n-manage/blob/master/LICENSE)  © 2019 [Zheng peng fei](https://github.com/pfzhengd)