var merge = require('utils-merge');

hexo.config.tag_generator = merge({
  per_page: 10
}, hexo.config.tag_generator);

hexo.extend.generator.register('tag', require('./lib/generator'));