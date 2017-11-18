
// initial state
const state = {
  conversation: null
}

// getters
const getters = {
  conversation: state => state.conversation
}

// actions
const actions = {
  changeConversation ({commit}, payload) {
    commit('setConversation', payload)
  }
}

// mutations
const mutations = {
  setConversation (state, payload) {
    state.conversation = payload
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
