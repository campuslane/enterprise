<template>
    <div v-if="consultant.last">

        <a href="#" @click.prevent="viewConsultant(consultant.id)" >View</a> | Edit | 
        <a href="#" @click.prevent="uploadResume(consultant.id)" >Upload Resume</a>
        <br><br>

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
                <div @click.prevent="deleteConsultant(consultant.id)" class="pull-right btn btn-link">[x] Delete</div>
                <button type="submit" class="btn btn-primary">Update</button>
            </div>

        </form>

        
       
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

            uploadResume(id) {
                this.$router.push({'name': 'consultantResume', 'params': {id:id}})
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
