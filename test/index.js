'use strict';

const should = require('chai').should(); // eslint-disable-line
const Hexo = require('hexo');

describe('Tag generator', () => {
  const hexo = new Hexo(__dirname, {silent: true});
  hexo.init();
  const Post = hexo.model('Post');
  const generator = require('../lib/generator').bind(hexo);
  let posts = {};
  let locals = {};

  // Default config
  hexo.config.tag_generator = {
    per_page: 10
  };

  before(() => {
    return Post.insert([
      {source: 'foo', slug: 'foo', date: 1e8},
      {source: 'bar', slug: 'bar', date: 1e8 + 1},
      {source: 'baz', slug: 'baz', date: 1e8 - 1},
      {source: 'boo', slug: 'boo', date: 1e8 + 2}
    ]).then((data) => {
      posts = data;

      return posts[0].setTags(['foo']).then(() => {
        return posts[1].setTags(['bar']);
      }).then(() => {
        return posts[2].setTags(['foo']);
      }).then(() => {
        return posts[3].setTags(['foo']);
      });
    }).then(() => {
      locals = hexo.locals.toObject();
    });
  });

  describe('Disable index page', () => {
    it('pagination enabled', () => {
      hexo.config.tag_generator.per_page = 2;

      const result = generator(locals);

      result.length.should.eql(3);

      for (let i = 0, len = result.length; i < len; i++) {
        result[i].layout.should.eql(['tag', 'archive', 'index']);
      }

      result[0].path.should.eql('tags/foo/');
      result[0].data.base.should.eql('tags/foo/');
      result[0].data.total.should.eql(2);
      result[0].data.current.should.eql(1);
      result[0].data.current_url.should.eql('tags/foo/');
      result[0].data.posts.eq(0)._id.should.eql(posts[3]._id);
      result[0].data.posts.eq(1)._id.should.eql(posts[0]._id);
      result[0].data.prev.should.eql(0);
      result[0].data.prev_link.should.eql('');
      result[0].data.next.should.eql(2);
      result[0].data.next_link.should.eql('tags/foo/page/2/');
      result[0].data.tag.should.eql('foo');

      result[1].path.should.eql('tags/foo/page/2/');
      result[1].data.base.should.eql('tags/foo/');
      result[1].data.total.should.eql(2);
      result[1].data.current.should.eql(2);
      result[1].data.current_url.should.eql('tags/foo/page/2/');
      result[1].data.posts.eq(0)._id.should.eql(posts[2]._id);
      result[1].data.prev.should.eql(1);
      result[1].data.prev_link.should.eql('tags/foo/');
      result[1].data.next.should.eql(0);
      result[1].data.next_link.should.eql('');
      result[1].data.tag.should.eql('foo');

      result[2].path.should.eql('tags/bar/');
      result[2].data.base.should.eql('tags/bar/');
      result[2].data.total.should.eql(1);
      result[2].data.current.should.eql(1);
      result[2].data.current_url.should.eql('tags/bar/');
      result[2].data.posts.eq(0)._id.should.eql(posts[1]._id);
      result[2].data.prev.should.eql(0);
      result[2].data.prev_link.should.eql('');
      result[2].data.next.should.eql(0);
      result[2].data.next_link.should.eql('');
      result[2].data.tag.should.eql('bar');

      // Restore config
      hexo.config.tag_generator.per_page = 10;
    });

    it('pagination disabled', () => {
      hexo.config.tag_generator.per_page = 0;

      const result = generator(locals);

      result.length.should.eql(2);

      for (let i = 0, len = result.length; i < len; i++) {
        result[i].layout.should.eql(['tag', 'archive', 'index']);
      }

      result[0].path.should.eql('tags/foo/');
      result[0].data.base.should.eql('tags/foo/');
      result[0].data.total.should.eql(1);
      result[0].data.current.should.eql(1);
      result[0].data.current_url.should.eql('tags/foo/');
      result[0].data.posts.eq(0)._id.should.eql(posts[3]._id);
      result[0].data.posts.eq(1)._id.should.eql(posts[0]._id);
      result[0].data.posts.eq(2)._id.should.eql(posts[2]._id);
      result[0].data.prev.should.eql(0);
      result[0].data.prev_link.should.eql('');
      result[0].data.next.should.eql(0);
      result[0].data.next_link.should.eql('');
      result[0].data.tag.should.eql('foo');

      result[1].path.should.eql('tags/bar/');
      result[1].data.base.should.eql('tags/bar/');
      result[1].data.total.should.eql(1);
      result[1].data.current.should.eql(1);
      result[1].data.current_url.should.eql('tags/bar/');
      result[1].data.posts.eq(0)._id.should.eql(posts[1]._id);
      result[1].data.prev.should.eql(0);
      result[1].data.prev_link.should.eql('');
      result[1].data.next.should.eql(0);
      result[1].data.next_link.should.eql('');
      result[1].data.tag.should.eql('bar');

      // Restore config
      hexo.config.tag_generator.per_page = 10;
    });

    it('custom pagination_dir', () => {
      hexo.config.tag_generator.per_page = 2;
      hexo.config.pagination_dir = 'yo';

      const result = generator(locals);

      result.map((item) => {
        return item.path;
      }).should.eql(['tags/foo/', 'tags/foo/yo/2/', 'tags/bar/']);

      // Restore config
      hexo.config.tag_generator.per_page = 10;
      hexo.config.pagination_dir = 'page';
    });
  });

  describe('Enable index page', () => {
    it('pagination enabled', () => {
      hexo.config.tag_generator.per_page = 2;
      hexo.config.tag_generator.enable_index_page = true;

      const result = generator(locals);

      result.length.should.eql(4);

      for (let i = 0, len = result.length - 1; i < len; i++) {
        result[i].layout.should.eql(['tag', 'archive', 'index']);
      }

      result[3].layout.should.eql(['tag-index', 'tag', 'archive', 'index']);

      result[0].path.should.eql('tags/foo/');
      result[0].data.base.should.eql('tags/foo/');
      result[0].data.total.should.eql(2);
      result[0].data.current.should.eql(1);
      result[0].data.current_url.should.eql('tags/foo/');
      result[0].data.posts.eq(0)._id.should.eql(posts[3]._id);
      result[0].data.posts.eq(1)._id.should.eql(posts[0]._id);
      result[0].data.prev.should.eql(0);
      result[0].data.prev_link.should.eql('');
      result[0].data.next.should.eql(2);
      result[0].data.next_link.should.eql('tags/foo/page/2/');
      result[0].data.tag.should.eql('foo');

      result[1].path.should.eql('tags/foo/page/2/');
      result[1].data.base.should.eql('tags/foo/');
      result[1].data.total.should.eql(2);
      result[1].data.current.should.eql(2);
      result[1].data.current_url.should.eql('tags/foo/page/2/');
      result[1].data.posts.eq(0)._id.should.eql(posts[2]._id);
      result[1].data.prev.should.eql(1);
      result[1].data.prev_link.should.eql('tags/foo/');
      result[1].data.next.should.eql(0);
      result[1].data.next_link.should.eql('');
      result[1].data.tag.should.eql('foo');

      result[2].path.should.eql('tags/bar/');
      result[2].data.base.should.eql('tags/bar/');
      result[2].data.total.should.eql(1);
      result[2].data.current.should.eql(1);
      result[2].data.current_url.should.eql('tags/bar/');
      result[2].data.posts.eq(0)._id.should.eql(posts[1]._id);
      result[2].data.prev.should.eql(0);
      result[2].data.prev_link.should.eql('');
      result[2].data.next.should.eql(0);
      result[2].data.next_link.should.eql('');
      result[2].data.tag.should.eql('bar');

      result[3].path.should.eql('tags/');
      result[3].data.base.should.eql('tags/');
      result[3].data.total.should.eql(1);
      result[3].data.current.should.eql(1);
      result[3].data.current_url.should.eql('tags/');
      // just all posts
      result[3].data.posts.should.eql(locals.posts);
      result[3].data.prev.should.eql(0);
      result[3].data.prev_link.should.eql('');
      result[3].data.next.should.eql(0);
      result[3].data.next_link.should.eql('');
      // no tag, tags instead
      (result[3].data.tag === undefined).should.be.true;
      result[3].data.tags.should.eql(locals.tags);

      // Restore config
      hexo.config.tag_generator.per_page = 10;
    });

    it('pagination disabled', () => {
      hexo.config.tag_generator.per_page = 0;
      hexo.config.tag_generator.enable_index_page = true;

      const result = generator(locals);

      result.length.should.eql(3);

      for (let i = 0, len = result.length - 1; i < len; i++) {
        result[i].layout.should.eql(['tag', 'archive', 'index']);
      }

      result[2].layout.should.eql(['tag-index', 'tag', 'archive', 'index']);

      result[0].path.should.eql('tags/foo/');
      result[0].data.base.should.eql('tags/foo/');
      result[0].data.total.should.eql(1);
      result[0].data.current.should.eql(1);
      result[0].data.current_url.should.eql('tags/foo/');
      result[0].data.posts.eq(0)._id.should.eql(posts[3]._id);
      result[0].data.posts.eq(1)._id.should.eql(posts[0]._id);
      result[0].data.posts.eq(2)._id.should.eql(posts[2]._id);
      result[0].data.prev.should.eql(0);
      result[0].data.prev_link.should.eql('');
      result[0].data.next.should.eql(0);
      result[0].data.next_link.should.eql('');
      result[0].data.tag.should.eql('foo');

      result[1].path.should.eql('tags/bar/');
      result[1].data.base.should.eql('tags/bar/');
      result[1].data.total.should.eql(1);
      result[1].data.current.should.eql(1);
      result[1].data.current_url.should.eql('tags/bar/');
      result[1].data.posts.eq(0)._id.should.eql(posts[1]._id);
      result[1].data.prev.should.eql(0);
      result[1].data.prev_link.should.eql('');
      result[1].data.next.should.eql(0);
      result[1].data.next_link.should.eql('');
      result[1].data.tag.should.eql('bar');

      result[2].path.should.eql('tags/');
      result[2].data.base.should.eql('tags/');
      result[2].data.total.should.eql(1);
      result[2].data.current.should.eql(1);
      result[2].data.current_url.should.eql('tags/');
      result[2].data.posts.should.eql(locals.posts);
      result[2].data.prev.should.eql(0);
      result[2].data.prev_link.should.eql('');
      result[2].data.next.should.eql(0);
      result[2].data.next_link.should.eql('');
      (result[2].data.tag === undefined).should.be.true;
      result[2].data.tags.should.eql(locals.tags);

      // Restore config
      hexo.config.tag_generator.per_page = 10;
    });

    it('custom pagination_dir', () => {
      hexo.config.tag_generator.per_page = 2;
      hexo.config.pagination_dir = 'yo';
      hexo.config.tag_generator.enable_index_page = true;

      const result = generator(locals);

      result.map((item) => {
        return item.path;
      }).should.eql(['tags/foo/', 'tags/foo/yo/2/', 'tags/bar/', 'tags/']);

      // Restore config
      hexo.config.tag_generator.per_page = 10;
      hexo.config.pagination_dir = 'page';
    });
  });
});
