# hexo-generator-tag

[![Build Status](https://travis-ci.org/hexojs/hexo-generator-tag.svg?branch=master)](https://travis-ci.org/hexojs/hexo-generator-tag)  [![NPM version](https://badge.fury.io/js/hexo-generator-tag.svg)](http://badge.fury.io/js/hexo-generator-tag) [![Coverage Status](https://img.shields.io/coveralls/hexojs/hexo-generator-tag.svg)](https://coveralls.io/r/hexojs/hexo-generator-tag?branch=master)

Tag generator for [Hexo].

## Installation

``` bash
$ npm install hexo-generator-tag --save
```

## Options

``` yaml
tag_generator:
	per_page: 10
	enable_index_page: false
	orderby: name
	order: 1
```

- **per_page**: Posts displayed per page. (0 = disable pagination)
- **enable_index_page**: defines whether an index page is generated.
- **orderby**: Order of tags.
- **order**: Sort order. 1, for ascending; -1, for descending

## Index page generation

If `enable_index_page` is set to true, the Hexo generator tag will serch for a template named "tag-index" to produce a webpage.

The variable inserted into the template `tag-index` respect the structure :

```
{
	base: tagDir,
	total: 1,
	current: 1,
	current_url: tagDir,
	posts: locals.posts, // all posts
	prev: 0,
	prev_link: '',
	next: 0,
	next_link: '',
	tags: tags // all tags
 }
 ```


## License

MIT

[Hexo]: http://hexo.io/