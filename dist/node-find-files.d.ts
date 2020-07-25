/// <reference types="node" />
import fs from "fs";
import events from "events";
declare var EventEmitter: typeof events.EventEmitter;
/***
 * This class recursively finds files that match the filter function passed to the constructor
 * An alternative constructor takes a fileModifiedDate and returns all files that have been modified since that date
 * this class emits a number of events
 * on "match" is emitted for every path that matches
 */
export declare class finder extends EventEmitter {
    options: any;
    constructor(options: {
        rootFolder: string;
        fileModifiedDate: Date;
    });
    constructor(options: {
        rootFolder: string;
        filterFunction: (strPath: string, fsStat: fs.Stats) => void;
    });
    startSearch(): void;
    private recurseFolder;
}
export default finder;
