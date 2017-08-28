import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import SkipPreviousIcon from 'material-ui-icons/SkipPrevious';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import PauseIcon from 'material-ui-icons/Pause';
import blue from 'material-ui/colors/lightBlue';
import SkipNextIcon from 'material-ui-icons/SkipNext';
import { LinearProgress } from 'material-ui/Progress';

const styleSheet = {
  card: {
    display: 'flex',
    backgroundColor: blue[50],
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0
  },
  details: {
    display: 'flex',
    flex: '4 0 80%'
  },
  content: {
    flex: '1 0 80%'
  },
  cover: {
    width: 100,
    height: 100,
    display: 'flex'
  },
  album: {
    maxWidth: '100%',
    height: 'auto'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    flex: '1 0 10%'
  },
  playIcon: {
    height: 38,
    width: 38
  },
  right: {
    flex: '4 0 80%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }
};

class NowPlayingCard extends Component {
  state = {
    played: true,
    completed: 0
  };

  onClickPlayButton = () => {
    const playState = this.props.handlePlay();
    this.setState(prevState => {
      return {
        played: !playState
      };
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({played: !nextProps.iconShowPlay})
  }

  render() {
    const { classes, songName, singer, picUrl, show } = this.props;
    return (
      <Card className={classes.card} raised
        style={{ visibility: show ? 'visible' : 'hidden' }}>
        <div className={classes.details}>
          <div className={classes.cover}>
            <img
              alt="Live from space album cover"
              src={picUrl}
              className={classes.album}
            />
          </div>

          <div className={classes.right}>
            <CardContent className={classes.content}>
              <Typography type="headline">
                {songName}
              </Typography>
              <Typography type="subheading" color="secondary">
                {singer}
              </Typography>
              <LinearProgress mode='determinate' value={this.props.progress}/>
            </CardContent>
            <CardActions className={classes.controls}>
              <IconButton
                aria-label="Previous"
                onClick={this.props.handlePrevSong}
              >
                <SkipPreviousIcon />
              </IconButton>
              <IconButton
                aria-label="Play/pause"
                onClick={this.onClickPlayButton}
              >
                {this.state.played
                  ? <PauseIcon className={classes.playIcon} />
                  : <PlayArrowIcon className={classes.playIcon} />}
              </IconButton>
              <IconButton
                aria-label="Next"
                onClick={this.props.handleNextSong}
              >
                <SkipNextIcon />
              </IconButton>
            </CardActions>
          </div>
        </div>
      </Card>
    );
  }
}

NowPlayingCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styleSheet)(NowPlayingCard);
