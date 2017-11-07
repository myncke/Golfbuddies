<template>
  <v-layout row wrap>
    <v-flex sx12 sm5>
      <menu-date-picker
        v-on:date-chosen="date => { createDate(date, 'start') }"
        :allowedFunction="(date) => date >= addDays(-1, new Date())"
      ></menu-date-picker>
      <menu-date-picker
        v-on:date-chosen="date => { createDate(date, 'end') }"
        :allowedFunction="(date) => date > (start || new Date())"
      ></menu-date-picker>

      <v-layout wrap>
        <v-flex xs12>
          <v-select
            v-model="select"
            label="Extra Filters"
            chips
            tags
            :items="items"
          ></v-select>
        </v-flex>
      </v-layout>
    </v-flex>

    <v-flex sm5 offset-sm1>
      <v-layout row wrap>
        <v-flex xs10>
          <v-slider prepend-icon="group" :max="8" v-model="group_size"></v-slider>
        </v-flex>
        <v-flex xs2>
          <v-text-field v-model="group_size" type="number"></v-text-field>
        </v-flex>
        <v-flex xs10>
          <!--<v-slider prepend-icon="accessible" :max="50" v-model="hdc"></v-slider>-->
        </v-flex>
        <v-flex xs2>
          <!--<v-text-field v-model="hdc" type="number"></v-text-field>-->
        </v-flex>

        <v-flex>
          <v-select
            v-bind:items="sexes"
            v-model="sex"
            label="Select"
            single-line
            auto
            prepend-icon="accessibility"
            hide-details
          ></v-select>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
  import { PrefGameSex } from '../../../models/GameModel'
  import MenuDatePicker from '../MenuDatePicker'
  import DateUtils from '../../../utils/DateUtils'

  export default {
    data: () => ({
      start: null,
      end: null,
      group_size: 0,
      hdc: 1,
      select: [],
      items: [
        'International',
        'Competition',
        'Buggie',
        'Overnight'
      ],
      sexes: PrefGameSex,
      sex: null
    }),
    methods: {
      getFilterObject: function () {
        console.log(this.start)
        return {
          start: this.start,
          end: this.end,
          group_size: this.group_size,
          hdc: this.hdc,
          select: this.select,
          sex: this.sex
        }
      },
      createDate: function (date, key) {
        console.log(date)
        if (date) {
          this[key] = new Date(date)
        } else {
          this[key] = null
        }
        console.log(this[key])
      },
      addDays (amount, date) {
        return DateUtils.addDays(amount, date)
      }
    },
    components: {
      'menu-date-picker': MenuDatePicker
    }
  }
</script>

<style>

</style>
