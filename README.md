<p align='center'>
  <img src='https://raw.githubusercontent.com/flyer-ui/vue-i18n-manage/master/imgs/logo.png' alt='logo' width='160'/> 
</p>

## Vue i18n manage
A VS Code plugin for international file management. 

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
**v0.3.0 Version**  
![src/static/vue-i18n-manage.minor.gif](src/static/vue-i18n-manage.minor.gif)

## Directory structure
```
locale                //Localized directory               
├── en-US             //English
|   ├── demo.json       
|   ├── ...
├── zh-CN             //Chinese
|   ├── demo.json       
|   ├──  ...
|   index.js          //Generally used to store the code needed to add to the Vue instance
```
## About configuration  
```
  // Set your internationalization file path.
  "vue-i18n-manage.path": "",       

  // Set the main language you are developing.
  "vue-i18n-manage.primaryLanguage": "zh-CN"      
```
  
## Online question / suggestion 
https://github.com/flyer-ui/vue-i18n-manage/issues

## Github  
https://github.com/flyer-ui/vue-i18n-manage

## Future plan
https://github.com/flyer-ui/vue-i18n-manage/projects/1

## VS Code Version
"vscode": "^1.33.0"

## License
[MIT](https://github.com/flyer-ui/vue-i18n-manage/blob/master/LICENSE)  © 2019 [Flyer-UI](https://github.com/flyer-ui/flyer-ui)