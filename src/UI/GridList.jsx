import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { GridList, GridListTile, GridListTileBar } from 'material-ui/GridList';
import Subheader from 'material-ui/List/ListSubheader';
import IconButton from 'material-ui/IconButton';
import Headset from 'material-ui-icons/Headset';
import { LinearProgress } from 'material-ui/Progress';
import { api, getMusic } from '../client/recommendPlaylist.js';
import { Link } from 'react-router-dom';
import Appbar from './Appbar';

const styleSheet = theme => ({
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
});

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
    const { id, name, picUrl, copywriter, playCount } = this.props;
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
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <IconButton>
              <Headset color="rgba(255, 255, 255, 0.54)" />
            </IconButton>
            <span style={{ color: 'white', marginTop: -10, fontSize: 12}}>{(playCount / 10000).toFixed(1)}万</span>
            </div>
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
          <Appbar/>
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
