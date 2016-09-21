/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
(function () {
  'use strict';

  angular.module('SchoolLink.service')
      .service('$pouchDb', pouchDb);

  /** @ngInject */
  function pouchDb($q) {
    var _self = this;
    _self.localDb = {};
    this.initDB = function(dbName) {
      // create database or open if it is already
      _self.localDb[dbName] = new PouchDB(dbName, {adapter : 'websql'});
    };
    this.destroyDatabase = function(dbName){
      var _db = _self.localDb[dbName];
      return $q.when(_db.destroy());
    };
    this.getInfoDataBase = function(dbName){
      var _db = _self.localDb[dbName];
      return $q.when(_db.info());
    };
    // add new document to database
    this.addDoc = function(dbName, doc){
      var _db = _self.localDb[dbName];
      return $q.when(_db.put(doc));
    };
    // update a document to database
    this.updateDoc = function(dbName, doc){
      var _db = _self.localDb[dbName];
      return $q.when(_db.put(doc));
    };
    // delete a document to database
    this.deleteDoc = function(dbName, doc){
      var _db = _self.localDb[dbName];
      return $q.when(_db.remove(doc));
    };
    // add, delete, update documents to database
    this.bulkDocs = function(dbName, docs){
      var _db = _self.localDb[dbName];
      return $q.when(_db.bulkDocs(docs));
    };
    this.getDocById = function(dbName, id){
      var _db = _self.localDb[dbName];
      return $q.when(_db.get(id));
    };
    this.getAllDocs = function(dbName){
      var _db = _self.localDb[dbName];
      return $q.when(_db.allDocs({ include_docs: true}))
        .then(function(docs) {
          // Each row has a .doc object and we just want to send an 
          // array of contact objects back to the calling controller,
          // so let's map the array to contain just the .doc objects.
          var allData = docs.rows.map(function(row) {
              return row.doc;
          });
          return allData;
      });
    };
  }
})();
