## Vue-i18n-manage
一款方便国际化文件管理的VS Code插件。

### 安装方法
1、在线安装：在VS Code开发工具的插件库中搜索vue-i18n-manage，找到后选择直接安装。  
2、离线安装：https://marketplace.visualstudio.com/items?itemName=vue-i18n-manage.vue-i18n-manage 访问到页面后点击download extension.

### 包含的功能
1、国际化预览  
2、提取选中的文本生成key值  

### 功能预览
![src/static/vue-i18n-manage.gif](src/static/vue-i18n-manage.gif)

### 使用说明
1、国际化文件目录结构规格  
```
locale                //本地化目录
  i18n                //国际化文件源
    en-US             //英文
      demo.json       //英文文本源，建议一个开发页面对应一个国际化文件
      ...
    zh-CN             //中文
      demo.json       //中文文本源，建议一个开发页面对应一个国际化文件
      ...
    index.js          //一般用于存放添加到Vue实例时，所需要的代码
```

### 在线提问/建议   
https://github.com/flyer-ui/vue-i18n-manage/issues

### 源码地址  
https://github.com/flyer-ui/vue-i18n-manage

### 未来计划
https://github.com/flyer-ui/vue-i18n-manage/projects/1