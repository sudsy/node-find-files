#node-find-files

This is a quick utility I wrote for recursively searching a directory structure and finding files and directories that match a particular spec.

##What's Different About it

Similar projects that I was able to find processed the whole directory tree and then handed a set of results back at the end. This module inherits from EventEmitter so it will begin streaming results as soon as the first one is found.

My initial use case was to find files modified since a particular date, but you can also pass a filter function to return files that match any criteria you can find on the fs.stat object in node.

Usage:

