
import {Meteor}     from 'meteor/meteor';
import {Template}   from 'meteor/templating';
import {AutoForm}   from 'meteor/aldeed:autoform';
import {FS}         from 'meteor/cfs:base-package';
import './file.html';


AutoForm.addInputType('file-uploader', {
    template: 'ksrvFileUploader',
    
    valueOut: function(){
        return this.val();
    }
});

// FS.debug = true;
var getCollection = function(name){
    return FS._collections[name] || window[name];
};

Template.ksrvFileUploader.onCreated(function(){
    if(FS.debug && typeof console == 'object'){
        if(!(this.data && this.data.atts)){
            if(!this.data.atts.collection){
                console.log('Collection not defined');
            }else if(typeof this.data.atts.collection !== 'string'){
                console.log('Collection must be defined as string');
            }
        }
    }

    var template = this;
    template.collection = template.data.atts.collection;
    template.value = new ReactiveVar(template.data.value);

    /**
     * @todo попробовать AutoForm.updateTrackedFieldValue(template, fieldName) для автосохранения
     */
    this.setFile = function(file){
        var collection = getCollection(template.collection);
        var fileObj = collection.insert(new FS.File(file));
        template.value.set(fileObj._id);
    };

    /**
     * @todo make onError event
     * @todo попробовать AutoForm.updateTrackedFieldValue(template, fieldName) для автосохранения
     */
    this.removeFile = function(fileObj){
        Meteor.call('ksrvFileUploader_remove', template.collection, fileObj._id);
    };

    this.autorun(function(){
        var template = Template.instance();
        var collection = template.data.atts.collection;
        var value = template.value.get();
        if(value){
            template.subscribe('ksrvFileUploader', collection, value);
        }
    });
});

Template.ksrvFileUploader.onRendered(function(){
    var template = this;
    $('#'+AutoForm.getFormId()).on('reset', function(){
        template.value.set(false);
    });
});

Template.ksrvFileUploader.helpers({
    file: function(){
        return  getCollection(this.atts.collection).findOne({ 
            _id: Template.instance().value.get() 
        });
    },

    attr: function(){
        var atts = _.clone(this.atts);
        atts.value = Template.instance().value.get();
        atts.type = 'hidden';
        return _.pick(atts, 'id', 'name', 'type', 'data-schema-key', 'value');
    }
});

Template.ksrvFileUploader.events({
    'change [name=fileselect]': function(event, template){
        if(event.target.files.length){
            template.setFile(event.target.files[0]);
        }
    },

    'click [name=remove]': function(event, template){
        template.removeFile(this);
    },
});

Template.ksrvFileUploaderAddButton.helpers({
    attr: function(){
        var atts = _.clone(this.atts);
        atts.name = 'fileselect';
        atts.type = 'file';
        return _.pick(atts, 'type', 'name', 'accept');
    }
});

Template.ksrvFileUploaderPreviewFile.helpers({
    icon: function() {
        switch (this.extension()) {
            case 'pdf':
                return 'file-pdf-o';

            case 'doc':
            case 'docx':
            case 'odt':
                return 'file-word-o';

            case 'xls':
            case 'xlsx':
            case 'ods':
                return 'file-excel-o';

            case 'ppt':
            case 'odp':
                return 'file-powerpoint-o';

            case 'avi':
            case 'mov':
            case 'mp4':
                return 'file-movie-o';

            case 'mp3':
            case 'waw':
                return 'file-audio-o';

            case 'html':
            case 'htm':
            case 'js':
            case 'php':
                return 'file-code-o';

            case 'zip':
            case 'rar':
            case 'gz':
            case 'tar':
            case '7z':
            case '7zip':
                return 'file-archive-o';

            default:
                return 'file-o';
        }
    }    
});