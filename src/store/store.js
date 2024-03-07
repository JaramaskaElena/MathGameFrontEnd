
import { createStore } from "vuex" 

const store = createStore({
   state:{
    logUser: null,
    rowData: null,
    score: 0,
    numUsers: 0,
   },
   mutations: {
    setLogUser(state, user) {
        state.logUser = user;
      },
      setUserAnswered(state, data) {
        state.rowData = data;
      },
      setScore(state, scoreUser) {
        state.score = scoreUser;
      },
      setNumberOfActiveUsers(state, number) {
        state.numUsers = number;
      }
},
});
export default store
