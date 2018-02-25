import React from 'react';
import helper from '../helpers';

export default class VehicleBlock extends React.Component
{
    render() {
        const vehicleData = this.props;
        const styles = vehicleData.styles;

        return (
            <div className={styles.carContainer} onClick={() => this.props.handleRedirectToResults(vehicleData)}>
                <div className={styles.carImageContainer}>
                    <img src={vehicleData.vehicleImage} className={styles.carImage}/>
                </div>
                <div className={styles.carInfoContainer}>
                    <h3 className={styles.carTitle}>{ vehicleData.name.replace(' or similar','') }</h3>
                    <span className={styles.carClass}>class: { vehicleData.category }</span>
                    <div className={styles.carPrice}>
                        <span className="price-form">from</span>
                        <div className="price-main">{ helper.currencyToSign(vehicleData.currency) + parseFloat(vehicleData.perDayPrice).toFixed(2) }<span className={styles.colorBlue}>*</span><span className={styles.perDayLabel}>/day</span></div>
                    </div>
                </div>
                <div className={styles.nextStep}>
                    <i className={styles.iconChevronRight}></i>
                </div>
            </div>
        );
    }
}