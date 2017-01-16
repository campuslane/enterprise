<template>
    <div class="container">
        <!-- <button @click.prevent ="changeMessage()" class="btn btn-primary">Change Message</button> <br><br>
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div class="panel-heading">Example Component</div>

                    <div class="panel-body">
                        I'm a Home component! {{ message }}
                    </div>
                </div>
            </div>
        </div>
 -->
        <h3>Consultants</h3>
        

            <table class="table table-bordered table-condensed">
            <tbody v-if="consultants.length > 0">

                <tr>
                    <th>Last Name</th>
                    <th>First Name</th>
                    <th>Comments</th>
                    <th>SAP</th>
                </tr>
            
            
                <tr v-for="consultant in consultants">
                    <td>{{ consultant.Title }}</td>
                    <td>{{ consultant.First_x0020_Name }}</td>
                    <td>{{ consultant.Comments }}</td> 
                    <td>
                        <span v-if="consultant.SAP">
                        <span v-for="(sap, index) in consultant.SAP.results">{{ sap }}
                            <span v-if="index < (consultant.SAP.results.length - 1)">, </span>
                        </span>
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
            changeMessage() {
                this.$store.dispatch('changeMessage', 'New Message!')
            }
        }
    }
</script>
