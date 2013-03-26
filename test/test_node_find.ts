/**
 * Created with JetBrains WebStorm.
 * User: bensudbury
 * Date: 25/03/13
 * Time: 9:43 AM
 * To change this template use File | Settings | File Templates.
 */
///<reference path='../definitions/mocha.d.ts'/>
import node_find = module("../node_find");

var strFolderName : string = "/Users/bensudbury/";
var newFilesSinceDate : Date = new Date();


describe("GetNewFiles", function() {
    it("should return the new files only", function (done) {
        this.timeout(100000);
        var fileSearch = new node_find.finder({rootFolder : strFolderName, filesSinceDate: newFilesSinceDate});
        fileSearch.on("match", function(strPath, stat) {
            console.log(strPath + " - " + stat.mtime);
        })
        fileSearch.on("complete", function() {
            done();
        })
        fileSearch.on("patherror", function(err, strPath) {
            console.log("Error for Path " + strPath + " " + err)
        })
        fileSearch.on("error", function(err) {
            console.log("Global Error " + err);
        })
        fileSearch.startSearch();
    });
});

//TODO: Test to make sure it can move on from a path error
//TODO: Test to make sure it returns all files with no filter function
//TODO: Test to make sure it returns folder paths that match expression
//TODO: make sure it returns the expected number of files or folders after a particular date