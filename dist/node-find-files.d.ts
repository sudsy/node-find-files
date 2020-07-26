/// <reference types="node" />
import fs from "fs";
import events from "events";
declare var EventEmitter: typeof events.EventEmitter;
declare type FinderOptions = {
    rootFolder?: string;
    fileModifiedDate?: Date;
    filterFunction: (strPath: string, fsStat: fs.Stats) => boolean;
};
/***
 * This class recursively finds files that match the filter function passed to the constructor
 * An alternative constructor takes a fileModifiedDate and returns all files that have been modified since that date
 * this class emits a number of events
 * on "match" is emitted for every path that matches
 */
declare class finder extends EventEmitter {
    options: Partial<FinderOptions>;
    constructor(options: Partial<FinderOptions>);
    startSearch(): void;
    private recurseFolder;
    private onFileFound;
    private checkMatch;
    private onPathError;
}
export = finder;
