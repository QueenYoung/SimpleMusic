// eslint-disable-next-line
import React from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import '../App.css';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

const styles = {
  fill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  nav: {
    padding: 0,
    margin: 0,
    position: 'absolute',
    top: 0,
    height: 40,
    width: '100%',
    display: 'flex',
  },
  navItem: {
    textAlign: 'center',
    flex: 1,
    listStyleType: 'none',
    padding: 10,
  },
};
styles.content = {
  ...styles.fill,
  top: 40,
  textAlign: 'center',
};
styles.hsl = {
  ...styles.fill,
  color: 'white',
  paddingTop: 20,
  fontSize: 30,
};

const HSL = ({ match: { params } }) =>
  (<div
    style={{
      ...styles.fill,
      ...styles.hsl,
      background: `hsl(${params.h}, ${params.s}%, ${params.l}%)`,
    }}
  >
    hsl({params.h}, {params.s}%, {params.l}%){' '}
  </div>);
const NavLink = props =>
  (<li style={styles.navItem}>
    <Link {...props} style={{ color: 'inherit' }} />
  </li>);

const AnimationExample = () =>
  (<Router>
    <Route
      render={({ location }) => (
        <div style={styles.fill}>
          <Route exact path="/" render={() => <Redirect to="/10/90/50" />} />

          <ul style={styles.nav}>
            <NavLink to="/10/90/50">Red</NavLink>
            <NavLink to="/120/100/40">Green</NavLink>
            <NavLink to="/200/100/40">Blue</NavLink>
            <NavLink to="/310/100/40">Pink</NavLink>
          </ul>

          <div style={styles.content}>
            <CSSTransition
              classNames="fade"
              timeout={{ exit: 300, enter: 300 }}
            >
              <Route
                location={location}
                key={location.key}
                path="/:h/:s/:l"
                component={HSL}
              />
            </CSSTransition>
          </div>
        </div>)}
    />
  </Router>);

export default AnimationExample;
