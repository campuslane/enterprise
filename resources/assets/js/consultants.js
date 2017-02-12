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

			formatConsultants(consultants) {
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

				console.log(consultant);

				var formattedConsultant = {};

				formattedConsultant.id = helpers.format(consultant, ['id', 'ID', 'Id'])
				formattedConsultant.first = helpers.format(consultant, ['first', 'First_x0020_Name', 'first_name'])
				formattedConsultant.last = helpers.format(consultant, ['last', 'Title', 'last_name'])
				formattedConsultant.comments = helpers.format(consultant, ['comments', 'Comments'])
				formattedConsultant.sap = helpers.format(consultant, ['sap', 'SAP'])
				formattedConsultant.address = helpers.format(consultant, ['address', 'Address'])

				
				return formattedConsultant;
			}, 

			format(consultant, names) {

				var output = '';



				$.each(names, function(index, name){

					if(typeof consultant[name] !== "undefined") {

						if(name == 'SAP') {

							if(typeof consultant.SAP !== "undefined" && consultant.SAP) {
								
								output = consultant.SAP.results
							} else {
								output = [];
							}

						} else if (name == 'sap') {

							if( consultant.sap !== "undefined") {
								output = consultant.sap;
							}

						} else {
							output = consultant[name];
						}

						return false;
					}
				});

				return output;
			}
		}

	});



	// vuex store
	const store = new Vuex.Store({

	  state: {
	    message: "Our Initial Message!", 
	    consultants: [],
	    searchedConsultants: [],  
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
	    	consultant = helpers.formatConsultant(consultant);
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

	  	importConsultants(context, consultants) {
	  		
	  		consultants = helpers.formatConsultants(consultants);
	        context.commit('loadConsultants', consultants);
	  	}, 

	  	loadConsultants(context) {

	  		var listName = 'Consult';
	        var itemType = 'SP.Data.ConsultListItem';
	        var listUrl = "/_api/web/lists/GetByTitle('" + listName + "')/items?$orderby=Title&$top=1000";

	        var headers = {
	          "Accept": "application/json; odata=verbose", 
	        }

	        return Vue.http.get(listUrl, {headers: headers}).then((response) => {

	          		var consultants = response.data.d.results;

	          		consultants = helpers.formatConsultants(consultants);
	          
	          		context.commit('loadConsultants', consultants);
	       });
        },  

      	addConsultant(context, consultant) {

      		var listName = 'Consult';
	        var itemType = 'SP.Data.ConsultantsListItem';
	        var listUrl = "/_api/web/lists/GetByTitle('" + listName + "')/items";

	        



	        var body = {
	          '__metadata': { 'type': itemType }, 
	          'Title': consultant.last_name, 
	          'First_x0020_Name': consultant.first_name, 
	          'Comments': consultant.comments, 
	          'SAP':  {"results": consultant.sap }, 
	          'Address': consultant.address
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
                 'Title': consultant.last_name, 
                 'First_x0020_Name': consultant.first_name, 
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

	          		console.log(consultant);

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
	const Import = require('./components/Import.vue')
	const Delete = require('./components/Delete.vue')

	const routes = [
	  { path: '/', name: 'home', component: Home },
	  { path: '/about', name: 'about', component: About },
	  { path: '/import', name: 'import', component: Import },
	  { path: '/delete', name: 'delete', component: Delete },
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

	


