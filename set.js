function Set(array, options = {}){
    if(!array){
        throw new Error('A set cannot be defined without at string eg "{1, 2, 3, ...}"')
    }
    this.array = array;
    // this.naturalOnly = options.naturalOnly || ;
    this.naturalOnly = !nullOrUndef(options.naturalOnly) ? options.naturalOnly : this.inferNaturalOnly();
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
    const array = arrayOrSetArray(input);
    for(let i = 0; i < array.length; i++){
        const el = array[i];
        if(this.contains(el)) union.push(el);
    }
    return union;
};

Set.prototype.intersect = function(input){
    const intersect = this.array.slice(0);
    const array = arrayOrSetArray(input);
    for(let i = 0; i < array.length; i++){
        const el = array[i];
        if(!this.contains(el)) intersect.push(el);
    }
    return intersect;
};

Set.prototype.difference = function(input){
    const difference = [];
    const inputIsSet = (input instanceof Set);
    const inputSet = inputIsSet ? input : new Set(input);
    const array = this.array;
    for(let i = 0; i < array.length; i++){
        const el = array[i];
        if(!inputSet.contains(el)) difference.push(el);
    }
    return difference;
};

Set.prototype.contains = function(input, _array){
    const self = this;
    const array = _array || this.array;
    // const inputIsArray = Array.isArray(input);

    return (arrayContains.call(this, array, input));
};

function arrayContains(array, input){
    for(let i = 0; i < array.length; i++){
        const element = array[i];
        const elementIsDots = element === '...';
        if(elementIsDots){

            // const inputIsDots = input = '...'; // do something if input is dots??

            const nextElement = arrayNextOrBlank(array, i, 1);
            const prevElement = arrayNextOrBlank(array, i, -1);
            const isValidNumber = this.isValidNumber(input);

            const match =
                (!isValidNumber)                    ? false :
                    (!!nextElement && !prevElement)     ? (input < nextElement) :
                        (!nextElement && !!prevElement)     ? (input > prevElement) :
                            (!nextElement && !prevElement)      ? !!(input)
                                : (input > prevElement && input < nextElement);

            if(match) return true;
        }else{
            if(input.toString() === element.toString()) return true;
        }
    }
    return false;
}

function arrayOrSetArray(input){
    const inputIsSet = (input instanceof Set);
    return inputIsSet ? input.array : input;
}

function nullOrUndef(input){
    return input === null || input === undefined;
}

function arrayNextOrBlank(array, indexIn, modifier){
    const index = indexIn + modifier;
    const isWithinBounds = index >= 0 && index < array.length;
    return isWithinBounds ? array[index] : '';
}

Set.prototype.isValidNumber = function(number){
    if(this.naturalOnly){
        return Number.isInteger(number);
    }
    return true;
};

module.exports = Set;