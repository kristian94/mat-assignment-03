const Range = require('./range');

const INFINITY = '$';

function Set(array, options = {}){
    // const inputArray = Array.isArray(array) ? array : [].reduce.call(arguments, (acc, el) => {acc.push(el); return acc}, []);
    this._array = array;
    this.ranges = array && ranges(array) || [];
    this.naturalOnly = options.naturalOnly || this.inferNaturalOnly();
}

Set.prototype.isMember = function(number){
    let isMember = false;
    this.ranges.forEach(function(currentRange){
        if(currentRange.containsNumber(number)) isMember = true;
    });
    return isMember;
};

Set.prototype.difference = function(input){
    const inputSet = setFromArray(input);
    const difference = new Set();

    const ranges = sortRanges(this.ranges);
    const inputRanges = sortRanges(inputSet.ranges);

    ranges.forEach(function(range){
        let differenceRanges = [range];
        inputRanges.forEach(function(inputRange){
            let newDifferenceRanges = [];
            differenceRanges.forEach(function(diffRange){
                diffRange.difference(inputRange).forEach(function(finalDiff){
                    newDifferenceRanges.push(finalDiff);
                })
            });
            // if(newDifferenceRanges.length > 0){
            differenceRanges = newDifferenceRanges;
            // }
        });
        difference.ranges = differenceRanges;
    });

    return difference;
};

Set.prototype.complement = function(domain){
    const domainSet = setFromArray(domain);
    return domainSet.difference(this);
};

Set.prototype.intersect = function(input){
    const inputSet = setFromArray(input);
    const intersect = new Set();

    const ranges = this.ranges;
    const inputRanges = inputSet.ranges;

    ranges.forEach(function(range){
        let intersectRange;
        inputRanges.forEach(function(inputRange){
            let innerIntersectRange = range.intersect(inputRange);
            if(innerIntersectRange){
                intersectRange = innerIntersectRange;
            }
        });
        if(intersectRange){
            // console.log('yo')
            intersect.ranges.push(intersectRange);
        }
    });

    return intersect;
};

Set.prototype.isSubset = function(input){
    const self = this;
    const inputSet = setFromArray(input);
    const ranges = this.ranges;
    const inputRanges = inputSet.ranges;

    let isSubset = true;
    inputRanges.forEach(function(currentInputRange){
        let isContained = false;
        ranges.forEach(function(currentRange){
            if(currentRange.containsRange(currentInputRange)){
                isContained = true;
            }
        });
        if(!isContained) isSubset = false;
    });
    return isSubset;
};

Set.prototype.isProperSubset = function(input){
    const inputSet = setFromArray(input);
    const isSubset = this.isSubset(inputSet);

    if(isSubset){
        const numberOfElements = this.getNumberOfElements();
        const inputNumberOfElements = inputSet.getNumberOfElements();
        const greaterNumberOfElements = (numberOfElements > inputNumberOfElements);
        const lowerBound = inputSet.isLowerBound() && this.isLowerBound();
        const upperBound = inputSet.isUpperBound() && this.isUpperBound();

        return  greaterNumberOfElements
            ||  (lowerBound && inputSet.getLowestValue() > this.getLowestValue())
            ||  (upperBound && inputSet.getHighestValue() < this.getHighestValue())

    }else{
        return false;
    }
};

Set.prototype.union = function(input){
    const union = new Set();
    const inputSet = setFromArray(input);

    const ranges = this.ranges;
    const inputRanges = inputSet.ranges;
    const combinedRanges = concatAndSortRanges(ranges, inputRanges);
    const unionRanges = union.ranges;
    unionRanges.push(combinedRanges.shift());
    combinedRanges.forEach(function(currentRange){
        const currentUnionIndex = unionRanges.length - 1;
        const currentUnionRange = unionRanges[currentUnionIndex];
        const mergedRange = currentUnionRange.tryMerge(currentRange);
        if(mergedRange){
            unionRanges[currentUnionIndex] = mergedRange;
        }else{
            unionRanges.push(currentRange);
        }
    });
    return union;
};

//

Set.prototype.isLowerBound = function(){
    return this.ranges[0].min !== INFINITY;
};

Set.prototype.isUpperBound = function(){
    const index = this.ranges.length - 1;
    return this.ranges[index].max !== INFINITY;
};

Set.prototype.getLowestValue = function(){
    return this.ranges[0].min;
};

Set.prototype.getHighestValue = function(){
    const index = this.ranges.length - 1;
    return this.ranges[index].max;
};

Set.prototype.getNumberOfElements = function(){
    return this.ranges.reduce((acc, range) => {
        return acc + range.getNumberOfElements()
    }, 0)
};

Set.prototype.toString = function(){
    return `{${this.ranges.join(', ')}}`
};

Set.prototype.inferNaturalOnly = function(){
    let naturalOnly = true;

    this._array || [].forEach(function(element){
        if(!isNaN(element) && !Number.isInteger(element)) {
            naturalOnly = false;
        }
    });
    return naturalOnly;
};

function concatAndSortRanges(rangesA, rangesB){
    const combined = rangesA.concat(rangesB);
    return sortRanges(combined);
}

function sortRanges(ranges){
    return ranges.sort(function(a, b){
        const aMin = a.min;
        const bMin = b.min;
        return  aMin === INFINITY && bMin === INFINITY  ? 0 :
            aMin === INFINITY                       ? -1 :
                bMin === INFINITY                       ? 1 :
                aMin - bMin;
    });
}

function setFromArray(input){
    if(input instanceof Set){
        return input;
    }else if(Array.isArray(input)){
        return new Set(input);
    }else if(!isNaN(input)){
        return new Set([input]);
    }else{
        return '';
    }
}

// needs a sorted array
function ranges(array){
    const ranges = [];
    let rangeIndex = 0;
    ranges.push(new Range(array[0]));
    for(let i = 1; i < array.length; i++){
        const current = array[i];
        const currentRange = ranges[rangeIndex];
        const wasPushed = currentRange.tryPush(current);
        if(!wasPushed){
            rangeIndex++;
            ranges.push(new Range(current));
        }
    }
    return ranges;
}

module.exports = Set;