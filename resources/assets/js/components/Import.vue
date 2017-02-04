<template>
    <div>

        <h1>Import JSON</h1>
        <textarea v-model="json" class="form-control" rows="25"></textarea>
        <button @click.prevent="importJson()" class="btn btn-primary">Import</button>


    </div>
</template>

<script>
    export default {

        mounted() {
            
        }, 

        data () {
            return {
                json: ''
            }
        }, 

        computed: {
            message () {
                return this.$store.state.message
            }
        }, 

        methods: {

            importJson() {

                var json = JSON.parse(this.json);
                var self = this;

                $.each(json, function(index, consultant){
                    self.$store.dispatch('addConsultant', consultant);
                });

               alert('done importing!');
            }
        }
    }
</script>
