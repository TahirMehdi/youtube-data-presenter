import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
    selectCollection, fetchInfluencersIfNeeded, invalidateCollection,
    fetchCollections
} from '../redux/actions';
import InfluencerCollectionSelector from '../components/InfluencerCollectionSelector';
import InfluencerList from '../components/InfluencerList';
import Notify from '../helpers/Notify';
import {COLLECTION_SORT_TYPES} from '../helpers/constants';

class InfluencerCollectionPage extends Component {
    notify = null;
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
        this.state = {
            selectedSort: COLLECTION_SORT_TYPES[0].id
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchCollections());
    }

    componentDidUpdate(prevProps) {
        const {dispatch, selectedCollection, collections, notify} = this.props;
        if ((collections !== prevProps.collections) && collections[0]) {
            dispatch(selectCollection(collections[0].id));
        }
        if (selectedCollection !== prevProps.selectedCollection) {
            dispatch(fetchInfluencersIfNeeded(selectedCollection));
        }
        if (notify.type)
            this.notify[notify.type](notify.title, notify.message);
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(selectCollection(''));
    }

    handleChange(nextSubreddit) {
        const {dispatch} = this.props;
        dispatch(selectCollection(nextSubreddit));
        dispatch(fetchInfluencersIfNeeded(nextSubreddit));
    }

    handleSort(value) {
        this.setState({selectedSort: value});
    }

    handleRefreshClick(e) {
        e.preventDefault();
        const {dispatch, selectedCollection} = this.props;
        dispatch(invalidateCollection(selectedCollection));
        dispatch(fetchInfluencersIfNeeded(selectedCollection));
    }

    sortArray(arr, sortColumn){
        return arr.concat().sort((a,b)=> b[sortColumn] - a[sortColumn]);
    }

    render() {
        const {selectedCollection, influencers, isFetching, lastUpdated, collections} = this.props;
        const {selectedSort} = this.state;
        const sortedInfluencers = this.sortArray(influencers, selectedSort);
        return (
            <div>
                <section className="section">
                    <div className="container">
                        <h1 className="title">Influencer collections</h1>
                        <h3> Search for user collections: </h3>
                        <InfluencerCollectionSelector
                            value={selectedCollection}
                            onChange={this.handleChange}
                            options={collections}
                        />
                        <h3> Sort by: </h3>
                        <InfluencerCollectionSelector
                            value={selectedSort}
                            onChange={this.handleSort}
                            options={COLLECTION_SORT_TYPES}
                        />
                    </div>
                </section>
                {influencers.length > 0 &&
                <section className="section" style={{opacity: isFetching ? 0.5 : 1}}>
                    <div className="container">
                        <InfluencerList influencers={sortedInfluencers}/>
                    </div>
                </section>}
                <section className="section">
                    <div className="container">
                        {isFetching && influencers.length === 0 && <h2>Loading...</h2>}
                        {!isFetching && influencers.length === 0 && <h2>Empty.</h2>}
                        {lastUpdated &&
                        <span>
                Last updated at {new Date(lastUpdated).toLocaleTimeString()}.{' '}
              </span>}
                        {(!isFetching || (isFetching && influencers.length > 0)) &&
                        <a className={'button is-small ' + (isFetching ? 'is-loading' : '')}
                           onClick={this.handleRefreshClick}>
                            Refresh
                        </a>}
                    </div>
                </section>
                <Notify ref={(notify)=> this.notify = notify}/>
            </div>
        );
    }
}

InfluencerCollectionPage.propTypes = {
    selectedCollection: PropTypes.string.isRequired,
    influencers: PropTypes.array.isRequired,
    collections: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const {selectedCollection, influencersByCollection, notify} = state;
    const {collections} = state.collections;
    const {isFetching, lastUpdated, influencers} = influencersByCollection[selectedCollection] || {
        isFetching: true,
        influencers: []
    };

    return {
        selectedCollection,
        influencers,
        collections,
        isFetching,
        lastUpdated,
        notify
    };
}

export default connect(mapStateToProps)(InfluencerCollectionPage);
