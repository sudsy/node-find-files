"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const fs_1 = __importDefault(require("fs"));
const async_1 = __importDefault(require("async"));
const path_1 = __importDefault(require("path"));
const events_1 = __importDefault(require("events"));
var EventEmitter = events_1.default.EventEmitter;
/***
 * This class recursively finds files that match the filter function passed to the constructor
 * An alternative constructor takes a fileModifiedDate and returns all files that have been modified since that date
 * this class emits a number of events
 * on "match" is emitted for every path that matches
 */
class finder extends EventEmitter {
    constructor(options) {
        super();
        if (options.fileModifiedDate) {
            options.filterFunction = (strPath, fsStat) => {
                return (fsStat.mtime > options.fileModifiedDate);
            };
        }
        if (!options.filterFunction) {
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
    recurseFolder(strFolderName) {
        fs_1.default.readdir(strFolderName, (err, files) => {
            if (err) {
                this.onPathError(err, strFolderName);
            }
            if (!files) {
                return;
            }
            if (!this.queue) {
                this.queue = async_1.default.queue((strPath, callback) => {
                    this.onFileFound(strPath, callback);
                }, 1);
                this.queue.drain = () => __awaiter(this, void 0, void 0, function* () {
                    this.emit("complete");
                });
            }
            files.forEach(file => {
                try {
                    var strPath = path_1.default.join(strFolderName, file);
                    this.queue.push(strPath, (err, result) => {
                        if (err) {
                            this.onPathError(err, strPath);
                        }
                    });
                }
                catch (e) {
                    this.onPathError(e, strPath);
                    // Don't throw error to callback or we will miss other files in directory
                }
            });
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
        });
    }
    onFileFound(strPath, callback) {
        try {
            fs_1.default.lstat(strPath, (err, stat) => {
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
        }
        catch (err) {
            callback(err);
        }
    }
    checkMatch(strPath, stat) {
        try {
            if (this.options.filterFunction(strPath, stat)) {
                this.emit("match", strPath, stat);
            }
        }
        catch (e) {
            this.onPathError(e, strPath);
        }
    }
    onPathError(err, strPath) {
        try {
            this.emit("patherror", err, strPath);
        }
        catch (e) {
            //Already emitted a path error and the handler failed must not throw error or other files will fail to process too
            this.emit("error", new Error("Error in path Error Handler" + e));
        }
    }
}
module.exports = finder;
//# sourceMappingURL=node-find-files.js.map