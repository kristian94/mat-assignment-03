const Set = require('./set');
const INFINITY = '$'


const z = new Set([0, '...']);
const n = new Set([1, '...']);
const a = new Set([1, '...', 100]);
const b = new Set([15, '...', 50]);
const c = new Set([1, 2, 3, 4]);
const d = new Set([1, '...', 5, 20, '...', 30]);
const e = new Set([1, '...', 20]);
const f = new Set([10, '...', 30]);

console.log(`67 is a member of n: ${n.isMember(67)}`);
console.log(`0 is a member of n: ${n.isMember(0)}`);
console.log(`55 is a member of a: ${a.isMember(55)}`);
console.log('');

console.log(`intersection of `);
console.log(`e ${e}`);
console.log(`and`);
console.log(`f ${f}`);
console.log('===========');
console.log(`${e.intersect(f)}`);
console.log(``);
console.log(``);

console.log(`union between`);
console.log(`c (${c})`);
console.log(`and`);
console.log(`b (${b})`);
console.log('===========');
console.log(`${c.union(b)}`);
console.log(``);
console.log(``);

console.log(`difference between`);
console.log(`a (${a})`);
console.log(`and`);
console.log(`d (${d})`);
console.log('===========');
console.log(`${a.difference(d)}`);
console.log(``);
console.log(``);


