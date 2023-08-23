import 'preact/debug';
import { h, render } from 'preact';
import { App } from './src/app';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.scss';

const bodyEl = document.getElementById('app');

if (bodyEl) {
  render(<App />, bodyEl);
}
