import { combineReducers } from "redux";
import {
    SELECT_COLLECTION, INVALIDATE_COLLECTION, REQUEST_INFLUENCERS, RECEIVE_INFLUENCERS,
    REQUEST_SEARCH_INFLUENCERS, RECEIVE_SEARCH_INFLUENCERS, INVALIDATE_SEARCH_COLLECTION, RECEIVE_COLLECTIONS,
    REQUEST_COLLECTIONS, SUCCESS_NOTIFICATE, ERROR_NOTIFICATE, INFO_NOTIFICATE
} from './actions';
import {MESSAGE_TYPES} from '../helpers/constants';

function selectedCollection(state = '', action) {
  switch (action.type) {
    case SELECT_COLLECTION:
      return action.collection;
    default:
      return state;
  }
}

function collections(
    state = {
        isFetching: false,
        collections: []
    }, action) {
    switch (action.type) {
        case REQUEST_COLLECTIONS:
            return Object.assign({}, state, {
                isFetching: true
            });
        case RECEIVE_COLLECTIONS:
            return Object.assign({}, state, {
                isFetching: false,
                collections: action.collections
            });
        default:
            return state;
    }
}

function influencers(
    state = {
        isFetching: false,
        didInvalidate: false,
        influencers: []
    },
    action
) {
    switch (action.type) {
        case INVALIDATE_COLLECTION:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_INFLUENCERS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_INFLUENCERS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                influencers: action.influencers,
                lastUpdated: action.receivedAt
            });
        default:
            return state;
    }
}

function influencersByCollection(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_COLLECTION:
    case RECEIVE_INFLUENCERS:
    case REQUEST_INFLUENCERS:
      return Object.assign({}, state, {
        [action.collection]: influencers(state[action.collection], action)
      });
    default:
      return state;
  }
}

function searchInfluencers(
    state = {
        isFetching: false,
        criteria: '',
        influencers: [],
    },
    action
){
    switch (action.type) {
        case REQUEST_SEARCH_INFLUENCERS:
            return Object.assign({}, state, {
                isFetching: true,
                criteria: action.criteria,
                influencers: [],
            });
        case RECEIVE_SEARCH_INFLUENCERS:
            return Object.assign({}, state, {
                isFetching: false,
                criteria: action.criteria,
                influencers: action.influencers,
            });
        case INVALIDATE_SEARCH_COLLECTION:
            return Object.assign({}, state, {
                isFetching: false,
                criteria: '',
                influencers: [],
            });
        default:
            return state;
    }
}

function notify(
    state = {},
    action
){
    state = {...state, type: null, message: '', title: ''};
    switch (action.type) {
        case SUCCESS_NOTIFICATE:
            return {
                ...state,
                type: MESSAGE_TYPES.success,
                message: action.message,
                title: action.title
            };
        case ERROR_NOTIFICATE:
            return {
                ...state,
                type: MESSAGE_TYPES.error,
                message: action.message,
                title: action.title

            };
        case INFO_NOTIFICATE:
            return {
                ...state,
                type: MESSAGE_TYPES.info,
                message: action.message,
                title: action.title
            };
        default:
            return state;
    }
}

const rootReducer = combineReducers({
  influencersByCollection,
  selectedCollection,
  searchInfluencers,
  collections,
  notify
});

export default rootReducer;
