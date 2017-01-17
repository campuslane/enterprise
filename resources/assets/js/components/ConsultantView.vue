<template>
    <div  v-if="consultant.last">

        View | <a href="#" @click.prevent="editConsultant(consultant.id)" >Edit</a>

        <h1>{{ consultant.first }} {{ consultant.last }}</h1>

        <p>{{ consultant.comments }}</p>

        <div v-if="consultant.sap.length > 0">
        <ul>
            <li v-for="sap in consultant.sap">{{ sap }}</li>
        </ul>
        </div>
       
    </div>
</template>

<script>
    export default {
        mounted() {
            
            this.$store.dispatch('getConsultant', this.$route.params.id);

        }, 

        computed: {
            consultant () {
                var consultant = this.$store.state.currentConsultant;
                return consultant;
            }
        }, 

        methods: {
            editConsultant(id) {
                this.$router.push({'name': 'consultantEdit', 'params': {id:id}})
            }
        }

        
    }
</script>
