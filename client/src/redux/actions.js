import {handleFetchErrors} from '../helpers/ErrorHandling';
import {INFLUENCER_SEARCH_COUNT, INFLUENCER_SEARCH_TOP_TYPES} from '../helpers/constants';
export const REQUEST_INFLUENCERS = "REQUEST_INFLUENCERS";
export const RECEIVE_INFLUENCERS = "RECEIVE_INFLUENCERS";
export const SELECT_COLLECTION = "SELECT_COLLECTION";
export const INVALIDATE_COLLECTION = "INVALIDATE_COLLECTION";
export const REQUEST_SEARCH_INFLUENCERS = "REQUEST_SEARCH_INFLUENCERS";
export const RECEIVE_SEARCH_INFLUENCERS = "RECEIVE_SEARCH_INFLUENCERS";
export const INVALIDATE_SEARCH_COLLECTION = "INVALIDATE_SEARCH_COLLECTION";
export const REQUEST_COLLECTIONS = "REQUEST_COLLECTIONS";
export const RECEIVE_COLLECTIONS = "RECEIVE_COLLECTIONS";
export const SUCCESS_NOTIFICATE = "SUCCESS_NOTIFICATE";
export const ERROR_NOTIFICATE = "ERROR_NOTIFICATE";
export const INFO_NOTIFICATE = "INFO_NOTIFICATE";


function requestCollections(){
    return {
        type: REQUEST_COLLECTIONS,
    }
}

function receiveCollections(collections){
    return {
        type: RECEIVE_COLLECTIONS,
        collections
    }
}

export function fetchCollections() {
    return dispatch => {
        dispatch(requestCollections());
        return fetch(`/api/get/collections`)
            .then(response => response.json() )
            .then(json => dispatch(receiveCollections(json)));
    };
}

export function selectCollection(collection) {
  return {
    type: SELECT_COLLECTION,
    collection
  };
}

export function invalidateCollection(collection) {
  return {
    type: INVALIDATE_COLLECTION,
    collection
  };
}

export function addNewInfluencerToCollection(influencer, collection){
    return (dispatch, getState )=> {
        const col = getState().influencersByCollection[collection];
        const notInCollection = !(col && col.influencers.find(e=>e.id === influencer));
        if (notInCollection){
            return fetch(`/api/add/influencer/${collection}/${influencer}`)
                .then(handleFetchErrors)
                .then(response => {
                    dispatch(notificateSuccess('Successfully added'));
                    return dispatch(fetchInfluencers(collection))
                })
                .catch(error => dispatch(notificateError(`${error.toString()}`, `Can't add`)))
        }else
            return dispatch(notificateError(`Influencer is already there`, `Can't add`))
    }
}

export function removeInfluencerFromCollection(influencer, collection){
    return dispatch => fetch(`/api/remove/influencer/${collection}/${influencer}`)
        .then(handleFetchErrors)
        .then(response => {
            dispatch(notificateSuccess('Successfully removed'));
            return dispatch(fetchInfluencers(collection))
        })
        .catch(error => dispatch(notificateError(`${error.toString()}`, `Can't add`)))
}

function requestInfluencers(collection) {
  return {
    type: REQUEST_INFLUENCERS,
    collection
  };
}

function receiveInfluencers(collection, json) {
  return {
    type: RECEIVE_INFLUENCERS,
    collection,
    influencers: json,
    receivedAt: Date.now()
  };
}

function reMapInfluencersJson(json){
    return json.map( e => ({
        name: e.name,
        id: e.id,
        avatarUrl: e.avatar_url,
        subscriberCount: +e.subscriber_count,
        videoCount: +e.video_count,
        commentCount: +e.comment_count,
        viewCount: +e.view_count,
        videoProps:{
            id: e.video_id,
            title: e.video_title,
            description: e.video_description,
            viewCount: +e.video_view_count,
            commentCount: +e.video_comment_count,
            likeCount: +e.video_like_count,
            dislikeCount: +e.video_dislike_count,
            duration: +e.video_duration,
            tags: e.video_tags,
            published: new Date(e.video_published),
        }
    }))
}

function fetchInfluencers(collection) {
  return dispatch => {
    dispatch(requestInfluencers(collection));
    return fetch(`/api/get/influencer/${collection}`)
      .then(response => response.json())
      .then(json => dispatch(receiveInfluencers(collection, reMapInfluencersJson(json))));
  };
}

function shouldFetchInfluencers(state, collection) {
  const influencers = state.influencersByCollection[collection];
  if (!influencers) {
    return true;
  } else if (influencers.isFetching) {
      return false;
  } else {
      return influencers.didInvalidate;
  }
}

export function fetchInfluencersIfNeeded(collection) {
    return (dispatch, getState) => {
    if (shouldFetchInfluencers(getState(), collection)) {
        return dispatch(fetchInfluencers(collection));
    }
  };
}

function requestSearchInfluencers(criteria) {
    return {
        type: REQUEST_SEARCH_INFLUENCERS,
        criteria
    };
}

function receiveSearchInfluencers(criteria, json) {
    return {
        type: RECEIVE_SEARCH_INFLUENCERS,
        criteria,
        influencers: json,
    };
}

export function invalidateSearchInfluencers() {
    return {
        type: INVALIDATE_SEARCH_COLLECTION
    };
}

export function fetchSearchInfluencers(criteria, column, count) {
    /**
    * Just to make sure it is fail proof.
    * */
    if (criteria === '' || criteria === null || criteria === undefined){
        return dispatch => dispatch(invalidateSearchInfluencers);
    }
    column = column || INFLUENCER_SEARCH_TOP_TYPES[0].id;
    count = count || INFLUENCER_SEARCH_COUNT[0].id;

    return dispatch => {
        dispatch(requestSearchInfluencers(criteria));
        return fetch(`/api/search/influencer/${criteria}/${column}/${count}`)
            .then(response => response.json() )
            .then(json => dispatch(receiveSearchInfluencers(criteria, reMapInfluencersJson(json))));
    };
}

export function notificateSuccess(message, title){
    return {
        type: SUCCESS_NOTIFICATE,
        message: message,
        title: title
    }
}

export function notificateError(message, title){
    return {
        type: ERROR_NOTIFICATE,
        message: message,
        title: title
    }
}
export function notificateInfo(message, title){
    return {
        type: INFO_NOTIFICATE,
        message: message,
        title: title
    }
}