/* global ICan */

var Post = Backbone.Model.extend({
  comments: ICan.hasMany('Comments')

, initialize: function() {
    ICan.haveRelationsOn(this)
  }
})

var Comment = Backbone.Model.extend({
  post: ICan.belongsTo('Post')

, initialize: function() {
    ICan.haveRelationsOn(this)
  }
})

var Comments = Backbone.Collection.extend({
  model: Comment
})

/* TODO:
 * allow configuration of whether or not to maintain attrs */

describe("Has Many accessor", function(){
  var post

  beforeEach(function(){
    post = new Post({ comments: [ {body: 'foo'}
                                , {body: 'bar'}
                                ]
                    })
  })

  it("returns a collection", function(){
    expect( post.comments.constructor ).toBe(Comments)
  })

  it("has correct values", function(){
    var vals = post.comments.pluck("body")

    expect( vals.length ).toBe(2)
    expect( _.include(vals, 'foo') ).toBe(true)
    expect( _.include(vals, 'bar') ).toBe(true)
  })

  it("cleans up attrs", function(){
    expect(post.attributes.comments).toBe(undefined)
  })
})

describe("Belongs To accessor", function(){
  it("is cleared on initialize", function(){
    expect((new Comment()).post).toBe(null)
  })

  it("is set on models added to collection", function(){
    var post = new Post()
      , comment = new Comment()

    post.comments.add(comment)

    expect(comment.post.cid).toBe(post.cid)
  })

  it("is removed on models removed from the collection", function(){
    var post = new Post()
      , comment = new Comment()

    post.comments.add(comment)
    post.comments.remove(comment)

    expect(comment.post).toBe(undefined)
  })

  it("adds back reference when comment is part of initialization", function(){
    var post = new Post({ comments: [{foo: 'bar'}] })

    expect(post.comments.length).toBe(1)
    expect(post.comments.first().get('foo')).toBe('bar')
  })
})

describe("serializeGraph", function(){
  it("includes has many", function(){
    var post = new Post({
      name: 'foo'
    , comments: [ {name: 1}
                , {name: 2}
                ]
    })

    var obj = post.serializeGraph()

    expect(obj.name).toBe('foo')
    expect(obj.comments.length).toBe(2)
    expect(obj.comments[0].name).toBe(1)
    expect(obj.comments[1].name).toBe(2)
  })

})
