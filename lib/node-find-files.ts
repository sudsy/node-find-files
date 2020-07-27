


import os from "os";
import fs from "fs";
import async from "async";
import path from "path";
import events from "events";

var EventEmitter = events.EventEmitter;

type FinderOptions = {
    rootFolder?: string,
    fileModifiedDate?: Date,
    concurrencyLimit?: number,
    filterFunction: (strPath : string, fsStat : fs.Stats) => boolean
 }
/***
 * This class recursively finds files that match the filter function passed to the constructor
 * An alternative constructor takes a fileModifiedDate and returns all files that have been modified since that date
 * this class emits a number of events
 * on "match" is emitted for every path that matches
 */
class finder extends EventEmitter {

    options: Partial<FinderOptions>;
    queue: async.AsyncQueue<string>;

    constructor(options: Partial<FinderOptions>) {
        super();
        if(options.fileModifiedDate){
            options.filterFunction = (strPath, fsStat) => {
                return (fsStat.mtime > options.fileModifiedDate);
            }
        }
        if(!options.filterFunction){
            options.filterFunction = () => true;
        }
        // if(!options.concurrencyLimit){
        //     options.concurrencyLimit = os.cpus().length;
        // }
        this.options = options;

    }

    startSearch() {
        
        this.recurseFolder(this.options.rootFolder);

    }

    private recurseFolder(strFolderName: string){
        


        fs.readdir(strFolderName, (err, files) => {
            if(err){
                this.onPathError(err, strFolderName);
            }
            if(!files){
                return;
            }
            
            if(!this.queue){
                this.queue = async.queue((strPath, callback) => {
                    this.onFileFound(strPath, callback);
                }, 1);
                this.queue.drain = async () => {
                    this.emit("complete");
                }
            }

            files.forEach(file => {
                try{
                    var strPath : string = path.join(strFolderName, file);
                    this.queue.push(strPath, (err, result) => {
                        if(err){
                            this.onPathError(err, strPath);
                        }
                    });
                }
                catch(e)
                {
                    this.onPathError(e, strPath);
                    // Don't throw error to callback or we will miss other files in directory
                }
            })

//             async.each(files,
//                 (file: string, callback: Function) =>{
//                     try{
//                         var strPath : string = path.join(strFolderName, file);

//                     }
//                     catch(e)
//                     {
//                         this.onPathError(e, strPath);
//                         return callback(null); // Don't return error to callback or we will miss other files in directory
//                     }
                    
//                     this.onFileFound(strPath, callback);
//                 },
//                 (err) => {
//                     if(err){
//                         this.onPathError(err, strFolderName);
//                     }

// //                    if(strFolderName.length < 20)
// //                        console.log("finished " + strFolderName);
//                     return folderCompleteCallback(err);
//                 }

//             )

        })

        
    }

    private onFileFound(strPath: string, callback: Function) {
        try{
            fs.lstat(strPath, (err, stat) => {
                if (err) {
                    this.onPathError(err, strPath);
                    return callback(null); // Don't return error to callback or we will miss other files in directory
                }
                if (!stat) {
                    this.onPathError(new Error("Could not get stat for file " + strPath), strPath);
                    return callback(null); // Don't return error to callback or we will miss other files in directory
                }
                if (stat.isDirectory()) {
                    this.checkMatch(strPath, stat);
                    this.recurseFolder(strPath);
                    return callback(null);
                }
                else {
                    this.checkMatch(strPath, stat);
    
                    return callback(null);
    
    
                }
    
            });
        }catch(err){
            callback(err);
        }
        
    }

    private checkMatch(strPath, stat){

        try {
            if (this.options.filterFunction(strPath, stat)) {
                this.emit("match", strPath, stat);
            }

        }
        catch (e) {
            this.onPathError(e, strPath);
        }
    }

    private onPathError(err, strPath){
        try{
            this.emit("patherror", err, strPath);
        }catch(e)
        {
            //Already emitted a path error and the handler failed must not throw error or other files will fail to process too
            this.emit("error", new Error("Error in path Error Handler" + e));
        }

    }
}
export = finder;

