import {getUsers} from 'data'
import {sagaGenerator, normalize} from '../helpers'
import {put, select} from 'redux-saga/effects'
import {curriedValidator as userValidator} from './helpers'

/*
* This is not an atomic service,
* it's meant it does destroy the state but add/update and persist records
* This come handy when we need to use pagination
* */

/* params {
		@ Int => Indicate a sequence to support pagination in case it's available
 */

export const fetch = sagaGenerator('users', 'fetch', getUsers)

// export function* fetch ({sec}) {
// 		try {
// 				yield put({type: 'fetch_users_start'})
// 				const users = yield call(getUsers, sec)
// 				/* place it on the state */
// 				yield put({type: 'fetch_users_success', payload: normalize(users)})
// 		} catch (error) {
// 				yield put({type: 'fetch_users_error', error})
// 		}
// }

export function* create ({user}) {
		try {
				yield put({type: 'create_users_start'})
				/* Re-validate if it has at least one group assigned
				* This is also validated in the UI but since we don't have a real Backend here
				* It doesn't hurt to double check,
				* Let's assume that all the groups are in the state... otherwise with more time
				* we could easily make a post request to validate if the group exists
				* */
				const groups = yield select(({groups}) => groups.ids)
				const userValidated = userValidator(groups)(user)
				/* if we get here, all good! */
				yield put({
						type: 'create_users_success',
						payload: normalize([userValidated]),
					})
		} catch (error) {
				yield put({type: 'create_users_error', error: error.message})
		}
}
