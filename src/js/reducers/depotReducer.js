const depotReducer = (state = {
    depots: [],
    fetching: false,
    fetched: false
}, action) => {
    switch(action.type) {
        case 'FETCH_DEPOTS_PENDING':
            return {
                ...state, 
                fetching: true
            };
        case 'FETCH_DEPOTS_FULFILLED':
            return {
                ...state,
                fetching: false, 
                fetched: true, 
                depots: action.payload.data.data
            }
        case 'FETCH_DEPOTS_REJECTED':
            return {
                ...state,
                fetching: false, 
                fetched: true,
                error: action.payload.data
            }
    }

    return state;
};

export default depotReducer;