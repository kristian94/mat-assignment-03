const INFINITY = '$'

function Range(min, max){
    min = valOrInf(min);
    max = valOrInf(max);
    this.min = min || max || undefined;
    this.max = max || min || undefined;
}

// input becomes the new max of the range
Range.prototype.tryPush = function(input){
    input = valOrInf(input);
    if(!this.min && !this.max){
        this.min = input;
        this.max = input;
        return true;
    }else if(input !== INFINITY && input > this.max + 1){
        return false;
    }else{
        this.max = input;
        return true;
    }
};

Range.prototype.tryMerge = function(inputRange){
    if(!this.canMerge(inputRange)) return false;
    const min = this.min;
    const max = this.max;
    const inputMin = inputRange.min;
    const inputMax = inputRange.max;
    const newMin = minOrInf(min, inputMin);
    const newMax = maxOrInf(max, inputMax);

    return new Range(newMin, newMax);
};

Range.prototype.difference = function(inputRange){
    const min = this.min;
    const max = this.max;
    const inputMin = inputRange.min;
    const inputMax = inputRange.max;

    return  inputRange.isTrueInf()              ? [] :
            !this.canIntersect(inputRange)      ? this :
            !inputRange.hasLowerBound           ? [new Range(inputMax+1, max)] :
            !inputRange.hasUpperBound           ? [new Range(min, inputMin-1)] :
            (inputMin > min && inputMax < max)  ? [new Range(min, inputMin-1), new Range(inputMax+1, max)] :
            (inputMin <= min)                   ? [new Range(inputMax+1, max)] :
                                                  [new Range(min, inputMin-1)];
};



Range.prototype.intersect = function(inputRange){
    if(this.canIntersect(inputRange)){
        const min = this.min;
        const max = this.max;
        const inputMin = inputRange.min;
        const inputMax = inputRange.max;

        let intersectMin = maxNoInf(min, inputMin);
        let intersectMax = minNoInf(max, inputMax);

        return new Range(intersectMin, intersectMax);
    }else{
        return false;
    }
};

Range.prototype.canIntersect = function(inputRange){
    const min = this.min;
    const max = this.max;
    const inputMin = inputRange.min;
    const inputMax = inputRange.max;

    const highestMin = maxNoInf(min, inputMin);
    const lowestMax = minNoInf(max, inputMax);

    return  (min === INFINITY && inputMin === INFINITY)
        ||  (max === INFINITY && inputMax === INFINITY)
        ||  (highestMin - lowestMax <= 0)
};

Range.prototype.canMerge = function(inputRange){
    const min = this.min;
    const max = this.max;
    const inputMin = inputRange.min;
    const inputMax = inputRange.max;

    const highestMin = maxOrInf(min, inputMin);
    const lowestMax = minOrInf(max, inputMax);

    return  (min === INFINITY && inputMin === INFINITY)
        ||  (max === INFINITY && inputMax === INFINITY)
        ||  ((min === INFINITY || inputMax === INFINITY) && (inputMin - max) <= 1)
        ||  ((max === INFINITY || inputMin === INFINITY) && (min - inputMax) <= 1)
        ||  (highestMin - lowestMax <= 1)
};

// Range.prototype.contains = function(input){
//     const type = getInputType(input);
//     console.log(type)
//
//     return  type === 'number'   ? this.containsNumber(input) :
//             type === 'range'    ? this.containsRange(input) :
//             type === 'array'    ? this.containsArray(input) :
//                                   this.isTrueInf();
// };

Range.prototype.containsNumber = function(number){
    const noMax = this.max === INFINITY;
    const noMin = this.min === INFINITY;
    return  (noMax && noMin)
        ||  (noMax && number >= this.min)
        ||  (noMin && number <= this.max)
        ||  (number >= this.min && number <= this.max);
};

Range.prototype.containsRange = function(range){
    const noMax = this.max === INFINITY;
    const noMin = this.min === INFINITY;
    return  (noMax && noMin)
        ||  (noMin && range.min === INFINITY && range.max <= this.max)
        ||  (noMax && range.max === INFINITY && range.min >= this.min)
        ||  (range.min >= this.min && range.max <= this.max);
};

// Range.prototype.containsArray = function(array){
//     if(array.length === 0) return false;
//     for(let i = 0; i < array.length; i++){
//         if(!this.containsNumber(array[i])){
//             return false;
//         }
//     }
//     return true;
// };

Range.prototype.getNumberOfElements = function(){
    if(this.min === INFINITY || this.max === INFINITY){
        return INFINITY;
    }else{
        return this.max - this.min + 1;
    }
};

Range.prototype.isTrueInf = function(){
    return (this.max === INFINITY && this.min === INFINITY);
};

Range.prototype.isInf = function(){
    return (this.max === INFINITY || this.min === INFINITY);
};

Range.prototype.hasLowerBound = function(){
    return this.min !== INFINITY;
};

Range.prototype.hasUpperBound = function(){
    return this.max !== INFINITY;
};

Range.prototype.toString = function(){
    const same = this.min === this.max;

    return  same                    ? this.min.toString() :
            !this.hasLowerBound()   ? `..., ${this.max}` :
            !this.hasUpperBound()   ? `${this.min}, ...` :
                                      `${this.min}, ..., ${this.max}`;
};

function minOrInf(a, b){
    return (a === INFINITY || b === INFINITY)   ? INFINITY
        : Math.min(a, b);
}

function maxOrInf(a, b){
    return (a === INFINITY || b === INFINITY)   ? INFINITY
                                                : Math.max(a, b);
}

function minNoInf(a, b){
    const bothInf = a === INFINITY && b === INFINITY;
    return  bothInf             ? INFINITY :
            (a === INFINITY)    ? b :
            (b === INFINITY)    ? a :
                                  Math.min(a, b);
}

function maxNoInf(a, b){
    const bothInf = a === INFINITY && b === INFINITY;
    return  bothInf             ? INFINITY :
            (a === INFINITY)    ? b :
            (b === INFINITY)    ? a :
                                  Math.max(a, b);
}

function valOrInf(val){
    return (val === '...')  ? INFINITY
                            : val;
}

function getInputType(input){
    console.log(input)
    console.log(`isRange: ${(input instanceof Range)}`)
    return  !isNaN(input)               ? 'number' :
            (input instanceof Range)    ? 'range' :
            Array.isArray(input)        ? 'array' :
                                          INFINITY
}

module.exports = Range;