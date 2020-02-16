/**
 * We create a delay function that returns a Promise that will resolve after a
 * specified number of milliseconds. We'll use this function to block
 * the Generator.
 *
 * Sagas are implemented as Generator functions that YIELD objects to the redux
 * saga middleware. The yielded objects are a kind of instruction to be
 * interpreted by the middleware.
 *
 *    Generator functions: function*
 *    returns a generator object (yields sequence of values)
 *      Generator.next() = yielded value
 *      Generator.return() = returns value and finishes generator.
 *
 * When a Promise is yielded to the middleware, the middleware will suspend the
 * Saga until until the Promise completes.
 *
 * The incrementAsync Saga is suspended until the Promise returned by delay resolves,
 * which will happen after 1 second.
 *
 * Once the Promise is resolved, the middleware will resume the Saga, executing code
 * until the next yield. In this example, the next statement is another yielded
 * object: the result of calling put({type: 'INCREMENT'}) which instructs the
 * middleware to dispatch an INCREMENT action.
 *
 * put is one example of what we call an Effect. Effects are plain Javascript objects {}
 * which contain instructions to be fulfilled by the middleware. When a middleware
 * retrieves an Effect yielded by a Saga, the Saga is paused until the effect is
 * fulfilled.
 */

import { put, takeEvery, all, call } from 'redux-saga/effects'

export const delay = ms => new Promise(res => setTimeout(res, ms))

function* helloSaga() {
  console.log('Hello Sagas!')
}

/**
 * incrementAsync Saga sleeps for 1 second via the call to delay(1000),
 * then dispatches an INCREMENT action.
 * yield [promise()]
 */

export function* incrementAsync() {
  yield call(delay, 1000)
  yield put({ type: 'INCREMENT' })
}

/**
 * watchIncrementAsync Saga uses takeEvery, a helper function provided
 * by redux-saga, to listen for dispatched INCREMENT_ASYNC actions and
 * run incrementAsync each time.
 */

function* watchIncrementAsync() {
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
}

/**
 * Notice how we now only export the rootSaga
 * single entry point to start all sagas at once
 */

export default function* rootSaga() {
  yield all([helloSaga(), watchIncrementAsync()])
}
