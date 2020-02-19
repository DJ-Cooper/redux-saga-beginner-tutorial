/**
 * Milestone: 2.3 completed
 *
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
 *
 * Generator
 * yield
 * Promise
 * Effect
 */

// put is a DISPATCH command! **********************

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

/**
 * helper functions:
 * takeEvery, takeLatest
 *
 * example: takeEvery allows multiple fetchData instances to be
 * started concurrently. At a given moment, we can start a new fetchData
 * task while there are still one or more previous fetchData tasks
 * which have not yet terminated.
 *      takeLatest only gets response of latest request fired.
 *
 * takeLatest allows only one fetchData task to run
 */

export function* fetchData(action) {
    try {
        const data = yield call(Api.fetchUser, action.payload.url)
        yield put({ type: 'FETCH_SUCCEEDED', data })
    } catch (error) {
        yield put({ type: 'FETCH_FAILED', error })
    }
}

/**
 * To launch fetchData on each FETCH_REQUESTED action
 * takeEvery allows multiple fetchData instances to be
 * started concurrently. At a given moment, we can start
 * a new fetchData task while there are still one or more
 * previous fetchData tasks which have not yet terminated.
 */

function* watchFetchData() {
    yield takeEvery('FETCH_REQUESTED', fetchData)

    /**
     * If we want to only get the response of the latest
     * request fired, takeLatest:
     * yield takeLatest('FETCH_REQUESTED', fetchData)
     * - only allows one fetchData task in given moment
     * - it will be latest started task
     * - previous task will be cancelled!
     *
     */
}

// Milestone: 2.1 completed.
const dummyApi = {
    fetch: path => [
        'product01',
        'product02',
        'product03',
        'product04',
        'product05',
    ],
}

/**
 * Effects: plain JS Objects yielded from Generator
 * contains info to be interpreted by middleware
 *
 * We are invoking Api.fetch directly from inside the
 * Generator (in Gen functions, any expression at the
 * right of yield is evaluated then the result is yielded
 * to the caller).
 *
 * Api.fetch('/products') triggers an AJAX request and
 * returns a Promise that will resolve with the resolved
 * response, the AJAX request will be executed immediately.
 */

function* fetchProducts() {
    // const products = yield dummyApi.fetch('/products')

    /**
     * For unit tests,
     * Use call(fn, ...args)
     * The difference from above is now it isn't executing
     * fetch call immediately, instead, call creates a
     * description of the effect.
     *
     * Just as in Redux you use
     * action creators to create a plain object describing
     * the action that will get executed by the Store,
     * call creates a plain object describing the function
     * call. redux-saga takes care of executing the function
     * call and resuming the generator with the resolved
     * response. This allows us to test because call returns
     * a plain object.
     */

    const products = yield call(Api.fetch, '/products')
}

// milestone: 2.2 completed

function* watchFetchProducts() {
    yield takeEvery('PRODUCTS_REQUESTED', fetchProducts)
}
