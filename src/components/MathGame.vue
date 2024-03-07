/<template>
   <div v-show="!this.isUserJoin">
        <p>Join the Game</p>
          <button v-on:click="joinGame()">Join the Game</button>
</div>
<div v-show="this.isUserJoin">
  <div>Your score is {{this.$store.state.score}}. There are {{this.numOfActiveUsers}} users currently online </div>
    <ag-grid-vue
    :rowData="this.$store.state.rowData"
    :columnDefs="colDefs"
    @rowClicked="onRowClicked"
    @grid-ready="onGridReady"
    style="height: 500px; width:800px"
    class="ag-theme-quartz"
  >
  </ag-grid-vue>
</div>
</template>

<script>
import CustomButton from "./CustomButton.vue";
import CustomTextBox from "./CustomTextbox.vue";
import axios from "axios";
import { AgGridVue } from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
const API_URL ="https://localhost:44359/";
export default {
  name: 'MathGame',
  components: {
    AgGridVue, // Add AG Grid Vue3 component
  },
  data() {
    return {
      rounds:[],
      result:null,
      isUserJoin: false,

     colDefs: [
        {headerName: "#", field:"id" },
        { field: "expression" },
        {
          headerName: "Your Answer",
          field: 'answeredValue' ,
         cellRendererSelector: (params) => {
            const customButton = { component: CustomButton };
            const customTextbox = { component: CustomTextBox};
             if((this.isExpressionContainQuestionMark(params.data.expression) &&(params.data.answeredValue ==null))){
              return customTextbox;
             }
            else if((this.isExpressionContainQuestionMark(params.data.expression) &&(params.data.answeredValue !=null))){
            return params.data.answeredValue;
            }
             else if (params.data.answeredValue ==null){
               return customButton;
             }
            else return params.data.answeredValue;
          },
        },
        { field: 'result' },
      ],
      themeClass:
        "ag-theme-quartz",
    };
},
  computed: {
        numOfActiveUsers(){
            return this.$store.state.numUsers;
        }
    },
  methods:{
        async LoadData(){
          console.log('user',this.$store.state.logUser.id);
        axios.get(API_URL+`api/MathGame/rounds/${this.$store.state.logUser.id}`,{headers:{'Content-Type': 'application/json; charset=utf-8'}}).then(
            (response) => {
            this.rounds = response.data;
            this.$store.commit("setUserAnswered", this.rounds);
            });
            },
        
        onRowClicked(params) {
           this.rowClicked= params.node.data;
           this.result =this.rowClicked.result;
    },
    isExpressionContainQuestionMark(expression){
      if(expression.includes("?"))
      return true;
      return false;
    },
    joinGame(){
      axios.get(API_URL+"api/MathGame/activeUsers")
    .then(response => {
      this.$store.commit("setNumberOfActiveUsers", response.data);
if((this.$store.state.numUsers + 1) > 5){
  alert("There are currently 5 users active. The max users which can play the game is 5.");
}
else{
      this.isUserJoin = true;
             axios.post(API_URL+"api/MathGame/addUser")
    .then(res => {
      this.$store.commit("setLogUser", res.data);
           this.$store.commit("setNumberOfActiveUsers", this.$store.state.numUsers + 1);
            this.LoadData();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
              }
            });
},
onGridReady(params) {
      this.gridApi = params.api;
  }
  },
    mounted(){
    },
};
</script>

<style scoped>
</style>./CustomButton.vue