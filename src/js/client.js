import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import Vehicles from './components/Vehicles';

ReactDOM.render(
	<Provider store={store}>
	    <Vehicles/>
	</Provider>,
	document.getElementById('listingWidget')
);