// project dependencies
require('./bootstrap');

// include router
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// include vuex
import Vuex from 'vuex'
Vue.use(Vuex)




// When DOM has loaded, update it, and initalize vue
$(function(){
	updateDom();
	initializeVue();
})


// add the dom elements we need to run vue
function updateDom() {

	let appHtml = `

			<div class="container">
				<h3>Vue Dynamic</h3>

				<router-link to="/">Home</router-link> | 
		    	<router-link to="/about">About</router-link>

		    	<hr>

				<router-view></router-view>
			</div>

		

	`;

	$('#app').append(appHtml);
}


// set up vue
function initializeVue() {

	// vuex store
	const store = new Vuex.Store({

	  state: {
	    message: "Our Initial Message!", 
	    consultants: []
	  },

	  mutations: {
	    changeMessage (state, message) {
	      state.message = message
	    }, 

	    loadConsultants (state, consultants) {
	    	console.log(consultants[1])
	    	state.consultants = consultants;
	    }

	  },

	  actions: {
	  	changeMessage (context, message) {
	  		console.log(message);
	  	  context.commit('changeMessage', message)
	  	}, 

	  	loadConsultants(context) {

	  		var listName = 'EHCG Consultant List';
	        var itemType = 'SP.Data.EHCG_x0020_Consultant_x0020_ListListItem';
	        var spBaseUrl = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/GetByTitle('" + listName + "')/items";

	        var listUrl = spBaseUrl + '?$orderby=Title&$top=1000';
	        listUrl += '&$select=*,Modules/ID,Modules/Title&$expand=Modules'


	        var headers = {
	          "Accept": "application/json; odata=verbose"
	        }

	        return Vue.http.get(listUrl, {headers: headers}).then((response) => {

	          var consultants = response.data.d.results;

	          context.commit('loadConsultants', consultants);

	        });
	      }
	  	
	 	}
	});



	// router
	const Home = require('./components/Home.vue')
	const About = require('./components/About.vue')

	const routes = [
	  { path: '/', component: Home },
	  { path: '/about', component: About },
	]
	
	const router = new VueRouter({
	  routes
	})


	// app
	const app = new Vue({
		router, 
		store,
		mounted () {
			this.$store.dispatch('loadConsultants');
		}, 
	    el: '#app' 
	    
	})


	app.$mount('#app')
}




