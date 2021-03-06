import React, {Component} from 'react';
import './Notify.css';

const DEFAULT_NOTIFY_TIMER = 3000;
export default class Notify extends Component {
    constructor() {
        super();
        this.wasMounted = true;
        this.key       = 0;
        this.state     = {};
    }

    componentWillUnmount() {
        this.wasMounted = false;
    }

    success(title, msg, time = DEFAULT_NOTIFY_TIMER) {
        this.addNotify(title, msg, time, 'success');
    }

    error(title, msg, time = DEFAULT_NOTIFY_TIMER) {
        this.addNotify(title, msg, time, 'error');
    }

    info(title, msg, time = DEFAULT_NOTIFY_TIMER) {
        this.addNotify(title, msg, time, 'info');
    }

    addNotify(title, msg, time, theme) {
        const key   = this.key++;
        const state = Object.assign(this.state, { [key]: { title, msg, time, theme } });

        this.setState(state, () => this.countToHide(time, key));
    }

    countToHide(duration, key) {
        setTimeout(() => {
            this.hideNotification(key);
        }, duration);
    }

    hideNotification(key) {
        if( !this.wasMounted ) {
            return;
        }

        this.setState((state) => {
            delete state[key];
            return state;
        });
    }

    item(key) {
        const { theme, title, msg } = this.state[key];

        return (
            <div key={key} className={`notify-item ${theme}`} onClick={() => this.hideNotification(key)}>
                <p className="notify-title">{title}</p>
                <p className="notify-body">{msg}</p>
            </div>
        );
    }

    render() {
        const { state } = this;
        const keys      = Object.keys(state);
        const el        = keys.map((key) => this.item(key));

        return <div className="notify-container">{el}</div>;
    }
}