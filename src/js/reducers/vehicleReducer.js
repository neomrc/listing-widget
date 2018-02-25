const vehicleReducer = (state = {
    vehicles: [],
    fetching: false,
    fetched: false
}, action) => {
    /**
     *  Get vehicle objects inside a parent object
     *
     *  @params {object} collection
     *  @returns {object}
     */
    function getVehicles(collection) {
        if (typeof collection !== 'object' && collection === null || collection.length <= 0) return false;

        var newCollection = [],
            i = 0;

        for (var vehicle in collection) {
            newCollection[i] = collection[vehicle];

            i++;
        }

        return newCollection;
    }

    switch(action.type) {
        case 'FETCH_VEHICLES_PENDING':
            return {
                ...state, 
                fetching: true
            };
        case 'FETCH_VEHICLES_FULFILLED':
            return {
                ...state,
                fetching: false, 
                fetched: true, 
                vehicles: action.payload.data.success === true ? 
                            state.vehicles.concat(getVehicles(action.payload.data.data)) : 
                            state.vehicles
            }
        case 'FETCH_VEHICLES_REJECTED':
            return {
                ...state,
                fetching: false, 
                fetched: true
            }
    }

    return state;
};

export default vehicleReducer;