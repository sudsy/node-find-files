
import mock from 'mock-fs'
import { finder } from "../lib/node-find-files";


var strFolderName: string = "/first";





test("should return all files and folders when there is no filter", done => {

    var matchCounter = 0;
    setupFilesystemMocks();


    var fileSearch = new finder({ rootFolder: strFolderName });

    fileSearch.on("match", function (strPath, stat) {
        matchCounter++;
        //            console.log(strPath + " - " + stat.mtime);
    })
    fileSearch.on("complete", function () {
        expect(matchCounter).toBe(14);
        mock.restore();
        done();
    })
    fileSearch.on("patherror", function (err, strPath) {
        mock.restore();
        // console.log("Error for Path " + strPath + " " + err);
        done(err);

    })
    fileSearch.on("error", function (err) {
        mock.restore();
        // console.log("Global Error " + err);
        done(err);
    })
    fileSearch.startSearch();
});

test("should continue after an error on one of the files", done => {
    var matchCounter = 0;

    setupFilesystemMocks();
    var fileSearch = new finder({
        rootFolder: strFolderName, filterFunction: function (strPath, fsStat) {
            if (strPath == "/first/second1")
                throw new Error("Contrived Error");
            return true;
        }
    });
    fileSearch.on("match", function (strPath, stat) {
        matchCounter++;
        //            console.log(strPath + " - " + stat.mtime);
    })
    fileSearch.on("complete", function () {
        mock.restore();
        expect(matchCounter).toBe(13);
        done();
    })
    fileSearch.on("patherror", function (err, strPath) {
        // console.log("Error for Path " + strPath + " " + err)
    })
    fileSearch.on("error", function (err) {
        mock.restore();
        console.log("Global Error " + err);
        done(err);
    })
    fileSearch.startSearch();
});

test("should return only new files when passed a date", done => {
    var matchCounter = 0;
    //        this.timeout(100000);
    // var node_find = getMockedfind();
    setupFilesystemMocks();
    var dateCompare = new Date("01 Jan 2013")
    var fileSearch = new finder({ rootFolder: strFolderName, fileModifiedDate: dateCompare });
    fileSearch.on("match", function (strPath, stat) {
        matchCounter++;
        //            console.log(strPath + " - " + stat.mtime);
    })
    fileSearch.on("complete", function () {
        mock.restore();
        expect(matchCounter).toBe(8);
        done();
    })
    fileSearch.on("patherror", function (err, strPath) {
        //console.log("Error for Path " + strPath + " " + err)
    })
    fileSearch.on("error", function (err) {
        mock.restore();
        console.log("Global Error " + err);
        done(err);
    })
    fileSearch.startSearch();
});





function setupFilesystemMocks() {
    var oldFile = mock.file({
        content: 'old file',
        mtime: new Date('2012-01-01')
    });
    var newFile = mock.file({
        content: 'new file',
        mtime: new Date('2018-01-01')
    });

    mock({
        '/first': {
            'firstlevel.new': newFile,
            'firstlevel.old': oldFile,
            'second1': {
                'secondlevel.old': oldFile,
                'secondlevel2.old': oldFile,
                'third1': {
                    'thirdlevel.new': newFile,
                    'thirdlevel.old': oldFile
                }
            }, 'second2': {
                'secondlevel.old': oldFile,
                'secondlevel.new': newFile,
                'third2': {
                    'thirdlevel.new': newFile,
                    'thirdlevel.old': oldFile
                }
            }
        }
    }, null);

}


