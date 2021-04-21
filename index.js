'use strict';

//7 Used libs
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const fs = require('fs')
const path = require( "path" )
const jsonrepair = require('jsonrepair');
const { strict } = require('yargs');
const reader = require('readline-sync');

// main function with call of yargc for argument extraction and CLI help
function main() {
  // call of yargs which call `hidebin` (helper function for slice the argv)
  yargs(hideBin(process.argv))
    .command('test [filename]', 'execute merge with data read from <filename>', (yargs) => {
      yargs
        .positional('test', {
          describe: 'read data from <filename>',
        })
    }, (argv) => {
      // main calls of the pogram
      if (argv.verbose) console.info(`use as input: ${argv.filename}`)
      // read in the data from the file `filename`
      const data = getFileContent(argv)
      // parse the data (with possibility to "correct" the JSON format)
      let jsonArray = parse(data, argv)
      console.log(`Original: >${JSON.stringify(jsonArray)}<`)
      // sort the array
      const sortedArray = sort(jsonArray, argv)
      // merge the array
      const mergedArray = merge(sortedArray, argv);
      console.log(`Result after merge: >${JSON.stringify(mergedArray)}<`)
      if (argv.memory) {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${used} MB`);
      }
    })
    .command('interactive', 'execute merge with JSON data read from CLI', (yargs) => {
      yargs
        .positional('interactive', {
          describe: 'read JSON data from CLI',
        })
    }, (argv) => {
      // main calls of the pogram
      if (argv.verbose) {
        console.info(`interactive mode, read from CLI ....`)
      }
      // read in the data from the CLI
      const data = getDataFromCLI(argv)
      // parse the data (with possibility to "correct" the JSON format)
      let jsonArray = parse(data, argv)
      console.log(`Original: >${JSON.stringify(jsonArray)}<`)
      // sort the array
      const sortedArray = sort(jsonArray, argv)
      // merge the array
      const mergedArray = merge(sortedArray, argv);
      console.log(`Result after merge: >${JSON.stringify(mergedArray)}<`)
      if (argv.memory) {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${used} MB`);
      }
    })
    // optional parameters for the CLI use
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
    .option('memory', {
      alias: 'm',
      type: 'boolean',
      description: 'Memory usage of the complete program'
    })
    .argv
}

//
// getDataFromCLI: read in the data from the CLI
//
// Parmeters:
// argv: array of program arguments
//
function getDataFromCLI(argv) {

  try {
    const jsonContent = reader.question(`Get in the tuples (in JSON array notation like "[[25,30],[2,19],[14,23],[4,8]]"))\n`)
    if (argv.verbose) {
      console.log(`Data read from file CLI: ${jsonContent}`)
    }
    return processReadData(jsonContent, argv)
  } catch (err) {
    console.error(err)
  }
}


//
// getFileContent: read in the data from the file `filename`
//
// Parmeters:
// argv: array of program arguments
//
function getFileContent(argv) {

  try {
    const absolutePath = path.normalize( argv.filename );
    let jsonContent = fs.readFileSync(absolutePath, 'utf8')
    if (argv.verbose) {
      console.log(`Data read from file ${argv.filename}: ${jsonContent}`)
    }
    return processReadData(jsonContent, argv)
  } catch (err) {
    console.error(err)
  }

}

function processReadData(data, argv) {
    // make real json array, no empty space before or after the string
    data = data.trim()
    // following is needed because jsonrepair has problems with opening brackets
    if ( data[0] === '[' && data[1] !== '[') {
      data = '[' + data;
    }

    // use `jsonrepair` to correct JSON (see https://www.npmjs.com/package/jsonrepair)
    const repaired = jsonrepair(data)
    if (argv.verbose) {
       console.log(`after jsonrepair: ${JSON.stringify(repaired)}`)
    }
    // return data
    return repaired
}



//
// parse: read in the data from the file `filename`
//
// Parmeters:
// data: string content
// argv: array of program arguments
//
function parse(data, argv) {
  // is data real JSON?

  const parsed = JSON.parse(data)
  const arr = [];
  for (var i=0; i < parsed.length; i++) {
    var item = [parsed[i][0], parsed[i][1]];
    arr.push(item);
  }
  if (argv.verbose) {
    console.log(`after parse: ${JSON.stringify(arr)}`)
  }
  return arr
}


//
// sort: sort an array of tuples
//
// Parmeters:
// jsonArray: array in JSON format
// argv: array of program arguments
//
function sort(jsonArray, argv) {
  // function `compare` compares the two valus of a tuple
  // and return 1 if value A > B, -1 if value A < B
  function compare(a, b) {
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

  // use the defined function in sorting the array
  jsonArray.sort(compare)

  if (argv.verbose) {
    console.log(`after sort: ${JSON.stringify(jsonArray)}`)
  }
  return jsonArray
}


// merge funnction original from  https://stackoverflow.com/a/26391774
function merge(ranges, argv) {
  var result = [], last;

  ranges.forEach(function (r) {
    if (!last || r[0] > last[1])
        result.push(last = r);
    else if (r[1] > last[1])
        last[1] = r[1];
  });

  if (argv.verbose) {
    console.log(`after merge: ${JSON.stringify(result)}`)
  }

  return result;
}

main()

