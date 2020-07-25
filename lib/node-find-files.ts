


import fs from "fs";
import async from "async";
import path from "path";
import util from "util";
import events from "events";

var EventEmitter = events.EventEmitter;

/***
 * This class recursively finds files that match the filter function passed to the constructor
 * An alternative constructor takes a fileModifiedDate and returns all files that have been modified since that date
 * this class emits a number of events
 * on "match" is emitted for every path that matches
 */
export class finder extends EventEmitter {


    constructor(options: {rootFolder: string; fileModifiedDate : Date;});
    constructor(options: {rootFolder: string; filterFunction : (strPath : string, fsStat : fs.Stats) => void;});
    constructor(public options: any) {
        super();
        if(options.fileModifiedDate)
            options.filterFunction = (strPath, fsStat) => {
                return (fsStat.mtime > options.fileModifiedDate);
            }

    }

    startSearch() {
        
        this.recurseFolder(this.options.rootFolder, (err) => {
            if(err){
                this.emit("error", err);
                return;
            }

            //console.log("This Should Call when everything is finished");

            this.emit("complete");
        });

    }

    private recurseFolder(strFolderName: string, folderCompleteCallback: (err: Error) => void){
        


        fs.readdir(strFolderName, (err, files) => {
            if(err){
                pathError(err, strFolderName);
                return folderCompleteCallback(err);
            }
            if(!files){
                return folderCompleteCallback(null); // This is just an empty folder

            }

            async.each(files,
                (file: string, callback: Function) =>{
                    try{
                        var strPath : string = path.join(strFolderName, file);

                    }
                    catch(e)
                    {
                        pathError(e, strPath);
                        return callback(null); // Don't return error to callback or we will miss other files in directory
                    }
                    fs.lstat(strPath, (err, stat) => {
                        if(err){
                            pathError(err, strPath);
                            return callback(null); // Don't return error to callback or we will miss other files in directory
                        }
                        if(!stat){
                            pathError(new Error("Could not get stat for file " + strPath), strPath);
                            return callback(null); // Don't return error to callback or we will miss other files in directory
                        }
                        if(stat.isDirectory()){
                            checkMatch(strPath, stat);
                            this.recurseFolder(strPath, (err) => {
                                if(err){
                                    pathError(err, strPath);
                                }
                                return callback(null);
                            });
                        }else
                        {
                            checkMatch(strPath, stat);

                            return callback(null);


                        }

                    })
                },
                (err) => {
                    if(err){
                        pathError(err, strFolderName);
                    }

//                    if(strFolderName.length < 20)
//                        console.log("finished " + strFolderName);
                    return folderCompleteCallback(err);
                }

            )

        })

        var pathError = (err, strPath) => {
            try{
                this.emit("patherror", err, strPath);
            }catch(e)
            {
                //Already emitted a path error and the handler failed must not throw error or other files will fail to process too
                this.emit("error", new Error("Error in path Error Handler" + e));
            }

        }

        var checkMatch = (strPath, stat) => {

            try {
                if (this.options.filterFunction(strPath, stat)) {
                    this.emit("match", strPath, stat);
                }

            }
            catch (e) {
                pathError(e, strPath);
            }
        }
    }
}
export default finder;
