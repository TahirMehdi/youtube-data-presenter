import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class InfluencerCollectionPage extends Component {
  render() {
    const { value, onChange, options } = this.props;
    return (
      <span className="field">
        <div className="control">
          <div className="select">
            <select onChange={e => onChange(e.target.value)} value={value}>
              {options.map(option =>
                <option value={option.id} key={option.id}>
                  {option.name}
                </option>
              )}
            </select>
          </div>
        </div>
      </span>
    );
  }
}

InfluencerCollectionPage.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
