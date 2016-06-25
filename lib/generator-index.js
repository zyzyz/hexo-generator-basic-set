'use strict';

var pagination = require('hexo-pagination');
var langValidator = require('./lang-validator');

/**
 * Reassign page.next and page.prev according to its language!
 * @param {posts} posts of same language
 */
function FilterNextPrevPost(posts) {
  var array = posts.toArray();
  var length = array.length;
  array.forEach(function(currPost, i) {
    currPost.prev = (i == 0)          ? null : array[i - 1];
    currPost.next = (i == length - 1) ? null : array[i + 1];
  });
}

module.exports = function(locals) {
  var config = this.config;
  var comp = config.index_generator.order_by;
  var posts = locals.posts;
  var paginationDir = config.pagination_dir || 'page';

  var languages = langValidator(config.language);
  var isMulti = languages.length > 1;

  return languages.reduce(function(result, lang) {
    var base = isMulti ? lang.toString() + '/' : '';
    var filteredPosts = isMulti ? posts.filter(function(post) {
      return lang === (post.lang || post.language);
    }) : posts;
    // --- locals filtering
    if (isMulti) {
      filteredPosts = filteredPosts.sort('-date');
      FilterNextPrevPost(filteredPosts);
    }
    if (comp !== '-date') {
      filteredPosts = filteredPosts.sort(comp);
    }

    // --- pagination data generating
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
