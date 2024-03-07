<template>
    <div>        
        <button v-on:click="buttonClicked('YES')">YES</button>
        <span></span>
        <button  v-on:click="buttonClicked('NO')">NO</button>
    </div>
</template>

<script>
import axios from "axios";
const API_URL ="https://localhost:44359/";
    export default {
        props: ['logUser'],
        
name: 'CustomButton',
components: {
},
data() {
    return {
      answer:"",
      id: 0,
      loginUser: null
    };
},
methods: {
async buttonClicked(clicked) {
    this.answer = clicked;
    this.id =this.params.data.id;
    this.loginUser = this.$store.state.logUser;
    const params= {
        answer: this.answer,
        userId: this.loginUser.id
    };
    await axios.put(API_URL+`api/MathGame/update/${this.id}`,params,{headers:{'Content-Type': 'application/json; charset=utf-8'}})
    .then(res => {
                    console.log('Update successful:', res.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                await axios.get(API_URL+`api/MathGame/totalScoreByUser/${this.loginUser.id}`,{headers:{'Content-Type': 'application/json; charset=utf-8'}})
    .then(response => {
        this.$store.commit("setScore", response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
                this.LoadData();

},
async LoadData(){
        axios.get(API_URL+`api/MathGame/rounds/${this.$store.state.logUser.id}`,{headers:{'Content-Type': 'application/json; charset=utf-8'}}).then(
            (response) => {
            this.$store.commit("setUserAnswered", response.data);
         
            });
            },
    created() {
  },
},
};
</script>