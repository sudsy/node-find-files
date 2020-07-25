"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finder = void 0;
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
        this.options = options;
        if (options.fileModifiedDate)
            options.filterFunction = function (strPath, fsStat) {
                return (fsStat.mtime > options.fileModifiedDate) ? true : false;
            };
    }
    startSearch() {
        this.recurseFolder(this.options.rootFolder, (err) => {
            if (err) {
                this.emit("error", err);
                return;
            }
            //console.log("This Should Call when everything is finished");
            this.emit("complete");
        });
    }
    recurseFolder(strFolderName, folderCompleteCallback) {
        fs_1.default.readdir(strFolderName, (err, files) => {
            if (err) {
                pathError(err, strFolderName);
                return folderCompleteCallback(err);
            }
            if (!files) {
                return folderCompleteCallback(null); // This is just an empty folder
            }
            async_1.default.each(files, function (file, callback) {
                try {
                    var strPath = path_1.default.join(strFolderName, file);
                }
                catch (e) {
                    pathError(e, strPath);
                    return callback(null); // Don't return error to callback or we will miss other files in directory
                }
                fs_1.default.lstat(strPath, function (err, stat) {
                    if (err) {
                        pathError(err, strPath);
                        return callback(null); // Don't return error to callback or we will miss other files in directory
                    }
                    if (!stat) {
                        pathError(new Error("Could not get stat for file " + strPath), strPath);
                        return callback(null); // Don't return error to callback or we will miss other files in directory
                    }
                    if (stat.isDirectory()) {
                        checkMatch(strPath, stat);
                        this.recurseFolder(strPath, function (err) {
                            if (err) {
                                pathError(err, strPath);
                            }
                            return callback(null);
                        });
                    }
                    else {
                        checkMatch(strPath, stat);
                        return callback(null);
                    }
                });
            }, function onComplete(err) {
                if (err) {
                    pathError(err, strFolderName);
                }
                //                    if(strFolderName.length < 20)
                //                        console.log("finished " + strFolderName);
                return folderCompleteCallback(err);
            });
        });
        var pathError = (err, strPath) => {
            try {
                this.emit("patherror", err, strPath);
            }
            catch (e) {
                //Already emitted a path error and the handler failed must not throw error or other files will fail to process too
                this.emit("error", new Error("Error in path Error Handler" + e));
            }
        };
        function checkMatch(strPath, stat) {
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
exports.finder = finder;
exports.default = finder;
//# sourceMappingURL=node-find-files.js.map