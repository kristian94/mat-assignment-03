
// example: const Z = new Set('{...}', {naturalOnly: false});
//          const a = new Set('{1, 2, 3}) --> naturalOnly = true;
//


function Set(array, options = {}){
    if(!array){
        throw new Error('A set cannot be defined without at string eg "{1, 2, 3, ...}"')
    }
    this.array = array;
    this.naturalOnly = options.naturalOnly || this.inferNaturalOnly();
    this.hasUpperBound = this.inferBound('upper');
    this.hasLowerBound = this.inferBound('lower');
};

Set.prototype.inferNaturalOnly = function(){
    let naturalOnly = true;
    this.array.forEach(function(element){
        if(!isNaN(element)){
            const index = Number(element).toString().indexOf('.');
            if(index !== -1){
                naturalOnly = false;
            }
        }
    });
    return naturalOnly;
};

Set.prototype.inferBound = function(direction){
    const isUpper = direction === 'upper';

    const index =
        isUpper ? this.array.length - 1 :
                  0;

    const lastElement = this.array[index];

    return !(lastElement === '...');
};

Set.prototype.isSubset = function(array){
    for(let i = 0; i < array.length; i++){
        const el = array[i];
        if(!this.contains(el)) return false;
    }
    return true;
};

Set.prototype.union = function(input){
    const union = [];
    const inputIsSet = (input instanceof Set);
    const array = inputIsSet ? input.array : input;
    for(let i = 0; i < array.length; i++){
        const el = array[i];
        if(this.contains(el)) union.push(el);
    }
    return union;
};

Set.prototype.intersect = function(input){
    const intersect = this.array.slice(0);
    const inputIsSet = (input instanceof Set);
    const array = inputIsSet ? input.array : input;
    for(let i = 0; i < array.length; i++){
        const el = array[i];
        if(!this.contains(el)) intersect.push(el);
    }
    return intersect;
};

Set.prototype.contains = function(input, _array){
    const self = this;
    const array = _array || this.array;
    const inputIsArray = Array.isArray(input);

    return (arrayContains(array, input));


    function arrayContains(array, input){
        for(let i = 0; i < array.length; i++){
            const element = array[i];
            const elementIsDots = element === '...';
            if(elementIsDots){

                const nextElement = arrayNextOrBlank(array, i, 1);
                const prevElement = arrayNextOrBlank(array, i, -1);
                const isValidNumber = self.isValidNumber(input);

                const match =
                    (!isValidNumber)                    ? false :
                    (!!nextElement && !prevElement)     ? (input < nextElement) :
                    (!nextElement && !!prevElement)     ? (input > prevElement) :
                    (!nextElement && !prevElement)      ? (input)
                                                        : (input > prevElement && input < nextElement);

                if(match) return true;
            }else{
                if(input.toString() === element.toString()) return true;
            }
        }
        return false;
    }

    function arrayNextOrBlank(array, indexIn, modifier){
        const index = indexIn + modifier;
        const isWithinBounds = index >= 0 && index < array.length;
        return isWithinBounds ? array[index] : '';
    }
};

Set.prototype.isValidNumber = function(number){
    if(this.naturalOnly){
        return Number.isInteger(number);
    }
    return true;
};



const a = new Set([1, [2, 3, 4], 5]);
const b = new Set([1, '...', 100]);
const n = new Set([1, '...']);
const z = new Set(['...'], {naturalOnly: false});

console.log('following should be true:');

// contains
console.log(a.contains([2, 3, 4]));
console.log(b.contains(5));
console.log(b.contains(77));
console.log(n.contains(55));
console.log(n.contains(1200));

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
console.log(n.contains(0));

// isSubset
console.log(b.isSubset([301, 404, 550]));

console.log(' ');
console.log('==========================');
console.log('union and intersect');

const x = new Set([1, 2, 3, 4, 5, 6, 7, 8]);
const y = new Set([5, 6, 7, 8, 9, 10, 11, 12]);

console.log(x.union(y));
console.log(x.intersect(y));


