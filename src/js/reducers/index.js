import { combineReducers } from 'redux';

import depot from './depotReducer';
import vehicle from './vehicleReducer';
import filter from './filterReducer';

export default combineReducers({
    depot,
    vehicle,
    filter
});