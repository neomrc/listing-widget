import axios from 'axios';
import { getConfig } from '../helpers';

/**
 *  Fetch depots
 *
 *  @params {string} URL
 *  @params {string} alias
 *  @returns {Promise}
 */
export function fetchDepots(URL, alias) {
    const config = getConfig();

    return {
        type: 'FETCH_DEPOTS',
        payload: axios.get(config.API_URL + URL, {
            headers: {
                Authorization: config.API_TOKEN
            }
        })
    }
}

/**
 *  Fetch vehicles
 *
 *  @params {string} URL
 *  @params {string} alias
 *  @returns {Promise}
 */
export function fetchVehicles(URL, alias) {
    const config = getConfig();

    return {
        type: 'FETCH_VEHICLES',
        payload: axios.get(config.API_URL + URL, {
            headers: {
                Authorization: config.API_TOKEN
            }
        })
    }
}