/**
 * @author v.lugovsky
 * created on 03.05.2016
 */
  angular.module('SchoolLink.service')
  .factory('$exportXlsx', function ($rootScope, $state) {
    return {
      export : function(values, path, name){
        console.log(path);
        var pathTemplate = path;
        console.log(pathTemplate);
        /*var XlsxTemplate = {};
        try {
          XlsxTemplate = require('xlsx-template');
        } catch (ex) {
          console.log('Cannot load xlsx-template', ex);
          return;
        }*/
        var fs = require('fs');

        fs.readFile(pathTemplate, function(err, data) {
          var template = new XlsxTemplate(data);
          console.log(JSON.stringify(values));
          // Perform substitution
          template.substitute(1, values);
          var saleExportLocation = 'C:\\medicMan\\' +name+"_"+ moment(new Date()).format("DD-M-YYYY_HH-mm-ss") + '.xlsx';
          fs.writeFileSync(saleExportLocation, template.generate(), 'binary');
        })
      }
    };
  });
