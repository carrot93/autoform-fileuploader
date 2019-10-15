import { Meteor } from 'meteor/meteor'
import { FS } from 'meteor/cfs:base-package'

function getCollection (name) {
  const collection = FS._collections[name] || FS._collections[name.toLowerCase()]

  if(!collection){
    throw new Meteor.Error(404, `Collection ${name} not found`)
  }
  return collection
}


/**
 * Подписка на файлы определенной коллекции
 */
Meteor.publish("ksrvFileUploader", function(name, _id){
  if (!_id) this.ready()
  const collection = getCollection(name)
  const file = collection.findOne({ _id })
  return collection.find({ _id })
})

/**
 * Удаление файла
 */
Meteor.methods({
  ksrvFileUploader_remove (name, _id, callback) {
    const collection = getCollection(name)
    const file = collection.findOne({ _id })

    if (!file){
      throw new Meteor.Error(404, 'File not found')
    }

    if(file.owner && file.owner !== Meteor.userId()){
        throw new Meteor.Error(403, 'Access denied');
    }

    collection.remove({ _id })

    callback && callback(_id)
  }
})
