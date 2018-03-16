import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class InfluencerSearch extends Component {
  input = '';

  constructor(props){
    super(props);
    this.focus = this.focus.bind(this);
  }

  focus(){
    this.input.focus();
  }

  render() {
    const { onChange } = this.props;
    return (
      <div className="is-flex">
        <p className="control">
          <input className="input" ref={i => (this.input = i)}
                 type="text" placeholder="Search criteria"
                 onKeyUp={e => e.key ==='Enter' && onChange(this.input)} />
        </p>
        <p className="control">
            <a className="button" onClick={e=> onChange(this.input)}>Search</a>
        </p>
      </div>
    );
  }
}

InfluencerSearch.propTypes = {
  onChange: PropTypes.func.isRequired
};
