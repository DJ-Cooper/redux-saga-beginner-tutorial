import test from 'tape'

import { put, call } from 'redux-saga/effects'
import { incrementAsync, delay, Api, fetchProducts } from './sagas'

/**
 * generator function returns an iterator object,
 * and the iterator's next method returns an
 * object with the following shape
 * { done: boolean, value: any }
 * "value" contains yielded expression.
 * when no more yields,
 * { done: true, value: <return or undefined>}
 *
 * How do we test the return value of delay?
 * can't do equality test on Promises.
 * Instead of calling delay(1000) directly inside
 * incrementAsync, we'll call it indirectly and
 * export it to make subsequent deep comparison possible
 * Instead of doing yield delay(1000) we're now doing
 * yield call(delay, 1000)
 *
 * delay(1000) is evaluated before it gets passed to the caller
 * of next(), so the caller gets a Promise.
 *
 * call(delay, 1000) is what gets passed to the caller of next().
 * call, just like put, returns an Effect which instructs the
 * middleware to call a given function with the given arguments.
 * In fact, neither put nor call performs any dispatch or async call
 * by themselves, they return plain JS objects.
 *
 * put({type: 'INCREMENT'}) //=> { PUT: {type: 'INCREMENT'}}
 * call(delay, 1000)         //=> { CALL: {fn: delay, args: [1000]}}
 *
 * What happens is that the middleware examines the type of each yielded Effect
 * then decides how to fulfill that Effect.
 * PUT will dispatch an action to the store.
 * CALL will call the given function.
 */

test('fetchProducts Saga test', assert => {
    const iterator = fetchProducts()

    assert.deepEqual(
        iterator.next().value,
        call(Api.fetch, '/products'),
        'fetchProducts should yield an Effect call(Api.fetch, ./products)'
    )

    const products = {}

    assert.deepEqual(
        iterator.next(products).value,
        put({ type: 'PRODUCTS_RECEIVED', products }),
        'fetchProducts should yield an effect put({ type: PRODUCTS_RECEIVED, products })'
    )

    const error = {}

    assert.deepEqual(
        iterator.throw(error).value,
        put({ type: 'PRODUCTS_REQUEST_FAILED', error }),
        "fetchProducts should yield an Effect put({ type: 'PRODUCTS_REQUEST_FAILED', error})"
    )

    console.log('>>>>>>>>>>>>>>> :-0')

    assert.end()
})
