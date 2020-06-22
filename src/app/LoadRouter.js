import React,  {Component} from 'react'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { Route } from 'react-router-dom'

class LoadRoute extends Component {
  componentWillMount () {
    nprogress.start()
  }

  componentDidMount () {
    nprogress.done()
  }

  render () {
    return (
      <Route {...this.props} />
    )
  }
}

export default LoadRoute