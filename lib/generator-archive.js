'use strict';

var pagination = require('hexo-pagination');
var langValidator = require('./lang-validator');

var fmtNum = function(num) {
  return num < 10 ? '0' + num : num;
};

module.exports = function(locals) {
  var Query = this.model('Post').Query;
  var config = this.config;
  var archiveDir = config.archive_dir;
  var paginationDir = config.pagination_dir || 'page';
  var allPosts = locals.posts.sort('-date');
  var perPage = config.archive_generator.per_page;
  var result = [];

  if (!allPosts.length) return;

  if (archiveDir[archiveDir.length - 1] !== '/') archiveDir += '/';

  function generate(path, posts, options) {
    options = options || {};
    options.archive = true;

    result = result.concat(pagination(path, posts, {
      perPage: perPage,
      layout: ['archive', 'index'],
      format: paginationDir + '/%d/',
      data: options
    }));
  }

  function organizePostsByDate(targetPosts) {
    var resultPosts = {};
    targetPosts.forEach(function(post) {
      var date = post.date;
      var year = date.year();
      var month = date.month() + 1; // month is started from 0

      if (!resultPosts.hasOwnProperty(year)) {
        // 13 arrays. The first array is for posts in this year
        // and the other arrays is for posts in this month
        resultPosts[year] = [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        ];
      }

      resultPosts[year][0].push(post);
      resultPosts[year][month].push(post);
      // Daily
      if (config.archive_generator.daily) {
        var day = date.date();
        if (!resultPosts[year][month].hasOwnProperty(day)) {
          resultPosts[year][month].day = {};
        }

        (resultPosts[year][month].day[day] || (resultPosts[year][month].day[day] = [])).push(post);
      }
    });

    return resultPosts;
  }

  function generateByDate(basePath, targetPosts) {
    var years = Object.keys(targetPosts);
    var year, data, month, monthData, url;

    // Yearly
    for (var i = 0, len = years.length; i < len; i++) {
      year = +years[i];
      data = targetPosts[year];
      url = basePath + year + '/';
      if (!data[0].length) continue;

      generate(url, new Query(data[0]), {year: year});

      if (!config.archive_generator.monthly && !config.archive_generator.daily) continue;

      // Monthly
      for (month = 1; month <= 12; month++) {
        monthData = data[month];
        if (!monthData.length) continue;
        if (config.archive_generator.monthly) {
          generate(url + fmtNum(month) + '/', new Query(monthData), {
            year: year,
            month: month
          });
        }

        if (!config.archive_generator.daily) continue;

        // Daily
        for (var day = 1; day <= 31; day++) {
          var dayData = monthData.day[day];
          if (!dayData || !dayData.length) continue;
          generate(url + fmtNum(month) + '/' + fmtNum(day) + '/', new Query(dayData), {
            year: year,
            month: month,
            day: day
          });
        }
      }
    }

  }

  // Generating
  var languages = langValidator(config.language);
  var isMulti = languages.length > 1;

  languages.forEach(function(lang) {
    var baseDir = (isMulti ? lang.toString() + '/' : '') + archiveDir;
    var filteredPosts = isMulti ? allPosts.filter(function(post) {
      return lang === (post.lang || post.language);
    }) : allPosts;

    generate(baseDir, filteredPosts);

    if (!config.archive_generator.yearly) return result;

    var organizedPosts = organizePostsByDate(filteredPosts);
    generateByDate(baseDir, organizedPosts);
  });

  return result;
}
