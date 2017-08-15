import React from 'react';
import Grid from './UI/GridList';
import BrowserRouter from 'react-router-dom/BrowserRouter';
import Route from 'react-router-dom/Route';
import ListDialog from './UI/ListDialog';

const App = () => (
  <BrowserRouter>
    <div>
      <Route path='/' component={Grid}/>
      <Route path="/playlist/:id" component={ListDialog} />
    </div>
  </BrowserRouter>
)

export default App;