import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import PlayIcon from 'material-ui-icons/PlayArrow';
import PauseIcon from 'material-ui-icons/Pause';
import Snackbar from 'material-ui/Snackbar';
// import Slide from 'material-ui/transitions/Slide';
// import { CircularProgress } from 'material-ui/Progress';
import MusicPlay from './Card';
import { api, getMusic } from '../client/recommendPlaylist.js';
import blue from 'material-ui/colors/blue';

const styleSheet = createStyleSheet(theme => ({
  root: {
    maxWidth: '50%',
    background: theme.palette.background.paper
  },
  button: {
    color: blue[300]
  }
}));

class SongList extends Component {
  state = {
    showPlaying: false,
    hasError: false,
    currentPlay: -1,
    playOrder: Array(this.props.tracks.length).fill(0).map((_, i) => i),
    currentPlaySong: {},
    completed: 0,
    iconShowPlay: false
  };

  music = document.querySelector('#music');

  handleSwitchSong = direction => {
    const { tracks } = this.props;
    const { playOrder, currentPlay } = this.state;
    const isNext = direction === 'right' ? 1 : -1;
    // 找到当前播放位置的下标的, 下一次播放的下标.
    const nextIndex = playOrder.indexOf(currentPlay) + isNext;
    if (nextIndex < 0) return;
    const nextPlayer = playOrder[nextIndex];

    this.playMusic(tracks[nextPlayer].id, nextPlayer);
  };

  componentWillUnmount() {
    this.music.pause();   
    this.audioRemoveListener();
    console.log('Bye.');
  }

  handleNextSong = () => {
    this.handleSwitchSong('right');
  };

  handlePrevSong = () => {
    this.handleSwitchSong('left');
  };

  handlePlay = () => {
    const { music } = this;
    const paused = music.paused;
    if (paused) {
      music.play();
    } else {
      music.pause();
    }
    this.setState((prev) => ({ iconShowPlay: !prev.iconShowPlay }))
    return !paused;
  };

  progress = () => {
    requestAnimationFrame((timestamp) => {
      const now = this.music.currentTime / this.music.duration * 100;
      this.setState({
        completed: now
      });
    });
  }


  eventListeners = {
    songEnded() {
      this.handleSwitchSong('right');
    },
    musicStart() {
      console.log('play start');
      this.music.play();
    },
    animationReset() {
      console.log('play again');
      clearInterval(this.animationId);
      this.setState({ showPlaying: true });
      this.animationId = setInterval(this.progress, 1000);
    },
    clearAnimation() {
      clearInterval(this.animationId);
    },
    handleError() {
      clearInterval(this.animationId);
      setTimeout(() => this.setState({ hasError: false }), 2000);
    }
  }

  audioAddListener = () => {
    const { music } = this;
    const {
      songEnded,
      musicStart,
      animationReset,
      clearAnimation,
      handleError
    } = this.eventListeners;

    music.addEventListener('ended', songEnded.bind(this));
    music.addEventListener('canplay', musicStart.bind(this));
    music.addEventListener('playing', animationReset.bind(this));
    music.addEventListener('pause', clearAnimation.bind(this));
    music.addEventListener('error', handleError.bind(this));
  }

  audioRemoveListener = () => {
    const { music } = this;
    const {
      songEnded,
      musicStart,
      animationReset,
      clearAnimation,
      handleError
    } = this.eventListeners;
    music.addEventListener('ended', songEnded.bind(this));
    music.addEventListener('canplay', musicStart.bind(this));
    music.addEventListener('playing', animationReset.bind(this));
    music.addEventListener('pause', clearAnimation.bind(this));

    music.addEventListener('error', handleError.bind(this));
  }

  setCurrentPlaySong = (track, currentPlay) => {
    const { name: songName, ar: [{ name: singer }], al: { picUrl } } = track;
    this.setState({
      currentPlaySong: { songName, singer, picUrl },
      currentPlay
    });
  };

  componentDidMount() {
    this.audioAddListener();
  }

  componentWillReceiveProps(nextProps) {
    const { playOrder } = nextProps;
    if (!playOrder) return;
    this.setState({ playOrder }, () => {
      const findId = this.props.tracks[playOrder[0]].id;
      this.playMusic(findId, playOrder[0]);
    });
  }

  playMusic(id, nextIndex) {
    const { tracks } = this.props;
    const { currentPlay } = this.state;

    const indexBeClick =
      nextIndex === undefined
        ? tracks.findIndex(track => track.id === id)
        : nextIndex;

    const track = tracks[indexBeClick];

    if (indexBeClick === currentPlay) {
      this.handlePlay();
    } else {
      getMusic(api.music, { id })
        .then(({ data: [{ url }] }) => {
          try {
            this.music.src = url;
            // this.music.play();
            this.setState({ completed: 0 });
          } catch (err) {
            return Promise.reject(err);
          }
        })
        .then(() => {
          console.log('get music?');
          this.setCurrentPlaySong(track, indexBeClick);
        })
        .catch(error => {
          console.log('error!   ', error);
          cancelAnimationFrame(this.animationId);
          this.setState({
              hasError: true
            },
            () => {
              setTimeout(() => this.setState({ hasError: false }), 2000);
            }
          );
        });
    }
  }

  handleClickItem = e => {
    const target = e.target;
    let id;
    if (target.tagName === 'LI') {
      id = target.children[1].id;
    } else if (target.tagName === 'H3') {
      id = target.parentNode.id;
    } else if (target.tagName === 'DIV') {
      id = target.id;
    }
    this.playMusic(+id);
  };

  render() {
    const { currentPlay, iconShowPlay } = this.state;
    const { tracks, classes } = this.props;
    return (
      <div>
        <List className={classes.root} onClick={this.handleClickItem}>
          {tracks.map(({ name, id }, i) =>
            <ListItem button key={id}>
              <ListItemIcon>
                {currentPlay === i && !iconShowPlay
                  ? <PauseIcon className={classes.button} />
                  : <PlayIcon className={classes.button} />}
              </ListItemIcon>
              <ListItemText inset primary={name} id={id} />
            </ListItem>
          )}
        </List>
        <MusicPlay
          show={this.state.showPlaying}
          {...this.state.currentPlaySong}
          handleNextSong={this.handleNextSong}
          handlePrevSong={this.handlePrevSong}
          handlePlay={this.handlePlay}
          progress={this.state.completed}
          iconShowPlay={iconShowPlay}
        />
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={this.state.hasError}
          message={
            <p>
              出错了<span role="img" aria-label="emoji">
                🙈!
              </span>{' '}
              应该是网络问题
            </p>
          }
        />
      </div>
    );
  }
}

SongList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styleSheet)(SongList);
