# Change Log

## v0.5.2 (2019/06/20)
Optimization:
1. Optimization did not find a description of i18n-key.

## v0.5.0 (2019-06-13)
Release:
1. The file name adds input caching. [#4](https://github.com/pfzhengd/vue-i18n-manage/issues/4)

Optimization:
1. Updated the plugin's logo.
2. Updated the description of the plugin in the library.

## v0.4.6 (2019-06-12)
Release:
1. When the plugin is activated, it will automatically match the path with the path locale.

Optimization:
1. Undefined Chinese and English items, floating will prompt undefined. [#2](https://github.com/pfzhengd/vue-i18n-manage/issues/2)
2. Removed the path configuration because it is not very friendly in terms of experience.
Fixed:
1.  No configuration path plugin will be invalid. [#3](https://github.com/pfzhengd/vue-i18n-manage/issues/3)

## v0.4.5
Fixed:
1. Direct reference to the text of the same key, has a chance to emerge bug.
2. The icon for configuring the text path in the menu bar in the upper right corner is removed.

## v0.4.1
Release:
1. The supported command format is: filename:Key, for example: HelloWorld:lang.demo.key, where HelloWorld is the specified file name and lang.demo.key is the i18n key.

## v0.3.1
Fixed:
1. Updated the README.md file.
2. Fix a bug where the icon on the toolbar is too small.

## v0.3.0  
Release:  
1. If the configured internationalized key value already exists, you will be prompted to confirm the override before replacing the text.
2. If the internationalized key has a . sign split, it will be parsed into the corresponding level data object.

## v0.2.3
Fixed：
1. Restore the logo style of v0.2.1.

## v0.2.2
Fixed:
1. If the value of primaryLanguage in the configuration file is set incorrectly, the small light bulb will not be displayed.

## v0.2.1
Fixed:
1. Optimize the wrong format of the content in the readme file.

## v0.2.0
Release:
1. The plugin only activates projects that have vue-i18n dependencies installed.
2. When the extracted text is converted to a key, it will first detect whether the text already exists.

Fixed:
1. When using i18n conversion,the quotes of the string are not removed.

## v0.1.1
Fixed：  
1. A bug that needs to be manually activated after installing the plugin.

## v0.1.0  
Release:  
1. i18n preview.   
2. extract the selected text,gnerate an i18n key.