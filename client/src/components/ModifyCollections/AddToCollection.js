import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InfluencerCollectionSelector from '../InfluencerCollectionSelector';
import {addNewInfluencerToCollection} from '../../redux/actions';
import './AddToCollection.css';
import {connect} from 'react-redux';
import {OutsideAlerter} from '../../helpers/OutsideAlerter';

class AddToCollection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCollection: '',
            shouldShowAddToCollection: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.addToCollection = this.addToCollection.bind(this);
        this.toggleAddToCollection = this.toggleAddToCollection.bind(this);
        this.hideAddToCollection = this.hideAddToCollection.bind(this);
    }

    componentDidMount() {
        this.setState({selectedCollection: this.props.collections[0]? this.props.collections[0].id : ''});
    }

    handleChange(value) {
        this.setState({selectedCollection: value})
    }

    addToCollection() {
        this.props.dispatch(addNewInfluencerToCollection(this.props.influencer, this.state.selectedCollection));
    }

    hideAddToCollection() {
        this.setState({shouldShowAddToCollection: false});
    }

    toggleAddToCollection() {
        this.setState({shouldShowAddToCollection: !this.state.shouldShowAddToCollection});
    }

    render() {
        return (
            <OutsideAlerter alerter={this.hideAddToCollection}>
                <div>
                    <a onClick={this.toggleAddToCollection}>
                        <div className="icon is-large">
                            <i className="fa fa-plus"/>
                        </div>
                    </a>
                    {
                        this.state.shouldShowAddToCollection &&
                        <div className='add-to-collection'>
                            <div className='content'>
                                <div>
                                    Add to collections:
                                </div>
                                <InfluencerCollectionSelector
                                    value={this.state.selectedCollection}
                                    onChange={this.handleChange}
                                    options={this.props.collections}
                                />
                                <a onClick={this.addToCollection}>
                                    <div className="icon is-medium">
                                        <i className="fa fa-check"/>
                                    </div>
                                </a>
                            </div>
                        </div>
                    }
                </div>
            </OutsideAlerter>
        );
    }
}

AddToCollection.propTypes = {
    collections: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    influencer: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    let collections = state.collections.collections.filter(e=> e.id!== state.selectedCollection );
    return {
        collections
    };
}

export default connect(mapStateToProps)(AddToCollection);