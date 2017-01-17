<template>
    <div v-if="consultant.last">

        <h1>Resume Upload</h1>

        <p>Use this form to upload a resume for {{ consultant.first }} {{ consultant .last }}</p>
       
        <input id="getFile" class="form-control" type="file"/><br />
        <input id="displayName" class="form-control" type="text" placeholder="Enter a unique name" /><br />
        <button id="addFileButton" type="submit" class="btn btn-primary">Upload</button>
       
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

            formSubmit() {
                this.$store.dispatch('updateConsultant', this.consultant)
            }
        }

        
    }
</script>
