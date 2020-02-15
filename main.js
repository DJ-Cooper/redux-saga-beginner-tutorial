import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import Counter from './Counter'
import reducer from './reducers'
import rootSaga from './sagas'

/**
 * First we import our Saga from the ./sagas module. Then we create a 
 * middleware using the factory function createSagaMiddleware exported 
 * by the redux-saga library.

Before running our helloSaga, we must connect our middleware to the Store 
using applyMiddleware. Then we can use the sagaMiddleware.run(helloSaga) 
to start our Saga.

So far, our Saga does nothing special. It just logs a message then exits.

connect onIncrementAsync to a store action
 */

const sagaMiddleware = createSagaMiddleware()
const store = createStore(reducer, applyMiddleware(sagaMiddleware))
sagaMiddleware.run(rootSaga)

const action = type => store.dispatch({ type })

function render() {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() => action('INCREMENT')}
      onDecrement={() => action('DECREMENT')}
      onIncrementAsync={() => action('INCREMENT_ASYNC')}
    />,
    document.getElementById('root')
  )
}

render()
store.subscribe(render)
