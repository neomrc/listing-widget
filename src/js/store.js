import { applyMiddleware, createStore } from 'redux';
import promise from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import reducer from './reducers';

var middlewareGroup = [promise(), thunk];

if (process.env.NODE_ENV !== 'production') {
    middlewareGroup.push(require('redux-logger').default);
}

export default createStore(reducer, applyMiddleware(...middlewareGroup));