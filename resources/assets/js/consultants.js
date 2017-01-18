	// project dependencies
	require('./bootstrap');

	// include router
	import VueRouter from 'vue-router'
	Vue.use(VueRouter)

	// include vuex
	import Vuex from 'vuex'
	Vue.use(Vuex)


	const helpers = new Vue({

		methods: {

			formatConsultants(store, consultants) {
				var fields = store.fields;
				var formattedConsultants = [];
				var newConsultant;

				var self = this

				$.each(consultants, function(index, consultant){

					formattedConsultants.push(self.formatConsultant(consultant));

				});

				return formattedConsultants;
			}, 

			formatConsultant(consultant) {

				var formattedConsultant = {};

				formattedConsultant.id = consultant.ID;
				formattedConsultant.last = consultant.Title;
				formattedConsultant.first = consultant.First_x0020_Name;
				formattedConsultant.comments = consultant.Comments;
				formattedConsultant.sap = (consultant.SAP) ? consultant.SAP.results : [];

				return formattedConsultant;
			}
		}

	});



	// vuex store
	const store = new Vuex.Store({

	  state: {
	    message: "Our Initial Message!", 
	    consultants: [], 
	    currentConsultant: {
	    	first: '', 
	    	last: '', 
	    	comments: '', 
	    	sap: []
	    }
	  },

	  mutations: {

	    changeMessage (state, message) {
	      state.message = message
	    }, 

	    loadConsultants (state, consultants) {
	    	
	    	state.consultants = consultants;
	    }, 

	    addConsultant (state, consultant) {
	    	state.consultants.push(consultant);
	    }, 

	    updateConsultant (state, consultant) {
	    	var indexOfItem = state.consultants.findIndex(obj => obj.id == consultant.id)
	    	state.consultants.splice(indexOfItem, 1, consultant)
	    }, 

	    deleteConsultant(state, id) {
	    	var indexOfItem = state.consultants.findIndex(obj => obj.id == id)
	    	state.consultants.splice(indexOfItem,1);
	    }, 

	    getConsultant(state, consultant) {
	    	state.currentConsultant = consultant;
	    }

	  },

	 
	  actions: {

	  	changeMessage (context, message) {
	  		console.log(message);
	  	  context.commit('changeMessage', message)
	  	}, 

	  	loadConsultants(context) {

	  		console.log('loading consultants');

	  		var listName = 'Consult';
	        var itemType = 'SP.Data.ConsultListItem';
	        var listUrl = "/_api/web/lists/GetByTitle('" + listName + "')/items";

	        var headers = {
	          "Accept": "application/json; odata=verbose", 
	        }

	        return Vue.http.get(listUrl, {headers: headers}).then((response) => {

	          		var consultants = response.data.d.results;

	          		console.log(consultants);

	          		consultants = helpers.formatConsultants(store,consultants);
	          
	          		context.commit('loadConsultants', consultants);
	       });
        },  

      	addConsultant(context, consultant) {

      		var listName = 'Consult';
	        var itemType = 'SP.Data.ConsultantsListItem';
	        var listUrl = "/_api/web/lists/GetByTitle('" + listName + "')/items";

	        console.log(consultant.sap);


	        var body = {
	          '__metadata': { 'type': itemType }, 
	          'Title': consultant.last, 
	          'First_x0020_Name': consultant.first, 
	          'Comments': consultant.comments, 
	          'SAP':  {"results": consultant.sap }
	        }

	        var options = {

	        	headers: {
		          "Accept": "application/json; odata=verbose", 
		          "X-RequestDigest": $("#__REQUESTDIGEST").val(),
		          "Content-Type": "application/json; odata=verbose",  
		        }

	        } 

	        return Vue.http.post(listUrl, body, options).then((response) => {
	        	consultant.id = response.data.d.ID;
	        	context.commit('addConsultant', consultant);
	        	router.push('/');

	       });

	 	}, 

	 	updateConsultant(context, consultant) {

	 		console.log('updating');
	 		console.log(consultant);

	 		var listName = 'Consult';
	        var itemType = 'SP.Data.ConsultantsListItem';
	        var listUrl = "/_api/web/lists/GetByTitle('" + listName + "')/items(" + consultant.id + ")";


	       var options = {

	       		headers: {
                  "accept": "application/json; odata=verbose", 
                  "content-type": "application/json;odata=verbose", 
                  "IF-MATCH": "*", 
                  "X-HTTP-Method":"MERGE",
                  "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }
            }

            var body = {
                 '__metadata': { 'type': itemType }, 
                 'Title': consultant.last, 
                 'First_x0020_Name': consultant.first, 
                 'Comments': consultant.comments, 
                 'SAP':  {"results": consultant.sap }
            }

	        return Vue.http.post(listUrl, body, options).then((response) => {

	        	context.commit('updateConsultant', consultant);
	        	router.push({name: 'consultantView', params: {id:consultant.id}});

	       });
	 	}, 

	 	deleteConsultant(context, id) {

	 		var listName = 'Consult';
	        var itemType = 'SP.Data.ConsultantsListItem';
	        var listUrl = "/_api/web/lists/GetByTitle('" + listName + "')/items(" + id + ")";


	       var options = {

	       		headers: {
                  "IF-MATCH": "*", 
                  "X-HTTP-Method":"DELETE",
                  "X-RequestDigest": $("#__REQUESTDIGEST").val()
                }
            }
	      	

	        return Vue.http.post(listUrl, '', options).then((response) => {

	        	context.commit('deleteConsultant', id);
	        	router.push({name: 'home'});

	       });
	 	}, 

	 	getConsultant(context, id) {
	 		console.log('action set up to get consultant with id of ' + id);
	 		var listName = 'Consult';
	        var itemType = 'SP.Data.ConsultListItem';
	        var listUrl = "/_api/web/lists/GetByTitle('" + listName + "')/items(" + id + ")";

	        var headers = {
	          "Accept": "application/json; odata=verbose", 

	        }

	        return Vue.http.get(listUrl, {headers: headers}).then((response) => {

	          		var consultant = response.data.d;

	          		consultant = helpers.formatConsultant(consultant);

	          		context.commit('getConsultant', consultant);

	       });
	 	}

	   }
	});



	// router
	const Home = require('./components/Home.vue')
	const About = require('./components/About.vue')
	const ConsultantAdd = require('./components/ConsultantAdd.vue')
	const ConsultantView = require('./components/ConsultantView.vue')
	const ConsultantEdit = require('./components/ConsultantEdit.vue')
	const ConsultantResume = require('./components/ConsultantResume.vue')
	const ConsultantPromise = require('./components/ConsultantPromise.vue')

	const routes = [
	  { path: '/', name: 'home', component: Home },
	  { path: '/about', name: 'about', component: About },
	  { path: '/add', name: 'consulantAdd', component: ConsultantAdd },
	  { path: '/view/:id', name: 'consultantView', component: ConsultantView },
	  { path: '/edit/:id', name: 'consultantEdit', component: ConsultantEdit },
	  { path: '/resume/:id', name: 'consultantResume', component: ConsultantResume },
	  { path: '/promise/:id', name: 'consultantPromise', component: ConsultantPromise },
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
				console.log('app mounted');
				this.$store.dispatch('loadConsultants');
			}, 
		    
		    data: {
		    	message: 'Hello Frank!'
		    }, 

		    methods: {
		    	formatConsultants() {
		    		return 'formatted from app!';
		    	}
		    }
		    
		})

		app.$mount('#consultantsApp')

		// Check for FileReader API (HTML5) support.
	    if (!window.FileReader) {
	        alert('This browser does not support the FileReader API.');
	    }
		
	});

	


