# Change Log

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