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
	const ConsultantAdd = require('./components/ConsultantAdd.vue')
	const ConsultantView = require('./components/ConsultantView.vue')
	const ConsultantEdit = require('./components/ConsultantEdit.vue')
	const ConsultantResume = require('./components/ConsultantResume.vue')

	const routes = [
	  { path: '/', name: 'home', component: Home },
	  { path: '/add', name: 'consulantAdd', component: ConsultantAdd },
	  { path: '/view/:id', name: 'consultantView', component: ConsultantView },
	  { path: '/edit/:id', name: 'consultantEdit', component: ConsultantEdit },
	  { path: '/resume/:id', name: 'consultantResume', component: ConsultantResume },
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

		
		$(document).on('click', '#addFileButton', function(e){
			e.preventDefault();
			uploadFile();
		})
		
	});

	
'use strict';

jQuery(document).ready(function () {

    // Check for FileReader API (HTML5) support.
    if (!window.FileReader) {
        alert('This browser does not support the FileReader API.');
    }
});

// Upload the file.
// You can upload files up to 2 GB with the REST API.
function uploadFile() {

    // Define the folder path for this example.
    var serverRelativeUrlToFolder = '/shared documents';

    // Get test values from the file input and text input page controls.
    var fileInput = jQuery('#getFile');
    var newName = jQuery('#displayName').val();

    // Get the server URL.
    //var serverUrl = _spPageContextInfo.webAbsoluteUrl;
    var serverUrl = '';

    // Initiate method calls using jQuery promises.
    // Get the local file as an array buffer.
    var getFile = getFileBuffer();
    getFile.done(function (arrayBuffer) {

        // Add the file to the SharePoint folder.
        var addFile = addFileToFolder(arrayBuffer);
        addFile.done(function (file, status, xhr) {

            // Get the list item that corresponds to the uploaded file.
            var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
            getItem.done(function (listItem, status, xhr) {

                // Change the display name and title of the list item.
                var changeItem = updateListItem(listItem.d.__metadata);
                changeItem.done(function (data, status, xhr) {

                	console.log(listItem);
                	window.location.href= listItem.d.ServerRedirectedEmbedUrl;
                    //alert('file uploaded and updated: ');
                });
                changeItem.fail(onError);
            });
            getItem.fail(onError);
        });
        addFile.fail(onError);
    });
    getFile.fail(onError);

    // Get the local file as an array buffer.
    function getFileBuffer() {
        var deferred = jQuery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(fileInput[0].files[0]);
        return deferred.promise();
    }

    // Add the file to the file collection in the Shared Documents folder.
    function addFileToFolder(arrayBuffer) {

        // Get the file name from the file input control on the page.
        var parts = fileInput[0].value.split('\\');
        var fileName = parts[parts.length - 1];

        // Construct the endpoint.
        var fileCollectionEndpoint = String.format(
                "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
                "/add(overwrite=true, url='{2}')",
                serverUrl, serverRelativeUrlToFolder, fileName);

        // Send the request and return the response.
        // This call returns the SharePoint file.
        return jQuery.ajax({
            url: fileCollectionEndpoint,
            type: "POST",
            data: arrayBuffer,
            processData: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                //"content-length": arrayBuffer.byteLength
            }
        });
    }

    // Get the list item that corresponds to the file by calling the file's ListItemAllFields property.
    function getListItem(fileListItemUri) {

        // Send the request and return the response.
        return jQuery.ajax({
            url: fileListItemUri,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" }
        });
    }

    // Change the display name and title of the list item.
    function updateListItem(itemMetadata) {

        // Define the list item changes. Use the FileLeafRef property to change the display name. 
        // For simplicity, also use the name as the title. 
        // The example gets the list item type from the item's metadata, but you can also get it from the
        // ListItemEntityTypeFullName property of the list.
        var body = String.format("{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}'}}",
            itemMetadata.type, newName, newName);

        // Send the request and return the promise.
        // This call does not return response content from the server.
        return jQuery.ajax({
            url: itemMetadata.uri,
            type: "POST",
            data: body,
            headers: {
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-type": "application/json;odata=verbose",
                //"content-length": body.length,
                "IF-MATCH": itemMetadata.etag,
                "X-HTTP-Method": "MERGE"
            }
        });
    }
}

// Display error messages. 
function onError(error) {
    alert(error.responseText);
}