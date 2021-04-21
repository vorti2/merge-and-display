# Performance measurement

see also https://nodejs.org/en/docs/guides/simple-profiling/
## Call performance measurement system from NodeJS

```
node --prof index.js test test-data/test-data-005.cli
```

## Processs the resulting file

Example of process the `isolate-0x108008000-33657-v8.log` (as a result of the previous step):

```
node --prof-process isolate-0x108008000-33657-v8.log > processed-isolate-0x108008000-33657-v8.txt
```

* open the file (in this case `processed-isolate-0x108008000-33657-v8.txt`) in a text editor