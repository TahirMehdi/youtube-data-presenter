import React, { Component } from 'react';
import TopNavigationBar from './TopNavigationBar';

export default class Layout extends Component {
  renderBody() {
    return this.props.children
      ? React.cloneElement(this.props.children, {
          key: this.props.location.pathname
        })
      : null;
  }
  render() {
    return (
      <div className="Layout">
        <header className="header">
          <TopNavigationBar location={this.props.location} />
        </header>
        {this.renderBody()}
      </div>
    );
  }
}
