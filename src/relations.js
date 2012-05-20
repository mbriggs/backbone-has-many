/* global ICan */
;(function($,global,undefined){
  // updaters
  // handlers to manage moving from one hasmany to another

  function addBelongsTo(hasMany, related){
    return function(model){
      var belongsTo = _.find(model.iCanBelongTo, belongsToFor(hasMany));

      if(belongsTo) model[belongsTo.name] = related;
    }
  }

  function removeBelongsTo(hasMany){
    return function(model){
      var belongsTo = _.find(model.iCanBelongTo, belongsToFor(hasMany));

      if(belongsTo) model[belongsTo.name] = undefined;
    }
  }

  function belongsToFor(hasMany){
    return function(belongsTo){
      return belongsTo.relatedClass === hasMany.containingClass;
    }
  }

  // has many
  // manages the collection

  ICan.HasManyRelation = function(klass){
    this.iCanHasRelation = true;
    this.collectionClass = klass;
  }

  _.extend(ICan.HasManyRelation.prototype, {
    initialize: function(model){
      var attrs = model.attributes[this.name];

      this.model = model;
      this.setCollectionClass();
      this.coll = new this.collectionClass(attrs);

      this.addUpdaters();
      this.setCollection();
    }

  , addUpdaters: function(){
      this.coll.on('add', addBelongsTo(this, this.model));
      this.coll.on('remove', removeBelongsTo(this));
    }

  , setCollectionClass: function(){
      if(typeof this.collectionClass == 'string'){
        this.collectionClass = global[this.collectionClass];
      }
    }

  , setCollection: function(){
      delete this.model.attributes[this.name];
      this.model[this.name] = this.coll;
    }
  });

  // belongs to
  // mostly just a reference of the hasmany class and ref name
  ICan.BelongsToRelation = function(klass){
    this.iCanHasRelation = true;
    this.relatedClass = klass;
  }

  _.extend(ICan.BelongsToRelation.prototype, {
    initialize: function(model){
      model.iCanBelongTo || (model.iCanBelongTo = [])
      model.iCanBelongTo.push(this)
      model[this.name] = null;
      this.setRelatedClass();
    }

  , setRelatedClass: function(){
      if(typeof this.relatedClass == 'string'){
        this.relatedClass = global[this.relatedClass];
      }
    }
  })

}(jQuery,this,undefined));