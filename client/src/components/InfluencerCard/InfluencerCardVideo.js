import React from 'react';
import {formattedDate, formattedNumber} from './snippets';

export function InfluencerCardVideo(props){
    const src = 'http://www.youtube.com/embed/' + props.videoProps.id;
    return (
        <div className="section">
            <iframe title={props.videoProps.title} className="youtube-player is-centered" type="text/html"
                    width="100%" height="100%" src={src}
                    frameBorder="0" allowFullScreen>
            </iframe>
            <div className="columns has-text-centered is-mobile">
                <div className="column InfluencerCard__estimated-installs">
                    <div className="InfluencerCard__stat-val">
                        {formattedNumber(props.videoProps.viewCount)}
                    </div>
                    <div className="InfluencerCard__stat-label">
                        <span>Total views</span>
                    </div>
                </div>
                <div className="column InfluencerCard__estimated-installs">
                    <div className="InfluencerCard__stat-val">
                        {formattedNumber(props.videoProps.commentCount)}
                    </div>
                    <div className="InfluencerCard__stat-label">
                        <span>Total comments</span>
                    </div>
                </div>
            </div>
            <div className="columns has-text-centered is-mobile">
                <div className="column ">
                    <div className="InfluencerCard__stat-val">
                    <span className="icon is-medium">
                        <i className="fa fa-thumbs-up" />
                    </span>
                        <span> {formattedNumber(props.videoProps.likeCount)}</span>
                    </div>
                </div>
                <div className="column ">
                    <div className="InfluencerCard__stat-val">
                    <span className="icon is-medium">
                        <i className="fa fa-thumbs-down" />
                    </span>
                        <span> {formattedNumber(props.videoProps.dislikeCount)}</span>
                    </div>
                </div>
            </div>
            <div className="has-text-centered">
                <p className="InfluencerCard__stat-label">
                    <span>Published on {formattedDate(props.videoProps.published)}</span>
                </p>
            </div>
        </div>)
}