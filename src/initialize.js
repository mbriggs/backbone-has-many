/* HasMany initializaiton
 *
 * relations are set up on the first
 * instanciation and cached, to avoid the
 * need to have an explicit call when all
 * the related classes have loaded
 */

/* global ICan */
;(function($,global,undefined){
  _.extend(ICan, {
    haveRelationsOn: function(model){
      var relations = relationsFor(model);

      for(var i = 0; i < relations.length; i += 1){
        relations[i].initialize(model);
      }
    }

  , hasMany: function(collection){
      return new ICan.HasManyRelation(collection);
    }

  , belongsTo: function(type){
      return new ICan.BelongsToRelation(type);
    }
  })

  function relationsFor(model){
    var Model = model.constructor.prototype
      , relations = Model.iCanHasRelations;

    if(relations === undefined){
      relations = buildRelations(model);
      Model.iCanHasRelations = relations;
      Model.serializeGraph = serializeGraph;
    }

    return relations
  }

  function buildRelations(model){
    var Model = model.constructor
      , relations = []
      , relation = null;

    for(var attr in model){
      relation = model[attr];

      if (relation.iCanHasRelation){
        delete model[attr];
        relation.name = attr;
        relation.containingClass = Model;
        relations.push(relation);
      }
    }

    return relations;
  }

  function serializeGraph(){
    var json = this.toJSON()
      , relations = this.iCanHasRelations;

    for(var i = 0; i < relations.length; i += 1){
      if(relations[i] instanceof ICan.HasManyRelation){
        var relation = relations[i].name;
        json[relation] = this[relation].map(function(related){
          return related.serializeGraph();
        })
      }
    }

    return json;
  }
}(jQuery,this,undefined));