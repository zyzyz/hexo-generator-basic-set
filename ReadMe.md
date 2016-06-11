# hexo-generator-basic-set


A set of basic page generators for [Hexo], **with multi-language supported**.
Includes variant of modules below:
+ [hexo-generator-index]
+ [hexo-generator-archive]
+ [hexo-generator-category]
+ [hexo-generator-tag]

## Features

+ Individual webpages in expected url.
+ Pagination by languages.

## Installation

``` bash
$ npm install hexo-generator-basic-set --save
```

## Instruction

#### • Create your posts with language
1. Change your settings in `_config.yml`
  + Set `languages`.
  + Start your `new_post_name` with `:lang/`
  + Start your `permalink` with `:lang/`
2. Create your new post using `hexo new <layout> <title> --lang <your language>`

**Note: It's not recommended to use date as a part of `permalink`, for you may write a post in two language in different date, change only the language part in url doesn't help you make a correct switch.**

#### • Configure the generators
Each generator has its own configuration(like its original version).
The configurations are listed below:

``` yaml
# Pagination
## Set per_page to 0 to disable pagination

pagination_dir: page
## This parameter is used as default value
## if "per_page" is not presented in the respective configuration
per_page: 4

index_generator:
  per_page: 5
  order_by: -date

archive_generator:
  per_page: 3
  yearly: true
  monthly: true
  daily: false

category_generator:
  per_page: 5

tag_generator:
   per_page: 5
   enable_index_page: false
```

Generators can be easily disabled by removing the corresponding configurations from `_config.yml`.

#### • Run `hexo g`

**Note: No sub-folders will be created if you leave `languages` unfilled or just assign one language, an index.html will be generated under `public/`, just like the original one does. Config in this way if you don't want a multi-language blog.**

## Attention

+ Not compatible with the original plugins.
+ No webpage of index/archive/category/tag's pagination will be generated if there is no post of corresponding language, even if you have declared that language in `_config.yml`.
+ Tag/Category itself doesn't have a translation.

## License

MIT

Thanks to **[tommy351]**'s original works.

[Hexo]:                    http://hexo.io/
[hexo-generator-index]:    https://github.com/hexojs/hexo-generator-index
[hexo-generator-archive]:  https://github.com/hexojs/hexo-generator-archive
[hexo-generator-category]: https://github.com/hexojs/hexo-generator-category
[hexo-generator-tag]:      https://github.com/hexojs/hexo-generator-tag
[tommy351]:                https://github.com/tommy351
