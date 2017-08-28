import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import register from './client/registerServiceWorker';
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'development') {
  register();
}

ReactDOM.render(<App />, document.getElementById('root'));
