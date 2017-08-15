import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Dialog from 'material-ui/Dialog';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import CloseIcon from 'material-ui-icons/Close';
import Slide from 'material-ui/transitions/Slide';
import PlayList from './Playlist';

const styleSheet = createStyleSheet(() => ({
  appBar: {
    position: 'relative',
    height: 100
  },
  flex: {
    flex: 1
  }
}));

class ListDialog extends Component {
  state = {
    open: true
  }

  handleRequestClose = () => {
    this.setState({ open: false });
    this.props.history.goBack();
  };

  handleOpen = () => {
    this.setState({ open: true });
  }

  render() {
    const { classes, match: { params: { id } } } = this.props;
    return (
      <Dialog
        onRequestClose={this.handleRequestClose}
        fullScreen
        open={this.state.open}
        transition={<Slide direction="up"/>}
       >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="contrast"
              onClick={this.handleRequestClose}>
              <CloseIcon/>
            </IconButton>
            <Typography type="title" className={classes.flex} color="inherit">播放列表</Typography>
          </Toolbar>
        </AppBar>
        <PlayList id={id}/>
      </Dialog>
    );
  }
}

ListDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

const ListDialogWrapped = withStyles(styleSheet)(ListDialog);

export default ListDialogWrapped;
