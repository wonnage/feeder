import React, { Component, PropTypes } from 'react';
import axios from 'axios';
import Waypoint from 'react-waypoint';
import cx from 'classnames';

import logo from './logo.svg';
import './App.css';

function Feeds({ feeds, onOpen }) {
  return (
    <div className="feeds">
      {
        Object.keys(feeds).map((fId) => {
          const feed = feeds[fId];
          return (
            <div className="feed" key={fId} onClick={() => onOpen(fId)} >
              <img src={feed.favicon_url} />
              &nbsp;
              {feed.feed_title}
            </div>
          );
        })
      }
    </div>
  );
}

class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = { activeStory: props.stories[0] && props.stories[0].guid_hash };
    this.onEnter = this.onEnter.bind(this);
  }

  onEnter(guid) {
    this.setState({ activeStory: guid });
  }

  render() {
    const { stories } = this.props;

    return (
      <div className="stories">
        {
          stories.map((s) => {
            return (
              <div
                key={s.guid_hash}
                className={cx('story', { active: this.state.activeStory === s.guid_hash })}
              >
                <Waypoint
                  bottomOffset="30%"
                  onEnter={(() => this.onEnter(s.guid_hash)).bind(this)}
                />
                <h3>
                  <a href={s.story_permalink}>
                    {s.story_title}
                  </a>
                </h3>
                <small>{s.story_date}</small>
                <div dangerouslySetInnerHTML={{ __html: s.story_content }} />
                <Waypoint
                  onEnter={(() => this.onEnter(s.guid_hash)).bind(this)}
                  topOffset="70%"
                />
              </div>
            );
          })
        }
      </div>
    );
  }
}

Stories.propTypes = {
  stories: PropTypes.arrayOf(
    PropTypes.shape({
      guid_hash: PropTypes.string,
      story_permalink: PropTypes.string,
      story_date: PropTypes.string,
      story_content: PropTypes.string,
      story_title: PropTypes.string,
    })
  ),
};

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = { stories: [] };
  }

  componentDidMount() {
    axios.get(`https://newsblur.com/reader/feed/${this.props.fId}`)
      .then((feed) => { this.setState({ stories: feed.data.stories }); });
  }

  render() {
    return (
      <div>
        <Stories stories={this.state.stories} />
        <button onClick={this.props.onClose}>Close</button>
      </div>
    );
  }
}

Feed.propTypes = {
  fId: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { feeds: {}, openFeed: null };
    this.openFeed = this.openFeed.bind(this);
    this.closeFeed = this.closeFeed.bind(this);
  }

  componentDidMount() {
    axios.get('https://newsblur.com/reader/feeds')
      .then((feeds) => { this.setState({ feeds: feeds.data.feeds }); });

    window.onpopstate = ((e) => {
      this.setState({ openFeed: e.state && e.state.openFeed });
    }).bind(this);
  }

  openFeed(fId) {
    this.setState({ openFeed: fId }, () => {
      window.history.pushState(this.state, '', `/${fId}`);
    });
  }

  closeFeed() {
    this.setState({ openFeed: null }, () => {
      window.history.pushState(this.state, '', '/');
    });
  }

  render() {
    Object.keys(this.state.feeds).map((fId) => {
      const feed = this.state.feeds[fId];
      return (
        <div key={fId}>
          <img src={feed.favicon_url} />
          {feed.feed_title}
        </div>
      );
    });
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <br />
        <div className="App-main">
          {!this.state.openFeed &&
            <Feeds feeds={this.state.feeds} onOpen={this.openFeed} />
          }
          {this.state.openFeed &&
            <Feed fId={this.state.openFeed} onClose={this.closeFeed} />
          }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  secret: PropTypes.string,
};


export default App;
