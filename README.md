# mat-assignment-03

## Set API

### Set()
Constructs a new Set

``set a = new Set([1, 2, 3, 4]) ``

### Set.isMember(number)
Returns true if the input number is a member of the set

``a.isMember(3) --> true``

``a.isMember(8) --> false``

### Set.intersect(set)
Returns a new Set that is the intersection of the set and input set

``a.intersect([3, 4, 5, 6]) --> {3, 4}``

``a.intersect([10, '...']) --> {}``

### Set.union(set)
Returns the union of two sets

``a.union([7, 8, 9]) --> {1, 2, 3, 4, 7, 8, 9}``

### Set.difference(set)
Returns the difference between the set and input set

``a.difference([2, 3]) --> {1, 4}``

``new Set([1, '...', 50]).difference([10, '...', 30]) --> {1, ..., 9, 31, ..., 50}``

### Set.complement(set)
Returns the complement of the set where the input set acts as context

``a.complement([-50, '...', 50]) --> {-50, ..., 0, 5, ... 50}``

### Set.isSubset(set)
Returns true if the input set is a subset of the set

``a.isSubset([1, 2, 3]) --> true``

``a.isSubset([1, '...']) --> false``

### Set.isProperSubset(set)
Returns true if the input set is a proper subset of the set

``a.isProperSubset([1, 2, 3, 4]) --> false``

``a.isProperSubset([1, 2, 3]) --> true``

### Set.equals(set)
Returns true if the input set is equal to the set

``a.equals([1, 2, 3, 4]) --> true``

``a.equals([1, 2, 3]) --> false``
