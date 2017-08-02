import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import SkipPreviousIcon from 'material-ui-icons/SkipPrevious';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import SkipNextIcon from 'material-ui-icons/SkipNext';
import Album from '../public/images/elyse.png';

const styleSheet = createStyleSheet({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  album: {
    maxWidth: '100%',
    height: 'auto',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 8,
    paddingBottom: 8,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
});

const NowPlayingCard = ({ classes }) => (
  <div>
    <Card className={classes.card}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography type="headline">Live From Space</Typography>
          <Typography type="subheading" color="secondary">
            Mac Miller
          </Typography>
        </CardContent>
        <div className={classes.controls}>
          <IconButton aria-label="Previous">
            <SkipPreviousIcon />
          </IconButton>
          <IconButton aria-label="Play/pause">
            <PlayArrowIcon className={classes.playIcon} />
          </IconButton>
          <IconButton aria-label="Next">
            <SkipNextIcon />
          </IconButton>
        </div>
      </div>
      <div className={classes.cover}>
        <img alt="Live from space album cover" src={Album} className={classes.album} />
      </div>
    </Card>
  </div>
);
NowPlayingCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(NowPlayingCard);
