import * as Helper from '../helpers';

const filterReducer = (state = {
    filteredCollection: []
}, action) => {
    let payload = action.payload;

    /**
     *  Sort collection
     *
     *  @params {object} collection
     *  @params {string} sortKey - key on the object
     *  @params {string} sortOrder - (e.g. desc, asc)
     *  @returns {object}
     */
    const applySort = (collection, sortKey, sortOrder) => {
        if (typeof collection === 'object' && collection === null || typeof collection === 'undefined' || collection.length < 2) 
            return collection;

        return [...collection].sort((a, b) => {
            let valueType = typeof parseFloat(a[sortKey]);

            return sortOrder === 'asc' ?  
                    (
                        valueType === 'number' ? 
                        parseFloat(a[sortKey] - b[sortKey]) : 
                        a[sortKey].localeCompare(b[sortKey])
                    ) : 
                    (
                        valueType === 'number' ? 
                        parseFloat(b[sortKey] - a[sortKey]) : 
                        b[sortKey].localeCompare(a[sortKey])
                    );
        });
    }

    /**
     *  Filter collection
     *
     *  @params {object} collection
     *  @params {string} filterKey - key on the object
     *  @params {string} filterOperator - (e.g =, >, <)
     *  @params {string} filterValue - value to compare to the value of filterKey
     *  @returns {object} newCollection
     */
    const applyFilter = (collection, filterKey, filterOperator, filterValue) => {
        if (typeof collection === 'object' && collection === null || typeof collection === 'undefined' || collection.length < 2) {
            return collection;
        }
        let newCollection = [];

        collection.forEach((obj, index) => {
            if (Helper.operateParams(filterOperator, obj[filterKey], filterValue) === true) {
                newCollection.push(obj);
            }
        });

        return newCollection;
    }

    /**
     *  Retrieve cheapest vehicle
     *
     *  @params {object} collection
     *  @params {string} distinctKey
     *  @params {string} compareKey
     *  @params {string} compareOperator
     *  @returns {object} newCollection
     */
    const retrieveCheapestVehicle = (collection, distinctKey, compareKey, compareOperator) => {
        let newCollection = {};
        let newColArray = [];
        for(var key in collection){
            newColArray.push(collection[key]);
        }
        newColArray.map(item => {
            item.name = item.name.trim();
            if (typeof newCollection[item[distinctKey]] === 'undefined') {
                newCollection[item[distinctKey]] = item;
            } else {
                let newCollectionData = newCollection[item[distinctKey]];
                let newCollectionDistinctKey = Object.keys(newCollectionData)[0];

                if (
                    newCollectionDistinctKey === item[distinctKey] &&
                    Helper.operateParams(compareOperator, newCollectionData[compareKey], item[compareKey]) === true
                ) {
                    newCollection[item[distinctKey]] = item;
                }
            }
        });
        return newCollection;
    }

    /**
     *  Remove Duplicate Name
     *
     *  @params {object} collection
     */
    const removeDuplicateName = (collection) => {
        let newCollection = {};
        let newColArray = [];
        const distinctKey = 'name';
        const compareKey = 'xrsBasePrice';
        for(var key in collection){
            newColArray.push(collection[key]);
        }
        newColArray.map(item => {
            if (typeof newCollection[item[distinctKey]] === 'undefined') {
                newCollection[item[distinctKey]] = item;
            } else {
                let newCollectionData = newCollection[item[distinctKey]];
                let newCollectionDistinctKey = Object.keys(newCollectionData)[0];

                if (
                    newCollectionDistinctKey === item[distinctKey] &&
                    Helper.operateParams('!=', newCollectionData[compareKey], item[compareKey]) === true
                ) {
                    newCollection[item[distinctKey]] = item;
                }
            }
        });
        return newCollection;
    }

    switch (action.type) {
        case 'SORT_COLLECTION': {
            return {
                ...state,
                filteredCollection: applySort(payload.collection, payload.sortKey, payload.sortOrder)
            };
        }
        case 'FILTER_COLLECTION': {
            return {
                ...state,
                filteredCollection: applyFilter(payload.collection, payload.filterKey, payload.filterOperator, payload.filterValue)
            };
        }
        case 'RETRIEVE_CHEAPEST_VEHICLE': {
            return {
                ...state,
                filteredCollection: retrieveCheapestVehicle(payload.collection, payload.distinctKey, payload.compareKey, payload.compareOperator)
            }
        }
        case 'REMOVE_DUPLICATE_NAME': {
            return {
                ...state,
                filteredCollection: removeDuplicateName(payload.collection)
            }
        }
    }

    return state;
}

export default filterReducer;