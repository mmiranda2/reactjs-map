const initialState = {
  user: '',
  savedPolys: [],
  savedPointsets: [],
}

function rootReducer(state = initialState, action) {
  if (action.type === 'USER_LOGGED_IN') {
    return Object.assign({}, state, {
      user: action.user,
    })
  }
  if (action.type === 'USER_LOGGED_OUT') {
    return Object.assign({}, state, {
      user: '',
      savedPolys: [],
      savedPointsets: [],
    })
  }
  if (action.type === 'LOAD_SAVED_POLYS') {
    return Object.assign({}, state, {
      savedPolys: action.savedPolys,
    })
  }
  if (action.type === 'LOAD_SAVED_POINTS') {
    return Object.assign({}, state, {
      savedPointsets: action.savedPointsets,
    })
  }
  return state
}

export default rootReducer
