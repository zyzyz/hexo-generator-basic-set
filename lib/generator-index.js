'use strict';

var pagination = require('hexo-pagination');
var langValidator = require('./lang-validator');

module.exports = function(locals) {
  var config = this.config;
  var posts = locals.posts.sort(config.index_generator.order_by);
  var paginationDir = config.pagination_dir || 'page';

  var languages = langValidator(config.language);
  var isMulti = languages.length > 1;

  return languages.reduce(function(result, lang) {
    var base = isMulti ? lang.toString() + '/' : '';
    var filteredPosts = isMulti ? posts.filter(function(post) {
      return lang === (post.lang || post.language);
    }) : posts;

    var data = pagination(base, filteredPosts, {
      perPage: config.index_generator.per_page,
      layout: ['index', 'archive'],
      format: paginationDir + '/%d/',
      data: {
        __index: true
      }
    });

    return result.concat(data);
  }, []);
};
