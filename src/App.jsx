import React from 'react';
import Grid from './UI/GridList';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import ListDialog from './UI/ListDialog';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={Grid}/>
      <Route path="/playlist/:id" component={ListDialog} />
    </Switch>
  </BrowserRouter>
)

export default App;