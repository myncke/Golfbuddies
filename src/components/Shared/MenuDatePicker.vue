<template>
  <v-menu
    lazy
    :close-on-content-click="false"
    v-model="menu"
    transition="scale-transition"
    offset-y
    full-width
    :nudge-right="40"
    max-width="290px"
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      label="Picker in menu"
      v-model="date"
      prepend-icon="event"
      readonly
    ></v-text-field>
    <v-date-picker v-model="date" no-title scrollable actions
                   :allowed-dates="allowedFunction">
      <template slot-scope="{ save, cancel }">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
          <v-btn flat color="primary" @click="save">OK</v-btn>
        </v-card-actions>
      </template>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    date: null,
    menu: false
  }),
  watch: {
    date: function (newVal) {
      console.log(this.date)
      this.$emit('date-chosen', newVal)
    }
  },
  methods: {
  },
  props: {
    allowedFunction: Function
  }
}
</script>


