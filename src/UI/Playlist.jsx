import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import classnames from 'classnames';
import Card, {
  CardHeader,
  CardMedia,
  CardContent,
  CardActions
} from 'material-ui/Card';
import Collapse from 'material-ui/transitions/Collapse';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import red from 'material-ui/colors/red';
import FavoriteIcon from 'material-ui-icons/Favorite';
import ShareIcon from 'material-ui-icons/Share';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { CircularProgress } from 'material-ui/Progress';
import SongList from './SongList';
import { api, getMusic } from '../client/recommendPlaylist.js';

const styleSheet = createStyleSheet(theme => ({
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
    height: 300
  }
}));

class PlayList extends Component {
  state = {
    expanded: false,
  };

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  componentDidMount() {
    if (this.state.playlist) return;
    getMusic(api.playlist, { id: this.props.id })
      .then(list => {
        this.setState({
          playlist: list.playlist
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    if (!this.state.playlist) return <CircularProgress
      color="accent" size={80} 
      style={{margin: 'auto', padding: '0 0 10px 0', width: 180}}
    />
    const classes = this.props.classes;
    const { name, coverImgUrl, tags, description, tracks } = this.state.playlist;
    return (
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                R
              </Avatar>
            }
            title={name}
            subheader={tags.join(', ')}
          />
          <CardMedia>
            <img src={coverImgUrl}
              className={classes.cardImg}
              alt="Contemplative Reptile" />
          </CardMedia>
          <CardContent>
            <Typography component="p">{description}</Typography>
          </CardContent>
          <CardActions disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
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
              <SongList
              tracks={tracks} />
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
