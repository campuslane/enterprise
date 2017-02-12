<template>

<div>
    
    
    
    <i class="fa fa-pencil"></i> <a href="#" @click.prevent="editConsultant(consultantId)" >Edit</a>

    <h1 v-if="! consultant.last">{{ currentConsultant.first }} {{ currentConsultant.last }}</h1>

    

    

    <div  v-if="consultant.last">

        <h1>{{ consultant.first }} {{ consultant.last }}</h1>

        <p>Address: {{ consultant.address }}</p>

        <p>{{ consultant.comments }}</p>

        <div v-if="consultant.sap.length > 0">
        <ul>
            <li v-for="sap in consultant.sap">{{ sap }}</li>
        </ul>
        </div>
       
    </div>

    <div v-else>
        <h1>Loading Consultant...</h1>
    <div>
</div>
</template>

<script>
    export default {

        

        mounted() {

            var self = this;

            this.consultantId = this.$route.params.id;

            setTimeout(function(){
                 self.$store.dispatch('getConsultant', self.$route.params.id);
            }, 0)
            
           

        }, 

        data () {
            return {
                consultantId: '', 
            }
        }, 

        computed: {
            consultant () {
                var consultant = this.$store.state.currentConsultant;
                return consultant;
            }, 

            currentConsultant () {
                return this.$store.state.currentConsultant;
            }
        }, 

        methods: {
            editConsultant(id) {
                this.$router.push({'name': 'consultantEdit', 'params': {id:id}})
            }
        }

        
    }
</script>
