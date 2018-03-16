import React from 'react';
import {formattedNumber} from './snippets';

export function InfluencerCardOverview(props){
    return (
        <div className="section InfluencerCard__content-numbers">
            <div className="InfluencerCard__estimated-values">
                <div className="columns has-text-centered is-mobile">
                    <div className="column is-6 InfluencerCard__estimated-installs">
                        <p className="InfluencerCard__stat-val">
                            {formattedNumber(props.subscriberCount)}
                        </p>
                        <p className="InfluencerCard__stat-label">
                            <span>Total subs.</span>
                        </p>
                    </div>
                    <div className="column is-6 InfluencerCard__estimated-cost">
                        <p className="InfluencerCard__stat-val">
                            {formattedNumber(props.viewCount)}
                        </p>
                        <p className="InfluencerCard__stat-label">
                            <span>Total views</span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="InfluencerCard__channel-stats">
                <div className="columns has-text-centered is-mobile">
                    <div className="column">
                        <div className="InfluencerCard__stat-val">
                            {formattedNumber(props.commentCount)}
                        </div>
                        <div className="InfluencerCard__stat-label">
                            <span>Channel comments</span>
                        </div>
                    </div>
                    <div className="column">
                        <div className="InfluencerCard__stat-val">
                            {formattedNumber(props.videoCount)}
                        </div>
                        <div className="InfluencerCard__stat-label">
                            <span>Total videos</span>
                        </div>
                    </div>
                </div>
                <div className="has-text-centered">
                    <p className="InfluencerCard__stat-val">
                        <span>United States</span>
                    </p>
                    <p className="InfluencerCard__stat-label">
                        <span className="flag-icon flag-icon-us" />
                    </p>
                </div>
            </div>
        </div>
    );
}