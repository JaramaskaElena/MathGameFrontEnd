<template>
    <div>        
       <input type="text" id="answerValue" v-model="answer" placeholder="Enter Answer" v-on:keyup.enter="onEnterClick"/>
    </div>
</template>

<script>
import axios from "axios";
const API_URL ="https://localhost:44359/";
    export default {
        props: {
  },
name: 'CustomTextbox',
components: {
},
data() {
    return {
      answer: null,
      id: 0,
      loginUser:null,
    };
},
methods: {
async onEnterClick(event) {
    this.id = this.params.data.id;
    this.loginUser =this.$store.state.logUser
    const params= {
        answer: event.target.value,
        userId: this.loginUser.id
    };        
    await axios.put(API_URL+`api/MathGame/updateRound/${this.id}`,params,{headers:{'Content-Type': 'application/json; charset=utf-8'}})
    .then(res => {
                    console.log('Update successful:', res.data);
                    this.LoadData();
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
},
async LoadData(){
        axios.get(API_URL+`api/MathGame/rounds/${this.$store.state.logUser.id}`,{headers:{'Content-Type': 'application/json; charset=utf-8'}}).then(
            (response) => {
            this.$store.commit("setUserAnswered", response.data);
         
            });
            },
    mounted() {
  },
},
};
</script>