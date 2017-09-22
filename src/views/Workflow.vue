<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-md-6">
        <b-form-fieldset horizontal label="Rows per page" :label-cols="6">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-fieldset>
      </div>
      <div class="col-md-6">
        <b-form-fieldset horizontal label="Filter" :label-cols="3">
          <b-form-input v-model="filter" placeholder="Type to Search" />
        </b-form-fieldset>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <section class="board">
          <b-table
            striped
            show-empty
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            @filtered="onFiltered"
          >
            <template slot="name" scope="row">{{row.value.first}} {{row.value.last}}</template>
            <template slot="isActive" scope="row">{{row.value?'Yes :)':'No :('}}</template>
            <template slot="actions" scope="row">
              <b-btn size="sm" @click.stop="details(row.item,row.index,$event.target)">Details</b-btn>
            </template>
          </b-table>
        </section>

        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="mt-2" />

        <!-- Details modal -->
        <b-modal id="modal1" @hide="resetModal" ok-only>
          <h4 class="my-1 py-1" slot="modal-header">Index: {{ modalDetails.index }}</h4>
          <pre>{{ modalDetails.data }}</pre>
        </b-modal>
      </div>
    </div><!--/.row-->
  </div>
</template>

<script>
const items = [
  { isActive: true,  age: 40, name: { first: 'Dickerson', last: 'Macdonald' } },
  { isActive: false, age: 21, name: { first: 'Larsen', last: 'Shaw' } },
  { _rowVariant: 'success',
    isActive: false, age: 9,  name: { first: 'Mini', last: 'Navarro' } },
  { isActive: false, age: 89, name: { first: 'Geneva', last: 'Wilson' } },
  { isActive: true,  age: 38, name: { first: 'Jami', last: 'Carney' } },
  { isActive: false, age: 27, name: { first: 'Essie', last: 'Dunlap' } },
  { isActive: true,  age: 40, name: { first: 'Thor', last: 'Macdonald' } },
  { _cellVariants: { age: 'danger', isActive: 'warning' },
    isActive: true,  age: 87, name: { first: 'Larsen', last: 'Shaw' } },
  { isActive: false, age: 26, name: { first: 'Mitzi', last: 'Navarro' } },
  { isActive: false, age: 22, name: { first: 'Genevieve', last: 'Wilson' } },
  { isActive: true,  age: 38, name: { first: 'John', last: 'Carney' } },
  { isActive: false, age: 29, name: { first: 'Dick', last: 'Dunlap' } }
]

export default {
  name: 'workflow',
  components: {
  //  ListContent
  },
  data (){
    return {
      fields: {
        name: {label: 'Person Full name', sortable: true},
        age: {label: 'Person age', sortable: true, 'class': 'text-center'},
        isActive: {label: 'is Active'},
        actions: {label: 'Actions'}
      },
      items: items,
      currentPage: 1,
      perPage: 5,
      totalRows: items.length,
      pageOptions: [{text: 5, value: 5}, {text: 10, value: 10}, {text: 15, value: 15}],
      sortBy: null,
      sortDesc: false,
      filter: null,
      modalDetails: {index: '', data: ''}
    }
  },
  methods: {
    details(item, index, button) {
      this.modalDetails.data = JSON.stringify(item, null, 2);
      this.modalDetails.index = index;
      this.$root.$emit('bv::show::modal','modal1', button);
    },
    resetModal() {
      this.modalDetails.data = '';
      this.modalDetails.index = '';
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    }
  }
}
</script>

