'use strict'

var pagination = require('hexo-pagination');
var langValidator = require('./lang-validator');

module.exports = function(locals) {
  var config = this.config;
  var perPage = config.category_generator.per_page;
  var paginationDir = config.pagination_dir || 'page';

  var languages = langValidator(config.language);
  var isMulti = languages.length > 1;

  return languages.reduce(function(result1, lang) {
    var base = isMulti ? lang.toString() + '/' : '';

    var currResult = locals.categories.reduce(function(result2, category) {
      if (!category.length) return result2;

      var posts = category.posts.sort('-date');
      posts = isMulti ? posts.filter(function(post) {
        return lang === (post.lang || post.language);
      }) : posts;

      var path = base + category.path;
      var data = pagination(path, posts, {
        perPage: perPage,
        layout: ['category', 'archive', 'index'],
        format: paginationDir + '/%d/',
        data: {
          category: category.name
        }
      });

      return result2.concat(data);
    }, []);

    return result1.concat(currResult);
  }, []);
}
