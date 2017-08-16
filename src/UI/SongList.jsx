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
    completed: 0
  };

  music = document.querySelector('#music');

  handleSwitchSong = direction => {
    const { tracks } = this.props;
    const { playOrder, currentPlay } = this.state;
    const isNext = direction === 'right' ? 1 : -1;
    const nextPlayer = playOrder.indexOf(currentPlay) + isNext;
    if (nextPlayer < 0) return;

    this.playMusic(tracks[nextPlayer].id, nextPlayer);
  };

  handleNextSong = () => {
    this.handleSwitchSong('right');
  };

  handlePrevSong = () => {
    this.handleSwitchSong('left');
  };

  handlePlay = () => {
    if (this.music.paused) {
      this.music.play();
    } else {
      this.music.pause();
    }
  };

  progress = () => {
    const now = Math.floor(this.music.currentTime / this.music.duration * 100);
    this.setState({
      completed: now
    });
    if (now >= 100) {
      clearInterval(this.interval);
    }
  }
  audioEventListener = (music = this.music) => {
    music.addEventListener('ended', e => {
      this.handleSwitchSong('right');
    });

    music.addEventListener('playing', () => {
      console.log('play start');
      this.music.play();
      this.setState({ showPlaying: true });
      this.interval = setInterval(this.progress, 500);
    });

    music.addEventListener('pause', () => {
      clearInterval(this.interval);
    })
  };

  setCurrentPlaySong = (track, currentPlay) => {
    const { name: songName, ar: [{ name: singer }], al: { picUrl } } = track;
    this.setState({
      currentPlaySong: { songName, singer, picUrl },
      currentPlay
    });
  };

  componentDidMount() {
    this.audioEventListener();
  }

  componentWillReceiveProps(nextProps) {
    const { playOrder } = nextProps;
    this.setState({ playOrder, currentPlay: playOrder[0] }, () => {
      const findId = this.props.tracks[playOrder[0]].id;
      this.playMusic(findId);
    });
  }

  playMusic(id, nextIndex) {
    const { tracks, playOrder } = this.props;
    const { currentPlay } = this.state;

    const indexBeClick =
      nextIndex === undefined
        ? tracks.findIndex(track => track.id === id)
        : nextIndex;

    const track = tracks[playOrder[indexBeClick]];
    console.log(indexBeClick, track);

    if (indexBeClick === currentPlay) {
      if (this.music.paused) {
        this.music.play();
      } else {
        this.music.pause();
      }
    } else {
      getMusic(api.music, { id })
        .then(({ data: [{ url }] }) => {
          try {
            this.music.src = url;
            this.music.play();
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
          this.setState(
            {
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
    const { tracks, classes } = this.props;
    return (
      <div>
        <List className={classes.root} onClick={this.handleClickItem}>
          {tracks.map(({ name, id }, i) =>
            <ListItem button key={id}>
              <ListItemIcon>
                {this.state.currentPlay === i
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
