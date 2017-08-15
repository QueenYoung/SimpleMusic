import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStyleSheet, withStyles } from 'material-ui/styles';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import Subheader from 'material-ui/List/ListSubheader';
import IconButton from 'material-ui/IconButton';
import InfoIcon from 'material-ui-icons/Info';
import { LinearProgress } from 'material-ui/Progress';
// import { CircularProgress } from 'material-ui/Progress';
import { api, getMusic } from '../client/recommendPlaylist.js';
import { Link } from 'react-router-dom';

const styleSheet = createStyleSheet(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper
  },
  gridList: {
    width: '80%',
    height: 'auto'
  },
  progress: {
    width: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'auto'
    // margin: `${theme.spacing.unit * 4}px  0`
  },
}));

/**
 * 
 * the musicPlaylist Json
 * result: Array
 * {
 *   id,
 *   name,
 *   picUrl,
 *   trackCount,
 *   copywriter
 * }
 */

class GridMusicList extends Component {
  static PropTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    picUrl: PropTypes.string.isRequired,
    trackCount: PropTypes.number.isRequired,
    copywriter: PropTypes.string.isRequired
  };
  state = {
    playlist: []
  };

  render() {
    const { id, name, picUrl, copywriter } = this.props;
    return (
      <GridListTile style={{ width: '48%', margin: 10, borderRadius: 10 }}>
        <Link to={`playlist/${id}`}>
          <img
            src={picUrl}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Link>
        <GridListTileBar
          title={name}
          subtitle={
            <span>
              by: {copywriter}
            </span>
          }
          actionIcon={
            <IconButton>
              <InfoIcon color="rgba(255, 255, 255, 0.54)" />
            </IconButton>
          }
        />
      </GridListTile>
    );
  }
}

class TitlebarGridList extends Component {
  state = {
    musicPlaylist: []
  };

  componentDidMount() {
    getMusic(api.recommendPlaylist)
      .then(playlist =>
        this.setState({
          musicPlaylist: playlist.result
        })
      )
      .catch(err => console.log(err));
  }

  render() {
    const { musicPlaylist } = this.state;
    const { classes } = this.props;
    const hasLoad = !!musicPlaylist.length;
    return (
      <div className={classes.container}>
        <GridList cellHeight={hasLoad ? 300 : 20} className={classes.gridList}
          cols={hasLoad ? 2 : 1} spacing={10}>
          <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
            <Subheader>热门歌单</Subheader>
          </GridListTile>
          {!!musicPlaylist.length
            ? musicPlaylist.map(playlistMetaData =>
                <GridMusicList
                  {...playlistMetaData}
                  key={playlistMetaData.id}
                />)
            : <div className={classes.progress}>
              <LinearProgress color="accent" mode="query" style={{ width: 'inherit'}} />
              <br/>
              <LinearProgress mode="query" style={{ width: 'inherit' }}/>
              </div>}
        </GridList>
      </div>
    );
  }
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styleSheet)(TitlebarGridList);
