import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import Script from 'react-load-script';
import * as vehicleActions from '../actions/vehicleActions';
import * as filterActions from '../actions/filterActions';
import VehicleBlock from './VehicleBlock';
import * as Helper from '../helpers';

class VehicleList extends React.Component
{
    constructor() {
        super();

        this.state = {
            globalValues: []
        };

        this.config = Helper.getConfig();
        this.handleScriptLoad = this.handleScriptLoad.bind(this);
        this.handleScriptError = this.handleScriptError.bind(this);
        this.handleRedirectToResults = this.handleRedirectToResults.bind(this);
    }

    /**
     *  Handle script load
     */
    handleScriptLoad() {
        Helper.initParams()
            .then(globalValues => {
                const apiURL = '/search/nearest-depot-pair?' + Helper.serialize(globalValues);

                this.retrieveVehicles(apiURL, globalValues);

                this.setState({
                    globalValues: globalValues
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    /**
     *  Handle script error
     */
    handleScriptError() {
        console.error('Cannot load google maps API');
    }

    /**
     *  Fetch all vehicles from depots
     *
     *  @params {string} apiURL
     *  @params {object} params
     *  @returns {Promise}
     */
    retrieveVehicles(apiURL, params) {
        this.props.fetchDepots(apiURL, params.alias)
            .then((response) => {
                var vehicleFetchPromise = [];

                for (var supplierCode in this.props.depots) {
                    var depotData = this.props.depots[supplierCode];

                    var depotVehicleParams = {
                        supplier: supplierCode,
                        countryCode: params.countryCode,
                        driverAge: params.driverAge,

                        pickUpDate: params.pickUpDate,
                        pickUpTime: params.pickUpTime,
                        returnDate: params.returnDate,
                        returnTime: params.returnTime,
                        pickUpDepot: depotData.pickUpDepot[0],
                        returnDepot: depotData.returnDepot[0],
                        searchLocation: {
                            alias: params.alias,
                            pickupLocationCoordinates: params.pickupCoordinate,
                            returnLocationCoordinates: params.returnCoordinate,
                            pickUpLocationType: params.pickUpLocationType,
                            returnLocationType: params.returnLocationType
                        }
                    };

                    var vehicleAPIURL = '/search/vehicles?' + Helper.serialize(depotVehicleParams);

                    vehicleFetchPromise.push(this.props.fetchVehicles(vehicleAPIURL, params.alias));
                }

                return vehicleFetchPromise;
            })
            .then((vehicleFetchPromise) => {
                Promise.all(vehicleFetchPromise)
                    .then(response => {
                        if (typeof this.props.vehicles === 'object' && this.props.vehicles !== null && this.props.vehicles.length > 0) {
                            this.props.sortVehicles(this.props.vehicles, 'xrsBasePrice', 'asc');
                            this.props.removeDuplicateName(this.props.filteredVehicles);
                            this.props.retrieveCheapestVehiclePerSupplier(this.props.filteredVehicles, this.config.SORTBY, 'xrsBasePrice', '<=');
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
            });
    }

    /**
     *  Handle redirection to results page
     *
     *  @params {object} vehicleData
     */
    handleRedirectToResults(vehicleData) {
        const globalValues = this.state.globalValues;

        window.location.href = this.config.WEB_URL + '/' +
            globalValues.alias + '/results/' +
            globalValues.pickUpDate + '/' +
            globalValues.pickUpTime + '/' +
            globalValues.returnDate + '/' +
            globalValues.returnTime + '/' +
            globalValues.pickupCoordinate + ',' + globalValues.pickUpLocationType + '/' +
            globalValues.returnCoordinate + ',' + globalValues.returnLocationType + '/' +
            globalValues.placeName + '/' +
            globalValues.placeName + '/' +
            globalValues.countryCode + '/' +
            globalValues.driverAge +
            '/?categoryCode=' + vehicleData.categoryCode +
            '&supplierCode=' + vehicleData.supplierCode +
            '&location=' + this.config.LOCATION;
    }

    /**
     *  Render vehicle list
     *
     *  @returns {object} - HTML Component
     */
    renderVehicleList() {
        const styles = this.props.styles;
        const vehicles = this.props.filteredVehicles;
        const vehicleKeys = Object.keys(vehicles);

        if (vehicleKeys.length <= 0) {
            return (
                <div className={styles.iconLoaderContainer}>
                    <span>Loading car suggestions...</span>
                </div>
            );
        }

        return vehicleKeys.map((key, index) => {
            if (index > 2) return false;
            return <VehicleBlock
                key={index}
                styles={styles}
                handleRedirectToResults={this.handleRedirectToResults}
                {...vehicles[key]}
            />;
        });
    }

    render() {
        const globalValues = this.state.globalValues;
        const styles = this.props.styles;
        const vehicleCount = Object.keys(this.props.filteredVehicles).length;

        return (
            <div className={styles.listingCarList}>
                <Script
                    url={this.config.GOOGLE_API}
                    onLoad={this.handleScriptLoad}
                    onError={this.handleScriptError}
                />

                <div className={styles.carHireTitle + ' ' + styles.textCenter}>hire a car in { this.config.LOCATION }</div>
                <div className={styles.carHireTravelPeriod + ' ' + styles.textCenter}>travel period: { moment(globalValues.pickUpDate).format('DD MMM YY') + ' - ' + moment(globalValues.returnDate).format('DD MMM YY') }</div>
                { this.renderVehicleList() }
                <div className={styles.carHirePerDay}>
                    <span className={styles.colorBlue}>*</span><span>per day based on a 3-day rental</span>
                    <span className={styles.poweredBy}>
                        <a href="https://www.linkedin.com/in/mdpioquinto">
                            <small>Powered by</small><br/>Marc Dominic Pioquinto
                        </a>
                    </span>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        depots: state.depot.depots,
        vehicles: state.vehicle.vehicles,
        filteredVehicles: state.filter.filteredCollection
    };
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        ...vehicleActions,
        ...filterActions
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(VehicleList);