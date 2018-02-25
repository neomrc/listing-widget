import moment from 'moment';
import axios from 'axios';

/**
 *  Transform object key-value pairs into one query string
 *
 *  @params {object} params - expected to be key value pairs which will be transformed into a query string depending on levels
 *  @params {boolean} reused - used to make base key to be an array for the query string
 *  @params {string} baseParamKey - key on the 'params' object
 *  @return {string}
 */
export const serialize = (params, reused, baseParamKey) => {
    let beautifiedParams = [];
    let loop = 0;

    if (['pickUpDepot', 'returnDepot'].indexOf(baseParamKey) > -1) {
        baseParamKey += '[0]';
    }

    for(let param in params) {

        if (!params.hasOwnProperty(param)) continue;

        if (typeof params[param] === 'object' && params[param] !== null) {
            beautifiedParams.push(serialize(params[param], true, (typeof baseParamKey !== 'undefined' && baseParamKey !== '' ? baseParamKey + '[' + param + ']' : param)));
        } else {
            beautifiedParams.push((reused === true ? baseParamKey + '[' + param + ']' : param) + '=' + params[param]);
        }

        loop++;
    }

    return beautifiedParams.join('&');
}

/**
 *  Retrieve all config
 *
 *  @returns {object}
 */
export const getConfig = () => {
    const targetElement = document.getElementById('listingWidget');
    const sortBy = targetElement.hasAttribute('sort-by') ? targetElement.getAttribute('sort-by') : 'supplierCode';
    const dayAdvance = targetElement.hasAttribute('day-advance') ? targetElement.getAttribute('day-advance') : 2;
    const dateDifference = targetElement.hasAttribute('date-difference') ? targetElement.getAttribute('date-difference') : 2;
    const pickupTime = targetElement.hasAttribute('pickuptime') ? targetElement.getAttribute('pickuptime') : '10:00';
    const returnTime = targetElement.hasAttribute('returntime') ? targetElement.getAttribute('returntime') : '10:00';
    return {
        LOCATION: targetElement.getAttribute('location'),
        ALIAS: targetElement.getAttribute('alias'),
        ADVANCE_DAY: parseInt(dayAdvance),
        DATE_DIFF: parseInt(dateDifference),
        PIKCUPTIME: pickupTime,
        RETURNTIME: returnTime,
        SORTBY: sortBy,
        WEB_URL: process.env.WEB_URL,
        API_URL: process.env.API_URL,
        API_TOKEN: process.env.API_TOKEN,
        GOOGLE_API: process.env.GOOGLE_API
    };
}

/**
 *  Check for global values that makes the widget to initialize
 *
 *  @return {Promise}
 */
export const initParams = () => {
    const globalParams = getConfig();
    return new Promise((resolve, reject) => {
        getLocation(globalParams.LOCATION)
            .then(position => {
                let currentCoordinates = position.latitude + ',' + position.longitude;
                resolve({
                    alias: globalParams.ALIAS,
                    pickupCoordinate: currentCoordinates,
                    returnCoordinate: currentCoordinates,
                    pickUpLocationType: 1,
                    returnLocationType: 1,
                    byPassDefaultRadius: '',
                    showByPassedDepots: '',
                    countryCode: 'AU',
                    driverAge: 30,
                    pickUpDate: moment().add(globalParams.ADVANCE_DAY, 'days').format('YYYY-MM-DD'),
                    pickUpTime: globalParams.PIKCUPTIME,
                    returnDate: moment().add(globalParams.ADVANCE_DAY + globalParams.DATE_DIFF, 'days').format('YYYY-MM-DD'),
                    returnTime: globalParams.RETURNTIME,
                    placeName: position.placeName
                });
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 *  Fetch place details
 *
 *  @params {string} locationName
 *  @returns {Promise}
 */
export const getLocation = locationName => {
    return new Promise((resolve, reject) => {
        // initialize google autocomplete service
        const autocompleteService = new google.maps.places.AutocompleteService();
        const findAirportPlace = locationName.indexOf('airport') > -1;
        let locationFound = false;

        autocompleteService
            .getQueryPredictions({
                input: locationName
            }, (predictions, status) => {
                if(status === google.maps.places.PlacesServiceStatus.OK) {
                    // initialize google place service
                    const map = new google.maps.Map(document.getElementById('map_canvas'));
                    const placeService = new google.maps.places.PlacesService(map);

                    predictions.map(prediction => {
                        placeService
                            .getDetails({
                                placeId: prediction.place_id
                            }, (place, status) => {
                                if (locationFound === true) {
                                    return;
                                }

                                // check if preferred location is an airport
                                if (
                                    findAirportPlace === true && place.types.indexOf('airport') > -1 ||
                                    findAirportPlace === false
                                ) {
                                    resolve({
                                        placeName: prediction.description,
                                        latitude: place.geometry.location.lat(),
                                        longitude: place.geometry.location.lng()
                                    });

                                    locationFound = true;
                                }
                            });
                    });
                } else {
                    reject('Place not found!');
                }
            });
    });
}

/**
 *  Compare two values using operator
 *
 *  @params {string} operator (e.g >, <, =)
 *  @params {string|number} param1
 *  @params {string|number} param2
 *  @return {boolean}
 */
export const operateParams = (operator, param1, param2) => {
    switch (operator) {
        case '+': {
            return param1 + param2;
        }
        case '-': {
            return param1 - param2;
        }
        case '*': {
            return param1 * param2;
        }
        case '/': {
            return param1 / param2;
        }
        case '>': {
            return param1 > param2;
        }
        case '<': {
            return param1 < param2;
        }
        case '>=': {
            return param1 >= param2;
        }
        case '<=': {
            return param1 <= param2;
        }
        case '=': {
            return param1 == param2;
        }
        case '!=': {
            return param1 != param2;
        }
    }
}

/**
 * Get exchange rate
 *
 * @param {string} endpoint
 * @param {string} originalCurrency
 * @param {string} targetCurrency
 * @return {Promise}
 */
export const getExchangeRate = (endpoint, originalCurrency, targetCurrency) => {
    return axios.post(endpoint, {
        'fromCurrency': originalCurrency,
        'toCurrency': targetCurrency
    });
}

/**
 * Convert a currency code to its currency symbol 
 * 
 * @param  {string} currencyCode
 * @return {string} - the currency symbol
 */
export const currencyToSign = (currencyCode) => {
    switch (currencyCode) {
        case 'AED':
            return 'د.إ.‏';break;
        case 'AFN':
            return '؋';break;
        case 'ALL':
            return 'Lek';break;
        case 'AMD':
            return 'դր.';break;
        case 'ARS':
            return '$';break;
        case 'AUD':
            return '$';break;
        case 'AZN':
            return 'man.';break;
        case 'BAM':
            return 'KM';break;
        case 'BDT':
            return '৳';break;
        case 'BGN':
            return 'лв.';break;
        case 'BHD':
            return 'د.ب.‏';break;
        case 'BND':
            return '$';break;
        case 'BOB':
            return '$b';break;
        case 'BRL':
            return 'R$';break;
        case 'BYR':
            return 'р.';break;
        case 'BZD':
            return 'BZ$';break;
        case 'CAD':
            return '$';break;
        case 'CHF':
            return 'fr.';break;
        case 'CLP':
            return '$';break;
        case 'CNY':
            return '¥';break;
        case 'COP':
            return '$';break;
        case 'CRC':
            return '₡';break;
        case 'CSD':
            return 'Din.';break;
        case 'CZK':
            return 'Kč';break;
        case 'DKK':
            return 'kr.';break;
        case 'DOP':
            return 'RD$';break;
        case 'DZD':
            return 'DZD';break;
        case 'EEK':
            return 'kr';break;
        case 'EGP':
            return 'ج.م.‏';break;
        case 'ETB':
            return 'ETB';break;
        case 'EUR':
            return '€';break;
        case 'GBP':
            return '£';break;
        case 'GEL':
            return 'Lari';break;
        case 'GTQ':
            return 'Q';break;
        case 'HKD':
            return 'HK$';break;
        case 'HNL':
            return 'L.';break;
        case 'HRK':
            return 'kn';break;
        case 'HUF':
            return 'Ft';break;
        case 'IDR':
            return 'Rp';break;
        case 'ILS':
            return '₪';break;
        case 'INR':
            return '=ु';break;
        case 'IQD':
            return 'د.ع.‏';break;
        case 'IRR':
            return 'ريال';break;
        case 'ISK':
            return 'kr.';break;
        case 'JMD':
            return 'J$';break;
        case 'JOD':
            return 'د.ا.‏';break;
        case 'JPY':
            return '¥';break;
        case 'KES':
            return 'S';break;
        case 'KGS':
            return 'сом';break;
        case 'KHR':
            return '៛';break;
        case 'KRW':
            return '₩';break;
        case 'KWD':
            return 'د.ك.‏';break;
        case 'KZT':
            return 'Т';break;
        case 'LAK':
            return '₭';break;
        case 'LBP':
            return 'ل.ل.‏';break;
        case 'LKR':
            return '=ු.';break;
        case 'LTL':
            return 'Lt';break;
        case 'LVL':
            return 'Ls';break;
        case 'LYD':
            return 'د.ل.‏';break;
        case 'MAD':
            return 'د.م.‏';break;
        case 'MKD':
            return 'ден.';break;
        case 'MNT':
            return '₮';break;
        case 'MOP':
            return 'MOP';break;
        case 'MVR':
            return 'ރ.';break;
        case 'MXN':
            return '$';break;
        case 'MYR':
            return 'RM';break;
        case 'NIO':
            return 'N';break;
        case 'NOK':
            return 'kr';break;
        case 'NPR':
            return '=ु';break;
        case 'NZD':
            return '$';break;
        case 'OMR':
            return 'ر.ع.‏';break;
        case 'PAB':
            return 'B/.';break;
        case 'PEN':
            return 'S/.';break;
        case 'PHP':
            return 'PhP';break;
        case 'PKR':
            return 'Rs';break;
        case 'PLN':
            return 'zł';break;
        case 'PYG':
            return 'Gs';break;
        case 'QAR':
            return 'ر.ق.‏';break;
        case 'RON':
            return 'lei';break;
        case 'RSD':
            return 'Din.';break;
        case 'RUB':
            return 'р.';break;
        case 'RWF':
            return 'RWF';break;
        case 'SAR':
            return 'ر.س.‏';break;
        case 'SEK':
            return 'kr';break;
        case 'SGD':
            return '$';break;
        case 'SYP':
            return 'ل.س.‏';break;
        case 'THB':
            return '฿';break;
        case 'TJS':
            return 'т.р.';break;
        case 'TMT':
            return 'm.';break;
        case 'TND':
            return 'د.ت.‏';break;
        case 'TRY':
            return 'TL';break;
        case 'TTD':
            return 'TT$';break;
        case 'TWD':
            return 'NT$';break;
        case 'UAH':
            return '₴';break;
        case 'USD':
            return '$';break;
        case 'UYU':
            return '$U';break;
        case 'UZS':
            return 'so\'m';break;
        case 'VEF':
            return 'Bs. F.';break;
        case 'VND':
            return '₫';break;
        case 'XOF':
            return 'XOF';break;
        case 'YER':
            return 'ر.ي.‏';break;
        case 'ZAR':
            return 'R';break;
        case 'ZWL':
            return 'Z$';break;
    }
}

/**
 *  Convert price
 *
 *  @param {number} originalPrice
 *  @param {number} originalRate
 *  @param {number} targetRate
 *  @return {number}
 */
export const convertPrice = (originalPrice, originalRate, targetRate) => {
    var convertedPrice = originalPrice / originalRate * targetRate;

    return parseFloat(convertedPrice.toFixed(2));
}

/**
 * Build price text to show price converter
 *
 * @param {number} originalPrice
 * @param {string} originalCurrency ISO-4217
 * @param {string} targetCurrency ISO-4217
 * @param {number} originalRate
 * @param {number} targetRate
 * @return {string} e.g: "£100 (AUD $120)"
 */
export const buildPriceText = (originalPrice, originalCurrency, targetCurrency, originalRate, targetRate) => {
    // if currency the same, simply return with original currency
    if (originalCurrency === targetCurrency) {
        return this.currencyToSign(originalCurrency) + originalPrice;
    }

    return this.currencyToSign(targetCurrency) + this.convertPrice(originalPrice, originalRate, targetRate) + '  <span class="original-price">(' + originalCurrency + ' ' + this.currencyToSign(originalCurrency) + originalPrice + ')<span>';
}