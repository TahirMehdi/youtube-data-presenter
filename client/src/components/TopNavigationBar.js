import React from 'react';
import { Link } from 'react-router';
import logo from '../logo.svg';
import './TopNavigationBar.css';

const email = 'jobs@matchmade.tv';
const md5OfEmailAddress = '11f1fd6602f601b8c1badfb72a71b47d'; // actually of info@sharkpunch.com as jobs@ doesn't have a gravatar..

export default class TopNavigationBar extends React.Component {
  renderAvatar() {
    const avatarUrl = 'https://gravatar.com/avatar/' + md5OfEmailAddress + '.jpg';
    return (
      <figure className="image">
        <img src={avatarUrl} alt={email} />
      </figure>
    );
  }

  renderEmail() {
    return (
      <span className="TopNavigationBar__email">
        {email}
      </span>
    );
  }

  render() {
    return (
      <div className="TopNavigationBar">
        <nav className="nav has-shadow">
          <div className="container">
            <div className="nav-left is-flex">
              <Link className="nav-item is-brand" to="/">
                <figure className="image">
                  <img src={logo} alt="Matchmade" />
                </figure>
              </Link>
              <Link className="nav-item" to="/collections">
                Collections
              </Link>
              <Link className="nav-item" to="/search">
                Search
              </Link>
            </div>
            <div className="nav-right is-flex">
              <span className="nav-item">
                {this.renderEmail()}
              </span>
              <span className="nav-item is-avatar">
                {this.renderAvatar()}
              </span>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
