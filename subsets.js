function compare(a, b){
    const aIsASubset = isASubset(a, b);
    const equals = isEqual(a, b);

    return  equals      ?   0   :
            aIsASubset  ?   -1  :
            !aIsASubset ?   1   :
                            -2;

    function isASubset(a, b){
        let match = true;
        a.forEach(function(elA){
            let innerMatch = false;
            b.forEach(function(elB){
                if(elA === elB){
                    innerMatch = true;
                }
            })
            if(!innerMatch){
                match = false;
                return;
            }
        })
        return match;
    }

    function isEqual(a, b){
        const sortedA = a.sort();
        const sortedB = b.sort();

        if(sortedA.length !== sortedB.length) return false;

        for(let i = 0; i < a.length; i++){
            if(sortedA[i] !== sortedB[i]) return false;
        }
        return true;
    }
}



const a = [1, 2, 3, 4, 5, 6];
const b = [1, 2, 3, 4];
const c = [2, 3, 4 ,5 ,6 ,7 , 8];
const d = [1, 7, 9];
const e = [2, 1, 4, 3];



console.log(compare(d, e));



