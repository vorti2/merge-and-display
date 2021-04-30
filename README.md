# merge-and-display

Nodejs program, that solves the following task:

Implement a function MERGE which receives a list of intervals _given as JSON array_ and returns a list of intervals as a result. In the result all overlapping intervals shall be remembered. All non-overlapping intervals remain untouched.

Example:

```
Input: [25,30] [2,19] [14, 23] [4,8]
```

```
Output: [2,23] [25,30]
```


## Prerequisites

* Nodejs 15.x.y installation (tested with v15.14.0 on MacOS)

## Installation

Install the used libs with following command:

```
npm i
```

## Help

```
node index.js --help
```

## Start

```
node index.js <interactive | test>
```

## Example call with test file

```
node index.js test test-data/test-data-003.cli
```

## Example call with interactive mode

```
node index.js interactive
```

## Tips & Tricks

* the input (in JSON) used in the this program can be incomplete like `[25,30] [2,19]   [14,23] [4,8]]`, but not (for example) `25,30] [2,19] [14,23] [4,8]]`


## Ideas for further development

* test with random count of tupels
* docker container
* read in and execute _all_ test files
