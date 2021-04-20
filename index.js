#!/usr/bin/env node

'use strict';

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs')
const path = require( "path" )
const jsonrepair = require('jsonrepair')

function main() {
  yargs(hideBin(process.argv))
    .command('test [filename]', 'execute merge with test-data', (yargs) => {
      yargs
        .positional('test', {
          describe: 'read test-data from file <filename>',
        })
    }, (argv) => {
      if (argv.verbose) console.info(`use as input: ${argv.filename}`)
      // serve(argv.port)
      const data = getFileContent(argv)
      let jsonArray = parse(data, argv)
      const sortedArray = sort(jsonArray, argv)
      if (argv.verbose)
        console.log(`item = >${JSON.stringify(sortedArray)}<`)

      const mergedArray = mergeOverlabed(sortedArray, argv)
    })
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      description: 'Run with verbose logging'
    })
    .option('help', {
      alias: 'h',
      type: 'boolean',
      description: 'Help for usage'
    })
    .argv
}



function getFileContent (argv) {

  try {
    const absolutePath = path.normalize( argv.filename );
    let jsonContent = fs.readFileSync(absolutePath, 'utf8')
    if (argv.verbose) {
      console.log(`Data read from file ${argv.filename}: ${jsonContent}`)
    }

    // make real json array
    jsonContent = jsonContent.trim()
    // following is needed because jsonrepair has problems with opening brackets
    if ( jsonContent[0] === '[' && jsonContent[1] !== '[') {
      jsonContent = '[' + jsonContent;
    }

    const repaired = jsonrepair(jsonContent)
    if (argv.verbose) {
       console.log(`after jsonrepair: ${repaired}`)
    }
    // return data
    return repaired
  } catch (err) {
    console.error(err)
  }
}

function parse(data, argv) {
  // is data real JSON?

  const parsed = JSON.parse(data)
  const arr = [];
  for (var i=0; i < parsed.length; i++) {
    var item = [parsed[i][0], parsed[i][1]];
    arr.push(item);
  }
  return arr
}


function sort(jsonArray, argv) {
  function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const firstA = a[0];
    const firstB = b[0];

    let comparison = 0;
    if (firstA > firstB) {
      comparison = 1;
    } else if (firstA < firstB) {
      comparison = -1;
    }
    return comparison;
  }

  jsonArray.sort(compare)

  return jsonArray
}

function mergeOverlapped(jsonArray, argv) {
    return jsonArray
}


main()

