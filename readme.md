(I CAN) Has Many
================

I needed a way to do very simple relationships in backbone, but found
the existing solutions, while very full featured, were a bit larger and
more invasive then what I was looking for. This aims to be an _extremely_
simple implementation of the most basic (has one / belongs to)
relationship, while aiming for a low amount of configuration and syntax.


Limitations
-----------

 - only has-many/belongs-to
 - only supports a single parent/child relationship of a specific class
 - object graph serialization is only from the parent model down
 - no storage of related id fields
 - not 'threadsafe'

if this doesn't meet your requirements, I would highly recommend
checking out the excellent backbone-relational (https://github.com/PaulUithol/Backbone-relational), as it does all that and more.

Example (or What I am aiming for, since nothing is written yet)
---------------------------------------------------------------

```javascript
var Post = Backbone.Model.extend({
  comments: ICan.hasMany('Comments')

, initialize: function() {
    ICan.hasRelationsOn(this)
  }
})

var Comment = Backbone.Model.extend({
  post: ICan.belongTo('Post')

, initialize: function() {
    ICan.haveRelationsOn(this)
  }
})

var Comments = Backbone.Collection.extend({
  model: Comment
})

var post = new Post({comments: [{body: 'foo'}, {body: 'bar'}]})

post.comments() // an instance of Comments containing the two comments specified

var comment = post.comments().first()
comment.get('body') // returns 'foo', body of the first comment
comment.post() // returns its parent post
comment.set({body: 'baz'})

post.serializeGraph() // returns {comments: [{body: 'baz'}, {body: 'bar'}]}
```

Namespaces
----------

I think a bit of global pollution is really not a big deal for
application code, but library code should be completely namespaced. That
being said, passed a certain size, not namespacing is the path to
madness. I also think that namespaces should be fairly flat, that
collections should be the plural form of models, and that collections
and models should be in the same namespace (by that I mean if you want
to namespace Comment and Comments from the previous example thats fine,
but they should be in the same place since they are highly related).

If you agree with the above, the provided methods should be more then
enough to handle namespaces.

```javascript
// all relations will have a base namespace of Cheezburgers, for
// example, in the previous example, it would look for Post under
// Cheezburgers.Post

ICan.hasNamespace = 'Cheezburgers'

// namespacing can be also be set at a relation level by giving fully
// qualified names to models. Note that this will be in addition to the
// base namespace, not overiding. This will look for Comments in
// Cheezburgers.HaveNothingToDoWith.Comments

var Cheezburgers.Post = Backbone.Model.extend({
  comments: ICan.hasMany('HaveNothingToDoWith.Comments')

, initialize: function() {
    ICan.hasRelationsOn(this)
  }
})
```
