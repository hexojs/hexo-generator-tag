var pagination = require('hexo-pagination');

function tagGenerator(locals){
  var config = this.config;

  return locals.tags.map(function(tag){
    if (!tag.length) return [];

    var posts = tag.posts.sort('-date');

    return pagination(tag.path, posts, {
      perPage: config.tag_generator.per_page || config.per_page,
      layout: ['tag', 'archive', 'index'],
      data: {
        tag: tag.name
      }
    });
  }).then(function(data){
    return Array.prototype.concat.apply([], data);
  });
}

module.exports = tagGenerator;