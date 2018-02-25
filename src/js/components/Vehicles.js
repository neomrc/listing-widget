import React from 'react';
import VehicleList from '../containers/VehicleList';
import styles from '../../scss/main.scss';

const Vehicles = () => {
    return (
        <div className={styles.listingCarListContainer}>
            { <VehicleList styles={styles}/> }
            <div id="map_canvas"></div>
        </div>
    );
}

export default Vehicles;