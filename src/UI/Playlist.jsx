import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import Card, {
  CardHeader,
  CardContent,
  CardActions
} from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShuffleIcon from 'material-ui-icons/Shuffle';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { CircularProgress } from 'material-ui/Progress';
import SongList from './SongList';
import { api, getMusic } from '../client/recommendPlaylist.js';

const styleSheet = theme => ({
  card: {
    maxWidth: '100%',
    overflow: 'auto'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  },
  flexGrow: {
    flex: '1 1 auto'
  },
  cardImg: {
    objectFit: 'cover',
    height: 300,
    marginLeft: '1rem'
  }
});

class PlayList extends Component {
  state = {
    expanded: true
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  componentWillUnmount() {
    console.log('I am die!');
  }

  handleShuffleClick = () => {
    let length = this.state.playlist.tracks.length;
    if (!length) return;
    this.setState({
      playOrder: shuffle(length)
    });
  };

  componentDidMount() {
    getMusic(api.playlist, { id: this.props.id })
      .then(list => {
        console.log(`get playlist with ${this.props.id}.`);
        this.setState({
          playlist: list.playlist
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (!this.state.playlist)
      return (
        <CircularProgress
          color="accent"
          size={80}
          style={{ margin: 'auto', padding: '0 0 10px 0', width: 180 }}
        />
      );
    const classes = this.props.classes;
    const {
      playOrder,
      playlist: {
        name,
        coverImgUrl,
        tags,
        description,
        tracks,
        creator: { avatarUrl }
      }
    } = this.state;
    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              aria-label="Recipe"
              className={classes.avatar}
              src={avatarUrl}
            />
          }
          title={name}
          subheader={tags.join(', ')}
        />
        <img className={classes.cardImg} src={coverImgUrl} alt="playlist cover"/>
        <CardContent>
          <Typography component="p" style={{ maxWidth: '50%' }}>
            {description}
          </Typography>
        </CardContent>
        <CardActions disableActionSpacing>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton
            aria-label="ShufflePlay"
            onClick={this.handleShuffleClick}
          >
            <ShuffleIcon />
          </IconButton>
          <div className={classes.flexGrow} />
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse
          in={this.state.expanded}
          transitionDuration="auto"
          unmountOnExit
        >
          <CardContent>
            <Typography paragraph type="headline">
              {`播放列表: 共 ${tracks.length} 首歌`}
            </Typography>
            <SongList {...{ tracks, playOrder }} />
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

PlayList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styleSheet)(PlayList);

function shuffle(length) {
  let array = Array(length).fill(0).map((_, i) => i);
  for (let i = 0; i < length - 1; ++i) {
    let rdi = ~~(Math.random() * (length - i)) + i;
    [array[i], array[rdi]] = [array[rdi], array[i]];
  }
  return array;
}
