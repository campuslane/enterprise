<template>
    <div>

        <h1>Delete All</h1>
        
        <p>Click the button below to delete all list items.  Careful, this is non reversible</p>

        <button @click.prevent="deleteAll()" class="btn btn-danger">Delete All List Items</button>


    </div>
</template>

<script>
    export default {

        mounted() {
            
        }, 

        computed: {
            message () {
                return this.$store.state.message
            }, 

            consultants() {
                return this.$store.state.consultants
            }
        }, 

        methods: {

            deleteAll() {

                var self = this;

                $.each(this.consultants, function(index, consultant){
                    console.log(consultant);
                    self.$store.dispatch('deleteConsultant', consultant.id);
                });

                alert('deleted...');

            }, 

            
        }
    }
</script>
