import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './InfluencerCard.css';
import AddToCollection from '../ModifyCollections/AddToCollection';
import {InfluencerCardOverview} from './InfluencerCardOverview';
import {InfluencerCardVideo} from './InfluencerCardVideo';
import RemoveFromCollection from '../ModifyCollections/RemoveFromCollection';

const CHANNEL_URL = 'https://www.youtube.com/channel/';
const CARDSHOWTYPES = {
    overview: 'Overview',
    video: 'Video',
};

function GetCardByType({type, props}){
    if (type === CARDSHOWTYPES.overview)
        return InfluencerCardOverview(props);
    if (type === CARDSHOWTYPES.video)
        return InfluencerCardVideo(props);
}

export default class InfluencerCard extends Component {
  constructor(props){
    super(props);
    this.state = {
      showType: CARDSHOWTYPES.overview
    };
    this.changeShowType = this.changeShowType.bind(this);
  }

  changeShowType(type) {
    this.setState({showType: type});
  }

  render() {
    const channelUrl = CHANNEL_URL + this.props.id;
    return (
      <div className="InfluencerCard card">
          <header className="card-header">
          <div className="media grow-self">
            <div className="media-left">
              <a href={channelUrl}>
                <figure className="image is-64x64">
                  <img src={this.props.avatarUrl} alt={this.props.name} />
                </figure>
              </a>
            </div>
            <div className="media-content">
              <div className="content">
                <strong>
                  <a href={channelUrl}>
                    {this.props.name}
                  </a>
                </strong>
              </div>
            </div>
          <div className="media-right">
              <div className="content">
                  <RemoveFromCollection influencer={this.props.id}/>
              </div>
          </div>
          <div className="media-right">
              <div className="content">
                  <AddToCollection influencer={this.props.id}/>
              </div>
          </div>
          </div>
        </header>
        <div className="card-content InfluencerCard__content">
          <div className="tabs is-toggle is-centered">
            <ul>
              <li className={this.state.showType === CARDSHOWTYPES.overview ? "is-active":''}>
                <a onClick={()=>this.changeShowType(CARDSHOWTYPES.overview)}>
                  <span className="icon is-small">
                    <i className="fa fa-image" />
                  </span>
                  <span>Overview</span>
                </a>
              </li>
              <li className={this.state.showType === CARDSHOWTYPES.video ? "is-active":''}>
                <a onClick={()=>this.changeShowType(CARDSHOWTYPES.video)}>
                  <span className="icon is-small">
                    <i className="fa fa-video-camera" />
                  </span>
                  <span>Video</span>
                </a>
              </li>
            </ul>
          </div>
         <GetCardByType type={this.state.showType} props={this.props}/>
        </div>
      </div>
    );
  }
}

InfluencerCard.propTypes = {
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  subscriberCount: PropTypes.number.isRequired,
  videoCount: PropTypes.number.isRequired,
  commentCount: PropTypes.number.isRequired,
  viewCount: PropTypes.number.isRequired,
  videoProps: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      viewCount: PropTypes.number.isRequired,
      commentCount: PropTypes.number.isRequired,
      likeCount: PropTypes.number.isRequired,
      dislikeCount: PropTypes.number.isRequired,
      duration: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string.isRequired),
      published: PropTypes.instanceOf(Date).isRequired,
  })
};
