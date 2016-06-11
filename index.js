/* global hexo */

'use strict'

var assign = require('object-assign');

var per_page = typeof hexo.config.per_page === 'undefined' ? 10 : hexo.config.per_page;

/* Index */
if (hexo.config.index_generator) {
  hexo.config.index_generator = assign({
    per_page: per_page,
    order_by: '-date'
  }, hexo.config.index_generator);

  hexo.extend.generator.register('index', require('./lib/generator-index'));
}

if (hexo.config.archive_generator) {
  hexo.config.archive_generator = assign({
    per_page: per_page,
    yearly: true,
    monthly: true,
    daily: false
  }, hexo.config.archive_generator);

  hexo.extend.generator.register('archive', require('./lib/generator-archive'));
}

if (hexo.config.category_generator) {
  hexo.config.category_generator = assign({
    per_page: per_page,
  }, hexo.config.category_generator);

  hexo.extend.generator.register('category', require('./lib/generator-category'));
}

if (hexo.config.tag_generator) {
  hexo.config.tag_generator = assign({
    per_page: per_page,
    enable_index_page: false
  }, hexo.config.tag_generator);

  hexo.extend.generator.register('tag', require('./lib/generator-tag'));
}
