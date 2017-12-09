<template>
  <v-layout row wrap>
    <v-flex style="padding-right: 5px" md6 xs12>
      <date-picker
        v-on:date-chosen="val => { date = new Date(val) }"
        :allowedFunction="allowedFunction"
        :label="label + ' Date'"
        :date="myDate"
      ></date-picker>
    </v-flex>
    <v-flex md6 xs12>
      <v-dialog
        lazy
        full-width
        width="290px"
      >
        <v-text-field
          slot="activator"
          :label="label + ' Time'"
          v-model="time"
          prepend-icon="access_time"
          readonly
        ></v-text-field>
        <v-time-picker v-model="time" autosave actions format="24hr">
          <template slot-scope="{ save, cancel }">
            <v-card-actions>
              <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="save">Save</v-btn>
            </v-card-actions>
          </template>
        </v-time-picker>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
  import DatePicker from './MenuDatePicker.vue'
  export default {
    data: () => ({
      time: '',
      myDate: undefined
    }),
    watch: {
      time () {
        if (this.time) {
          this.valueChanged()
        }
      },
      myDate () {
        if (this.myDate) {
          this.valueChanged()
        }
      }
    },
    created () {
      this.time = this.date.getHours() + ':' + this.date.getMinutes()
      this.myDate = this.$moment(this.date).format('YYYY-MM-DD')
    },
    methods: {
      valueChanged () {
        if (this.date === undefined) return
        let result = this.date
        result.setHours(Number(this.time.split(':')[0] || '12'))
        result.setMinutes(Number(this.time.split(':')[1] || '00'))
        this.$emit('value-changed', result)
      }
    },
    props: {
      allowedFunction: Function,
      label: {
        default: 'Picker in menu',
        type: String
      },
      date: {
        default: null,
        type: Date
      }
    },
    components: {
      'date-picker': DatePicker
    }
  }
</script>

<style>

</style>
