/* global ICan */
;(function($,global,undefined){
  _.extend(ICan, {
    haveRelationsOn: haveRelationsOn

  , hasMany: function(collection){
      return new ICan.HasManyRelation(collection);
    }

  , belongsTo: function(type){
      return new ICan.BelongsToRelation('belongs to', type);
    }
  })

  function haveRelationsOn(model){
    var attrs = model.attributes
      , relations = relationsFor(model);

    for(var i = 0; i < relations.length; i += 1){
      relations[i].initialize(model);
    }
  }

  function relationsFor(model){
    var relations = [],
        relation = null;

    for(var attr in model){
      relation = model[attr];

      if (relation.iCanHasRelation){
        relation.name = attr;
        relations.push(relation);
      }
    }

    return relations;
  }
}(jQuery,this,undefined));