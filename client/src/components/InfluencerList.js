import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InfluencerCard from './InfluencerCard/InfluencerCard';

export default class InfluencerList extends Component {
  render() {
    return (
      <div className="columns is-multiline">
        {this.props.influencers.map(influencer => {
          return (
            <div className="column is-half-tablet is-one-third-desktop is-fullwidth" key={influencer.id}>
              <InfluencerCard {...influencer} />
            </div>
          );
        })}
      </div>
    );
  }
}

InfluencerList.propTypes = {
  influencers: PropTypes.array.isRequired
};
