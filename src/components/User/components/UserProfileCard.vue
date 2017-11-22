<template>
  <v-card>
    <v-card-text>
      <v-form v-model="valid">
        <v-layout row wrap>

          <!-- Text Fields -->

          <v-flex xs12 class="pa-3">
            <v-text-field
              label="First Name"
              v-model="model.firstName"
              :rules="requiredRule"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 class="pa-3">
            <v-text-field
              label="Last Name"
              v-model="model.lastName"
              :rules="requiredRule"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 class="pa-3">
            <v-text-field
              label="Nickname"
              v-model="model.nickname"
              :rules="requiredRule"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12>
            <date-picker
              class="ma-3" label="Birthdate" v-on:date-chosen="val => { model.birthdate = new Date(val) }"
              :allowedFunction="(date) => date <= (new Date())"
            ></date-picker>
          </v-flex>

          <v-flex xs12 class="pa-3">
            <v-select :items="countries"
                      v-model="model.nationality"
                      label="Select"
                      single-line
                      prepend-icon="map"
                      :rules="requiredRule"
                      required
            ></v-select>
          </v-flex>

          <v-flex xs12 class="pa-3">
            <v-text-field
              label="Region/Province"
              v-model="model.region"
              :rules="requiredRule"
              placeholder="Oost-Vlaanderen"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 class="pa-3">
            <v-text-field
              label="Phone Number"
              v-model="model.phone"
              :rules="requiredRule"
              placeholder="0477112233"
              required
            ></v-text-field>
          </v-flex>

          <v-flex xs12 class="pa-3">
            <v-radio-group v-model="model.sex">
              <v-radio v-for="sex in sexes"
                       :key="sex"
                       :label="sex"
                       :value="sex"
                       :rules="requiredRule"
                       required
              ></v-radio>
            </v-radio-group>
          </v-flex>

        </v-layout>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import UserModel, { sexes } from '../../../models/UserModel'
  import LocationUtils from '../../../utils/LocationUtils'
  import MenuDatePicker from '../../Shared/MenuDatePicker'

  export default {
    data: () => ({
      model: undefined,
      countries: [],
      sexes: [],
      valid: false,
      requiredRule: [
        (val) => !!val || 'This field is required'
      ]
    }),
    created () {
      this.model = new UserModel('kek')
      this.countries = LocationUtils.countries
      this.sexes = sexes
    },
    methods: {
      getModel () {
        return this.model
      },
      isValid () {
        return this.valid
      },
      setModel (model) {
        this.model = model
      }
    },
    components: {
      'date-picker': MenuDatePicker
    }
  }
</script>

<style>

</style>
