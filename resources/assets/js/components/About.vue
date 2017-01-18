

<script>
    export default {

        template: '#custom-template', 

        mounted() {
            console.log('About Component mounted.')
        }, 

        computed: {
            message () {
                return this.$store.state.message
            }
        }
    }
</script>
