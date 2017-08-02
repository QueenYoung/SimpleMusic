import React, { Component } from 'react';
import Remarkable from 'remarkable';

class Editor extends Component {
  state = {
    input: ''
  }

  handleChange = (event) => {
    this.setState({
      input: event.target.value
    })
  }

  getRawMarkUp() {
    const _md = new Remarkable('full');
    return {
      __html: _md.render(this.state.input)
    }
  }

  render() {
    return (
      <div>
        <h3>
          <textarea onChange={this.handleChange} defaultValue={this.state.value}></textarea>
        </h3>
        <h3>Output</h3>
        <div className="content" dangerouslySetInnerHTML={this.getRawMarkUp()}></div>
      </div>
    )
  }
}

export default Editor;