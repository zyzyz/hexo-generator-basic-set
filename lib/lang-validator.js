'use strict';

module.exports = function(languages) {
  if (!Array.isArray(languages)) {
    languages = [languages];
  }

  if (languages.length > 1) {
    languages = languages.filter(function(lang) {
      return lang && lang.length > 0 && lang !== 'default';
    });
  }

  return languages;
}
