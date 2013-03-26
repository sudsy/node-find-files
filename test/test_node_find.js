var node_find = require("../node_find")
var strFolderName = "/Users/bensudbury/";
var newFilesSinceDate = new Date();
describe("GetNewFiles", function () {
    it("should return the new files only", function (done) {
        this.timeout(100000);
        var fileSearch = new node_find.finder({
            rootFolder: strFolderName,
            filesSinceDate: newFilesSinceDate
        });
        fileSearch.on("match", function (strPath, stat) {
            console.log(strPath + " - " + stat.mtime);
        });
        fileSearch.on("complete", function () {
            done();
        });
        fileSearch.on("patherror", function (err, strPath) {
            console.log("Error for Path " + strPath + " " + err);
        });
        fileSearch.on("error", function (err) {
            console.log("Global Error " + err);
        });
        fileSearch.startSearch();
    });
});
//@ sourceMappingURL=test_node_find.js.map
