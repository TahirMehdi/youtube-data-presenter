import React from 'react';

export default class NotFound extends React.Component {
  render() {
    return (
      <div className="NotFound hero is-fullheight page-not-found">
        <div className="hero-body">
          <div className="container">
            <div className="title has-text-centered">Welcome! Get coding!</div>
          </div>
        </div>
        <div className="hero-foot has-text-centered">
          <a className="NotFound__email-link" href="mailto:jobs@matchmade.tv">
            Submit your app!
          </a>
        </div>
      </div>
    );
  }
}
