/**
 *  Sort collection
 *
 *  @params {object} collection
 *  @params {string} sortKey
 *  @params {string} sortOrder
 *  @returns {object}
 */
export function sortVehicles(collection, sortKey, sortOrder) {
    return {
        type: 'SORT_COLLECTION',
        payload: {
            collection: collection,
            sortKey: sortKey,
            sortOrder: sortOrder
        }
    }
}

/**
 *  Filter collection
 *
 *  @params {object} collection
 *  @params {string} sortKey
 *  @params {string} sortOrder
 *  @returns {object}
 */
export function filterVehicles(collection, filterKey, filterOperator, filterValue) {
    return {
        type: 'FILTER_COLLECTION',
        payload: {
            collection: collection,
            filterKey: filterKey,
            filterOperator: filterOperator,
            filterValue: filterValue
        }
    }
}

/**
 *  Retrieve cheap collection
 *
 *  @params {object} collection
 *  @params {string} sortKey
 *  @params {string} sortOrder
 *  @returns {object}
 */
export function retrieveCheapestVehiclePerSupplier(collection, distinctKey, compareKey, compareOperator) {
    return {
        type: 'RETRIEVE_CHEAPEST_VEHICLE',
        payload: {
            collection: collection,
            distinctKey: distinctKey,
            compareKey: compareKey,
            compareOperator: compareOperator
        }
    }
}

/**
 *  Remove Duplicate Name
 *
 *  @params {object} collection
 */
export function removeDuplicateName(collection) {
    return {
        type: 'REMOVE_DUPLICATE_NAME',
        payload: {
            collection: collection
        }
    }
}