/**
 * Created with JetBrains WebStorm.
 * User: bensudbury
 * Date: 25/03/13
 * Time: 9:43 AM
 * To change this template use File | Settings | File Templates.
 */
import mockfs from "mock-fs";
// setupFilesystemMocks();
import fs from "fs";
// import {finder} from "../lib/node-find-files";
// import mocks from "mocks";
// import path from "path";



import should from "should";

var strFolderName : string = "/first";
var newFilesSinceDate : Date = new Date();



describe("GetNewFiles", function() {
    it("should return all files and folders when there is no filter", function (done) {
        var matchCounter = 0;
        mockfs({
            'path/to/file.txt': 'file content here'
          }, null);
        fs.readdir("/", (err, files) => {
            var here = files;
        })
    //    this.timeout(100000);
        
//         var fileSearch = new finder({rootFolder : strFolderName, filterFunction: function() { return true;}});
        
//         fileSearch.on("match", function(strPath, stat) {
//             matchCounter++;
// //            console.log(strPath + " - " + stat.mtime);
//         })
//         fileSearch.on("complete", function() {
//             (<any>matchCounter).should.equal(14);
//             done();
//         })
//         fileSearch.on("patherror", function(err, strPath) {
//             console.log("Error for Path " + strPath + " " + err)
//         })
//         fileSearch.on("error", function(err) {
//             console.log("Global Error " + err);
//         })
//         fileSearch.startSearch();
    });

//     it("should continue after an error on one of the files", function (done) {
//         var matchCounter = 0;
// //        this.timeout(100000);
//         // var node_find = getMockedfind();
//         var fileSearch = new finder({rootFolder : strFolderName, filterFunction: function(strPath, fsStat) {
//             if(strPath == "/first/second1")
//                 throw new Error("Contrived Error");
//             return true;}});
//         fileSearch.on("match", function(strPath, stat) {
//             matchCounter++;
// //            console.log(strPath + " - " + stat.mtime);
//         })
//         fileSearch.on("complete", function() {
//             (<any>matchCounter).should.equal(13);
//             done();
//         })
//         fileSearch.on("patherror", function(err, strPath) {
//             console.log("Error for Path " + strPath + " " + err)
//         })
//         fileSearch.on("error", function(err) {
//             console.log("Global Error " + err);
//         })
//         fileSearch.startSearch();
//     });

//     it("should return only new files when passed a date", function (done) {
//         var matchCounter = 0;
// //        this.timeout(100000);
//         // var node_find = getMockedfind();
//         var dateCompare = new Date("01 Jan 2013")
//         var fileSearch = new finder({rootFolder : strFolderName, fileModifiedDate: dateCompare});
//         fileSearch.on("match", function(strPath, stat) {
//             matchCounter++;
// //            console.log(strPath + " - " + stat.mtime);
//         })
//         fileSearch.on("complete", function() {
//             (<any>matchCounter).should.equal(4);
//             done();
//         })
//         fileSearch.on("patherror", function(err, strPath) {
//             console.log("Error for Path " + strPath + " " + err)
//         })
//         fileSearch.on("error", function(err) {
//             console.log("Global Error " + err);
//         })
//         fileSearch.startSearch();
//     });

    
});


function setupFilesystemMocks() {
    var oldFile = mockfs.file({
        content: 'old file',
        mtime: new Date('2012-01-01')
      });
    var newFile = mockfs.file({
        content: 'new file',
        mtime: new Date('2018-01-01')
      });
    
    mockfs({
        'first':{
            'firstlevel.new': newFile,
            'firstlevel.old': oldFile,
            'second1' : {
                'secondlevel.old' : oldFile,
                'secondlevel2.old' : oldFile,
                'third1' : {
                    'thirdlevel.new' : newFile,
                    'thirdlevel.old' : oldFile
                }
            },'second2' : {
                'secondlevel.old' : oldFile,
                'secondlevel.new' : newFile,
                'third2' : {
                    'thirdlevel.new' : newFile,
                    'thirdlevel.old' : oldFile
                }
            }
        }
    }, null);
    
}


