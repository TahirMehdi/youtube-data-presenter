import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {removeInfluencerFromCollection} from '../../redux/actions';
import './AddToCollection.css';
import {connect} from 'react-redux';

class RemoveFromCollection extends Component {
    constructor(props) {
        super(props);
        this.removeFromCollection = this.removeFromCollection.bind(this);
    }

    removeFromCollection() {
        console.warn('removed');
        this.props.dispatch(removeInfluencerFromCollection(this.props.influencer, this.props.selectedCollection));
    }

    render() {
        return (
            <div>
                <a onClick={this.removeFromCollection}>
                    <div className="icon is-large">
                        <i className="fa fa-minus"/>
                    </div>
                </a>
            </div>
        );
    }
}

RemoveFromCollection.propTypes = {
    selectedCollection: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    influencer: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    const {selectedCollection} = state;
    return {
        selectedCollection
    };
}

export default connect(mapStateToProps)(RemoveFromCollection);