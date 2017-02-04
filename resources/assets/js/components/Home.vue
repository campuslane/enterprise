<style>

    tr {
        cursor:pointer;
    }

    tr:hover {
        background:#eee;
    }
</style>


<template>
    <div>
       
        <h3>Consultants</h3>

      
        

            <table class="table table-bordered table-condensed">
            <tbody v-if="consultants.length > 0">

                <tr>
                    <th>Last Name</th>
                    <th>First Name</th>
                    
                    <th>SAP</th>
                </tr>
            
            
                <tr v-for="consultant in consultants" @click="goToProfile(consultant.id)">
                    <td>{{ consultant.last }}</router-link></td>
                    <td>{{ consultant.first }}</td>
                  
                    <td>
                        
                        <span v-for="(sap, index) in consultant.sap">{{ sap }}
                            <span v-if="index < (consultant.sap.length - 1)">, </span>
                        </span>
                        
                    </td>
                
                </tr>
            
            </tbody>
            </table>
       
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Home Component mounted.')
        }, 

        computed: {
            message () {
                return this.$store.state.message
            }, 

            consultants () {
                return this.$store.state.consultants
            }
        }, 

        methods: {
            goToProfile(id) {

                this.$store.state.currentConsultant = {}

                this.$router.push({name:'consultantView', params: {id:id} });
            }, 

            addTemplate() {
                $('#consultantsApp').before('<script type="x-template" id="custom-template"><div><h1>Custom Template</h1><p>Frank rocks!</p></div><\/script>');
            }
        }
    }
</script>
