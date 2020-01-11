import Axios from 'axios'

export function createAccount(email, password, firstname, lastname) {
  return async dispatch => {
    const { data } = await Axios.post('/api/auth/create_user', {
      email,
      password,
      firstname,
      lastname,
    })
    if (data.success) {
      dispatch(login(email))
    }
  }
}

export function logout(email) {
  return async (dispatch, getState) => {
    const { data } = await Axios.post('/api/auth/logout', { email })
    dispatch({
      type: 'USER_LOGGED_OUT',
    })
  }
}

export function login(email) {
  return async dispatch => {
    dispatch(fetchSavedPolys(email))
    dispatch(fetchSavedPointsets(email))
    dispatch({
      type: 'USER_LOGGED_IN',
      user: email,
    })
  }
}

export function fetchSavedPolys(email) {
  return async (dispatch, getState) => {
    const { data } = await Axios.get('/api/data/saved_polys', {
      params: {
        email,
      },
    })
    if (data.success) {
      dispatch({
        type: 'LOAD_SAVED_POLYS',
        savedPolys: data.polys,
      })
    }
  }
}

export function fetchSavedPointsets(email) {
  return async (dispatch, getState) => {
    const { data } = await Axios.get('/api/data/get_pointsets', {
      params: {
        email,
      },
    })
    if (data.success) {
      dispatch({
        type: 'LOAD_SAVED_POINTS',
        savedPointsets: data.savedPointsets,
      })
    }
  }
}
