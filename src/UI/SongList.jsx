import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import PlayIcon from 'material-ui-icons/PlayArrow';
import PauseIcon from 'material-ui-icons/Pause';
import { api, getMusic } from '../client/recommendPlaylist.js';
import blue from 'material-ui/colors/blue';

const styleSheet = createStyleSheet(theme => ({
  root: {
    maxWidth: '80%',
    background: theme.palette.background.paper
  },
  button: {
    color: blue[300]
  }
}));

class SongList extends Component {
  state = {
    currentPlay: {}
  };

  handleClickItem = e => {
    const target = e.target;
    console.log(target);
    let id;
    if (target.tagName === 'LI') {
      id = target.children[1].id;
    } else if (target.tagName === 'H3') {
      id = target.parentNode.id;
    } else if (target.tagName === 'DIV') {
      id = target.id;
    }

    console.log(id);
    let music = document.querySelector('#music');
    if (this.state.currentPlay[id] === true) {
      this.setState(
        prev => {
          return Object.assign(prev, { [id]: false });
        },
        () => music.pause()
      );
    } else if (this.state.currentPlay[id] === false) {
      this.setState(
        prev => {
          return Object.assign(prev, { [id]: true });
        },
        () => music.play()
      );
    } else {
      getMusic(api.music, { id: id })
        .then(({ data: [{ url }] }) => {
        music.src = url;
        music.play();
      }).then(() => {
        this.setState((prev) => {
          Object.assign(prev, { [id]: true })
        });
      }).catch(err => console.log(err));
    }
  }

  render() {
    const { tracks, classes } = this.props;
    return (
      <List className={classes.root} onClick={this.handleClickItem}>
        {tracks.map(({ name, id }) =>
          <ListItem button key={id}>
            <ListItemIcon>
              {!!this.state.currentPlay[`${id}`]
                ? <PauseIcon className={classes.button} />
                : <PlayIcon className={classes.button} />}
            </ListItemIcon>
            <ListItemText inset primary={name} id={id} />
          </ListItem>
        )}
      </List>
    );
  }
}

SongList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styleSheet)(SongList);
