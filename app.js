const Set = require('./set');

const a = new Set([1, [2, 3, 4], 5]);
const b = new Set([1, '...', 100]);
const z = new Set([0, '...']);
const n = new Set([1, '...']);
const r = new Set(['...'], {naturalOnly: false});

console.log('following should be true:');

// contains
console.log(a.contains([2, 3, 4]));
console.log(b.contains(5));
console.log(b.contains(77));
console.log(r.contains(55));
console.log(r.contains(1200));
console.log(r.contains(1.45));

// isSubset
console.log(b.isSubset([3, 4, 5]));

console.log(' ');
console.log('==========================');
console.log('following should be false:');

// contains
console.log(a.contains(3));
console.log(b.contains(101));
console.log(b.contains(-1));
console.log(n.contains(1.5));
console.log(r.contains(0));

// isSubset
console.log(b.isSubset([301, 404, 550]));

console.log(' ');
console.log('==========================');
console.log('union, intersect, difference');

const x = new Set([1, 2, 3, 4, 5, 6, 7, 8]);
const y = new Set([5, 6, 7, 8, 9, 10, 11, 12]);

console.log(x.union(y));
console.log(x.intersect(y));
console.log(x.difference(y));




