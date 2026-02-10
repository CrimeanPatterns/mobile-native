/* eslint-disable */
import * as _ from 'lodash';

function identity($) {
    return $;
}

function hasCustomToString(obj) {
    return _.isFunction(obj.toString) && obj.toString !== Object.prototype.toString;
}

function processPredicates(sortPredicate, reverseOrder) {
    reverseOrder = reverseOrder ? -1 : 1;
    return sortPredicate.map(function(predicate) {
        let descending = 1,
            get = identity;

        if (_.isFunction(predicate)) {
            get = predicate;
        } else if (_.isString(predicate)) {
            if (predicate.charAt(0) === '+' || predicate.charAt(0) === '-') {
                descending = predicate.charAt(0) === '-' ? -1 : 1;
                predicate = predicate.substring(1);
            }
            if (predicate !== '') {
                get = function(value) {
                    return value[predicate];
                };
            }
        }
        return {get, descending: descending * reverseOrder};
    });
}

function isPrimitive(value) {
    switch (typeof value) {
        case 'number': /* falls through */
        case 'boolean': /* falls through */
        case 'string':
            return true;
        default:
            return false;
    }
}

function objectValue(value, index) {
    // If `valueOf` is a valid function use that
    if (typeof value.valueOf === 'function') {
        value = value.valueOf();
        if (isPrimitive(value)) return value;
    }
    // If `toString` is a valid function and not the one from `Object.prototype` use that
    if (hasCustomToString(value)) {
        value = value.toString();
        if (isPrimitive(value)) return value;
    }
    // We have a basic object so we use the position of the object in the collection
    return index;
}

function getPredicateValue(value, index) {
    let type = typeof value;
    if (value === null) {
        type = 'string';
        value = 'null';
    } else if (type === 'string') {
        value = value.toLowerCase();
    } else if (type === 'object') {
        value = objectValue(value, index);
    }
    return {value, type};
}

function compare(v1, v2) {
    let result = 0;
    if (v1.type === v2.type) {
        if (v1.value !== v2.value) {
            result = v1.value < v2.value ? -1 : 1;
        }
    } else {
        result = v1.type < v2.type ? -1 : 1;
    }
    return result;
}

export const orderBy = function(array, sortPredicate, reverseOrder) {
    if (!_.isArray(sortPredicate)) {
        sortPredicate = [sortPredicate];
    }
    if (sortPredicate.length === 0) {
        sortPredicate = ['+'];
    }

    const predicates = processPredicates(sortPredicate, reverseOrder);
    // Add a predicate at the end that evaluates to the element index. This makes the
    // sort stable as it works as a tie-breaker when all the input predicates cannot
    // distinguish between two elements.
    predicates.push({
        get: function() {
            return {};
        },
        descending: reverseOrder ? -1 : 1,
    });

    // The next three lines are a version of a Swartzian Transform idiom from Perl
    // (sometimes called the Decorate-Sort-Undecorate idiom)
    // See https://en.wikipedia.org/wiki/Schwartzian_transform
    const compareValues = Array.prototype.map.call(array, getComparisonObject);
    compareValues.sort(doComparison);
    array = compareValues.map(function(item) {
        return item.value;
    });

    return array;

    function getComparisonObject(value, index) {
        return {
            value,
            predicateValues: predicates.map(function(predicate) {
                return getPredicateValue(predicate.get(value), index);
            }),
        };
    }

    function doComparison(v1, v2) {
        let result = 0;
        for (let index = 0, length = predicates.length; index < length; ++index) {
            result = compare(v1.predicateValues[index], v2.predicateValues[index]) * predicates[index].descending;
            if (result) break;
        }
        return result;
    }
};
