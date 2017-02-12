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

        <div class="row">
            <div class="col-lg-3 col-md-3 col-sm-3">
               
                  <input id="name-search" @keyup.prevent="grepList()"  type="text" class="form-control typeahead input-sm" placeholder="Search by Name">
                 
            </div>
        </div>
       
        <h3>Consultants</h3>

    

            <table class="table table-bordered table-condensed" style="width:100%">
            <tbody v-if="displayedConsultants.length > 0">

                <tr>
                    <th>Last Name</th>
                    <th>First Name</th>
                    
                    <th>SAP</th>
                </tr>
            
            
                <tr v-for="consultant in displayedConsultants" @click="goToProfile(consultant)">
                    <td>{{ consultant.last }}</router-link></td>
                    <td>{{ consultant.first }}</td>
                  
                   
                        
                    <td v-if="consultant.sap.length">
                        <span v-for="(sap, index) in consultant.sap">{{ sap }}
                            <span v-if="index < (consultant.sap.length - 1)">, </span>
                        </span>
                    
                    </td>

                    <td v-else>
                        --
                    </td>

                
                </tr>
            
            </tbody>
            </table>
       
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Home Component mounted.');
            
        }, 

        computed: {
            message () {
                return this.$store.state.message
            }, 

            consultants () {
                return this.$store.state.consultants
            }, 

            displayedConsultants() {

                var searchedConsultants = this.$store.state.searchedConsultants

                if(searchedConsultants.length) {

                    return searchedConsultants;
                }

                return this.$store.state.consultants;
            }
        }, 

        methods: {

            goToProfile(consultant) {

                this.$store.state.currentConsultant = consultant;
                this.$store.state.searchedConsultants = [];

                this.$router.push({name:'consultantView', params: {id:consultant.id} });
            }, 

            addTemplate() {
                $('#consultantsApp').before('<script type="x-template" id="custom-template"><div><h1>Custom Template</h1><p>Frank rocks!</p></div><\/script>');
            }, 

            grepList() {

                var searchedName = $('#name-search').val();

                var consultantLowerCase, fullName;

                var results = $.grep(this.$store.state.consultants, function(consultant){

                    fullName = consultant.first + ' ' + consultant.last;
                    consultantLowerCase = fullName.toLowerCase()
                    return (consultantLowerCase.search(searchedName.toLowerCase()) > -1);
                });

                if(results.length) {
                    this.$store.state.searchedConsultants = results;
                } else {
                    this.$store.state.searchedConsultants = [];
                }
            }
        }
    }
</script>
