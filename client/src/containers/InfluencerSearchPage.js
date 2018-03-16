import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InfluencerList from '../components/InfluencerList';
import InfluencerSearch from '../components/InfluencerSearch';
import {fetchCollections, fetchSearchInfluencers} from '../redux/actions';
import {invalidateSearchInfluencers} from '../redux/actions';
import Notify from '../helpers/Notify';
import InfluencerCollectionSelector from '../components/InfluencerCollectionSelector';
import {INFLUENCER_SEARCH_COUNT, INFLUENCER_SEARCH_TOP_TYPES} from '../helpers/constants';

class InfluencerSearchPage extends Component {
    notify = null;
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSortBySearchType = this.handleSortBySearchType.bind(this);
        this.handleSortBySearchCount = this.handleSortBySearchCount.bind(this);
        this.state = {
            selectedSearchType: INFLUENCER_SEARCH_TOP_TYPES[0].id,
            selectedSearchCount: INFLUENCER_SEARCH_COUNT[0].id,
        };
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(fetchCollections());
    }
    componentDidUpdate() {
        const {notify} = this.props;
        if (notify.type)
            this.notify[notify.type](notify.title, notify.message);
    }

    handleChange(event) {
        const { dispatch } = this.props;
        const {selectedSearchType, selectedSearchCount} = this.state;
        dispatch(fetchSearchInfluencers(event.value, selectedSearchType, selectedSearchCount));
    }

    handleSortBySearchType(value) {
        this.setState({selectedSearchType: value});
    }

    handleSortBySearchCount(value) {
        this.setState({selectedSearchCount: value});
    }

    render() {
        const { isFetching, influencers } = this.props;
        const {selectedSearchType, selectedSearchCount} = this.state;
        return (
            <div>
              <section className="section">
                <div className="container">
                    <h1 className="title">Influencer collections</h1>
                    <h3> Sort by: </h3>
                    <div className="is-flex">
                        <InfluencerCollectionSelector
                            value={selectedSearchType}
                            onChange={this.handleSortBySearchType}
                            options={INFLUENCER_SEARCH_TOP_TYPES}
                        />
                        <InfluencerCollectionSelector
                            value={selectedSearchCount}
                            onChange={this.handleSortBySearchCount}
                            options={INFLUENCER_SEARCH_COUNT}
                        />
                        <InfluencerSearch
                            onChange={this.handleChange}
                        />
                    </div>

                </div>
              </section>
                {influencers.length > 0 &&
                <section className="section" style={{ opacity: isFetching ? 0.5 : 1 }}>
                  <div className="container">
                    <InfluencerList influencers={influencers} />
                  </div>
                </section>}
              <section className="section">
                <div className="container">
                    {isFetching && influencers.length === 0 && <h2>Loading...</h2>}
                    {!isFetching && influencers.length === 0 && <h2>No data</h2>}
                </div>
              </section>
              <Notify ref={(notify)=> this.notify = notify}/>
            </div>
        );
    }

    componentWillUnmount(){
        const { dispatch } = this.props;
        dispatch(invalidateSearchInfluencers());
    }
}

InfluencerSearchPage.propTypes = {
    isFetching: PropTypes.bool.isRequired,
    criteria: PropTypes.string.isRequired,
    influencers: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    const { searchInfluencers, notify } = state;
    const { isFetching, criteria, influencers } = searchInfluencers || {
        isFetching: false,
        criteria: '',
        influencers: []
    };

    return {
        isFetching,
        criteria,
        influencers,
        notify
    };
}

export default connect(mapStateToProps)(InfluencerSearchPage);