// const parsed = JSON.parse('[{"name":"john", "place":"usa", "phone":"12345"},{"name":"jim", "place":"canada", "phone":"54321"}]');



const parsed = JSON.parse('[[25,30],[2,19],[14, 23],[4,8]]');

const arr = [];
for (var i=0; i < parsed.length; i++) {
   var item = [parsed[i][0], parsed[i][1]];
   arr.push(item);
}

console.log(`item = >${JSON.stringify(arr)}<`);
