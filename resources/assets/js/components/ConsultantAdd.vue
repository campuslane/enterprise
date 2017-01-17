<template>
    <div>

        <h1>Add a Consultant</h1>

        {{ consultant.first }} {{ consultant.last }} {{ consultant.comments }}

        <form @submit.prevent="formSubmit()">

            <div class="form-group">
                <label for="first">First Name</label>
                <input type="text" name="last" class="form-control" v-model="consultant.first">
            </div>

            <div class="form-group">
                <label for="last">Last Name</label>
                <input name="last" type="text" class="form-control" v-model="consultant.last">
            </div>


            <div class="form-group">
                <label for="first">Comments</label>
                <textarea name="comments" class="form-control" v-model="consultant.comments"></textarea>
            </div>

             <div class="form-group">
                <label for="first">SAP</label>
                <div class="checkbox">
                    <label>
                        <input type="checkbox" v-model="consultant.sap" id="co" value="CO"> CO   
                    </label>
                </div>

                <div class="checkbox">
                    <label>
                        <input type="checkbox" v-model="consultant.sap" id="fi" value="FI"> FI   
                    </label>
                </div>

                <div class="checkbox">
                    <label>
                        <input type="checkbox" v-model="consultant.sap" id="abap" value="ABAP"> ABAP   
                    </label>
                </div>
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-primary">Add</button>
            </div>

        </form>
       
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Home Component mounted.')
        }, 

        computed: {
            consultants () {
                return this.$store.state.consultants
            }
        }, 

        methods: {
            changeMessage() {
                this.$store.dispatch('changeMessage', 'New Message!')
            }, 

            formSubmit() {
                this.$store.dispatch('addConsultant', this.consultant)
            }
        }, 

        data() {
            return {
                consultant: { 
                    last: "", 
                    first: "", 
                    comments: "", 
                    sap: []
                }
            }
        }
    }
</script>
