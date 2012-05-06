;(function($,global){

  // public api

  global.ICan = {
    haveRelationsOn: haveRelationsOn
  , hasMany: function(collection){
      return new Relation('has many', collection);
    }
  , belongsTo: function(type){
      return new Relation('belongs to', type);
    }
  }

  // on initialize

  function haveRelationsOn(model){
    var attrs = model.attributes
      , relations = relationsFor(model);

    for(var i = 0; i < relations.length; i += 1){
      relations[i].initialize(model);
    }
  }

  function relationsFor(model){
    var relations = [],
        val = null;

    for(var attr in model){
      val = model[attr];

      if (val.iCanHasRelation){
        val.name = attr;
        relations.push(val);
      }
    }

    return relations;
  }

  // relation

  function Relation(type, klass){
    this.iCanHasRelation = true;
    this.type = type;
    this.klass = klass;
  }

  _.extend(Relation.prototype, {
    initialize: function(model){
      this.model = model;
      if(this.type == 'has many'){
        this.initializeHasMany();
      }
    }

  , initializeHasMany: function(){
      var attrs = this.model.attributes[this.name]
        , collection = new global[this.klass](attrs);

      delete this.model.attributes[this.name];
      this.model[this.name] = collection;
    }

  , initializeHasOne: function(){}

  , initializeBelongsTo: function(){}
  });

}(jQuery,this));