'use strict';

var pagination = require('hexo-pagination');

module.exports = function(locals){
  var config = this.config;
  var perPage = config.tag_generator.per_page;

  return locals.tags.reduce(function(result, tag){
    if (!tag.length) return result;

    var posts = tag.posts.sort('-date');
    var data = pagination(tag.path, posts, {
      perPage: perPage,
      layout: ['tag', 'archive', 'index'],
      data: {
        tag: tag.name
      }
    });

    return result.concat(data);
  }, []);
};