<template>
    <div class="container">
        <button @click.prevent ="changeMessage()" class="btn btn-primary">Change Message</button> <br><br>
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

        <h3>Consultants</h3>
        <div v-if="consultants.length > 0">
        <div v-for="consultant in consultants">{{ consultant.Title }}, {{ consultant.kj0m }}</div>
        </div>
        <div v-else>
            LOADING...
        </div>
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
