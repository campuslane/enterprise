	// project dependencies
	require('./bootstrap');

	// include router
	import VueRouter from 'vue-router'
	Vue.use(VueRouter)

	// include vuex
	import Vuex from 'vuex'
	Vue.use(Vuex)


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
	    	console.log(consultants)
	    	state.consultants = consultants;
	    }

	  },

	  actions: {

	  	changeMessage (context, message) {
	  		console.log(message);
	  	  context.commit('changeMessage', message)
	  	}, 

	  	loadConsultants(context) {

	  		var listName = 'Consult';
	        var itemType = 'SP.Data.ConsultListItem';
	        var listUrl = "/_api/web/lists/GetByTitle('" + listName + "')/items";


	        var headers = {
	          "Accept": "application/json; odata=verbose", 

	        }

	        return Vue.http.get(listUrl, {headers: headers}).then((response) => {

	          		var consultants = response.data.d.results;

	          		console.log("HERE: " + consultants[0].First_x0020_Name);

	          		context.commit('loadConsultants', consultants);

	       });
        },  

      	addConsultant(context, consultant) {

      		console.log('adding consultant');
      		console.log(consultant);


      		var listName = 'Consult';
	        var itemType = 'SP.Data.ConsultantsListItem';
	        var listUrl = "/_api/web/lists/GetByTitle('" + listName + "')/items";


	        var body = {
	          '__metadata': { 'type': itemType }, 
	          'Title': consultant.last, 
	          'First_x0020_Name': consultant.first, 
	          'Comments': consultant.comments
	        }

	        var options = {

	        	headers: {
		          "Accept": "application/json; odata=verbose", 
		          "X-RequestDigest": $("#__REQUESTDIGEST").val(),
		          "Content-Type": "application/json; odata=verbose",  
		        }

	        } 

	        return Vue.http.post(listUrl, body, options).then((response) => {

	        		console.log('we got a response!');
	          		console.log(response);

	       });
	  	
	 	}

	   }
	});



	// router
	const Home = require('./components/Home.vue')
	const AddConsultant = require('./components/AddConsultant.vue')

	const routes = [
	  { path: '/', component: Home },
	  { path: '/add', component: AddConsultant },
	]
	
	const router = new VueRouter({
		mode: 'hash',
	  	base: '/Vue/Pages/Default.aspx', 
	  	routes
	})


	

	$(function(){

		// app
		const app = new Vue({
			router, 
			store,
			mounted () {

				this.$store.dispatch('loadConsultants');


			}, 
		    
		    data: {
		    	message: 'Hello Frank!'
		    }
		    
		})

		app.$mount('#consultantsApp')

		

		
	});

	


