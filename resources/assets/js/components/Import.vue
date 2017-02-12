<template>
    <div>

        <div class="row">
  
          <div class="col-lg-6">
            <div class="input-group">
              <input id="searchbox"  type="text" class="form-control" placeholder="Search for...">
              <span class="input-group-btn">
                <button class="btn btn-default" @click.prevent="search()" type="button">Go!</button>
              </span>
            </div><!-- /input-group -->
          </div><!-- /.col-lg-6 -->

        </div><!-- /.row -->

        <table class="table table-bordered">
        <tbody>
            <tr v-for="row in rows">
                <td>
                    <div v-for="(cell, index) in row.Cells">{{ index }} {{ cell.Key }} | {{ cell.Value }}</div>
                </td>
                <td><strong>{{row.Cells[3].Value}}</strong></td>
                <td><a target="_blank"  :href="row.Cells[15].Value">View</a></td>
                <td v-html="replace(row.Cells[11].Value)"></td>
               
                
            </tr>
        </tbody>
        </table>

        <h1>Import JSON by Link</h1>


        <a @click.prevent="importConsultants()" href="">Import Consultants</a>


       


    </div>
</template>

<script>
    export default {

        mounted() {
            //alert('mounted!');
        }, 

        data () {
            return {
                rows: []
            }
        }, 

        computed: {
            message () {
                return this.$store.state.message
            }
        }, 

        methods: {

            search() {

                var querystring = $('#searchbox').val();

                var url = "/_api/search/query?querytext='" + querystring + "(path:https://fmatull.sharepoint.com/Resumes)'";
                var url = "/_api/search/query?querytext='" + querystring + "(path:https://fmatull.sharepoint.com/Lists/Consultants/)'";
                
                
                //(search text)+AND+(path:<library url>)

                var self = this;


                Vue.http.get(url).then((response) => {

                    this.rows = response.data.PrimaryQueryResult.RelevantResults.Table.Rows

                    console.log(this.rows);


                });

                
            }, 

            replace(html) {

               var output = html.replace(/<c0>/g, '<strong style="color:#0072C6">').replace(/<\/c0>/g, '</strong>');

               console.log(output);

               return output;
            }, 

            importJson() {

                var json = JSON.parse(this.json);
                var self = this;

                $.each(json, function(index, consultant){
                    self.$store.dispatch('addConsultant', consultant);
                });

               alert('done importing!');
            }, 

            importConsultants() {

                var url = 'https://enterprise.dev/consultants';

                var self = this;

                
                Vue.http.get(url).then((consultants) => {

                    var consultants = JSON.parse(consultants.data);

                    // delete consultants
                    self.deleteConsultants();
                   
                   //self.$store.dispatch('importConsultants', consultants);

                    $.each(consultants, function(index, consultant){
                        self.$store.dispatch('addConsultant', consultant);
                    });

                });
            }, 

            deleteConsultants() {

                var self = this;

                $.each(this.$store.state.consultants, function(index, consultant){
                    self.$store.dispatch('deleteConsultant', consultant.id);
                });

                alert('deleted all...');
            }
        }
    }
</script>
