<template>
    <div v-if="consultant.last">

        <h1>Resume Promise</h1>

        <p>Use this form to upload a resume for {{ consultant.first }} {{ consultant .last }}</p>
       
        <input id="getFile" class="form-control" type="file"/><br />
        <input id="displayName" class="form-control" type="text" placeholder="Enter a unique name" /><br />
        <button id="addFileButton" @click.prevent="uploadFile()" type="submit" class="btn btn-primary">Upload</button>
       
    </div>
</template>

<script>
    export default {
        mounted() {
            
            this.$store.dispatch('getConsultant', this.$route.params.id);

        }, 

        computed: {
            consultant () {
                return this.$store.state.currentConsultant;
            }
        }, 

        methods: {
            viewConsultant(id) {
                this.$router.push({'name': 'consultantView', 'params': {id:id}})
            }, 

            deleteConsultant(id) {
                this.$store.dispatch('deleteConsultant', id);
            }, 

            uploadFile() {

                this.getFileBuffer()
                    .then(this.addFileToFolder)
                    .then(this.getListItem)
                    .then(this.updateListItem)
                    .then(function(listItem){console.log(listItem)});

                    // next steps would be to update the resume link

                return false;
            }, 


            getFileBuffer() {

                var fileInput = jQuery('#getFile');

                return new Promise(function(resolve, reject){

                    var reader = new FileReader();

                    reader.readAsArrayBuffer(fileInput[0].files[0]);

                    reader.onloadend = function (e) {
                        resolve(e.target.result);
                    }
                    reader.onError = function (e) {
                        reject(e.target.error);
                    }

                });
            },

            addFileToFolder(arrayBuffer) {

                var fileInput = jQuery('#getFile');
                var serverUrl = '';
                var serverRelativeUrlToFolder = '/resumes';
               
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
            }, 

            getListItem(file) {

                var fileListItemUri = file.d.ListItemAllFields.__deferred.uri

                // Send the request and return the response.
                return jQuery.ajax({
                    url: fileListItemUri,
                    type: "GET",
                    headers: { "accept": "application/json;odata=verbose" }
                });
            }, 

            updateListItem(listItem) {

                var itemMetadata = listItem.d.__metadata;
                var newName = jQuery('#displayName').val(); 

                // Define the list item changes. Use the FileLeafRef property to change the display name. 
                // For simplicity, also use the name as the title. 
                // The example gets the list item type from the item's metadata, but you can also get it from the
                // ListItemEntityTypeFullName property of the list.
                var body = String.format("{{'__metadata':{{'type':'{0}'}},'FileLeafRef':'{1}','Title':'{2}'}}",
                    itemMetadata.type, newName, newName);

                return new Promise(function(resolve, reject){

                    //This call does not return response content from the server.
                    //that's why we wrapped this in a promise so we can return the listItem
                    //which we need going forward.
                    jQuery.ajax({
                        url: itemMetadata.uri,
                        type: "POST",
                        data: body,
                        headers: {
                            "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                            "content-type": "application/json;odata=verbose",
                            //"content-length": body.length,
                            "IF-MATCH": itemMetadata.etag,
                            "X-HTTP-Method": "MERGE"
                        }, 

                        success: function(response) {
                            resolve(listItem);
                        }
                    })

                });

            }
            
        }

        
    }
</script>
