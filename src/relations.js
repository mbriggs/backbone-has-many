/* global ICan */
;(function($,global,undefined){
  ICan.HasManyRelation = function(klass, on){
    this.iCanHasRelation = true;
    this.klass = global[klass];
    this.on = on;
  }

  _.extend(ICan.HasManyRelation.prototype, {
    initialize: function(model){
      var attrs = this.model.attributes[this.name]
        , collection = new global[this.klass](attrs);

      this.model = model;
      delete this.model.attributes[this.name];
      this.model[this.name] = collection;
    }

  , initializeBelongsTo: function(){
      this.model[this.name] = undefined;
    }
  });

  // belongs to

  ICan.BelongsToRelation = function(klass){

  }

  function removeBelongsTo(relation){
    return function(model){
      model[relation.name] = undefined
    }
  }

  function addBelongsTo(relation, model){
  }

}(jQuery,this,undefined));