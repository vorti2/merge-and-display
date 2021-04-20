#!/usr/bin/env node

'use strict';

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs')
const path = require( "path" )


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
      const data = getFileContent(argv.filename, argv)
      parse(data)
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



function getFileContent (fileName, argv) {

  try {
    const absolutePath = path.normalize( fileName );
    const data = fs.readFileSync(absolutePath, 'utf8')
    if (argv.verbose)
      console.log(`Data read from file ${fileName}: ${data}`)
    return data
  } catch (err) {
    console.error(err)
  }
}

function parse(data) {
  // is data real JSON?

  const parsed = JSON.parse(data)
  const arr = [];
  for (var i=0; i < parsed.length; i++) {
    var item = [parsed[i][0], parsed[i][1]];
    arr.push(item);
  }

  console.log(`item = >${JSON.stringify(arr)}<`)

}





main()

