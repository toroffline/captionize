import { h, render } from 'preact'
import { App } from './src/app'
import "./style.scss"

const bodyEl = document.getElementById('app')

if (bodyEl) {
  render(<App />, bodyEl)
}
