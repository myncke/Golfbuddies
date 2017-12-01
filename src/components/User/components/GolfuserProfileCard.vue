<template>
  <v-form ref="form" v-model="valid">
    <v-layout row wrap v-if="model !== undefined">

      <v-flex xs12 class="pa-3">
        <p class="subheading">Golf Information</p>
      </v-flex>
      <v-flex v-if="secrets" sm6 xs12 class="pa-3">
        <v-text-field
          label="Federaal Nummer"
          v-model="model.federaalNummer"
          :disabled="!editMode"
          :rules="requiredRule"
          required
        ></v-text-field>
      </v-flex>

      <v-flex sm6 xs12 class="pa-3">
        <v-text-field
          label="Handicap"
          placeholder="10.1I Or 10.1A"
          v-model="model.hdc"
          :disabled="!editMode"
          :rules="requiredRule"
          required
        ></v-text-field>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
  import GolfUserModel from '../../../models/GolfUserModel'

  export default {
    data: () => ({
      model: undefined,
      valid: false,
      requiredRule: [
        (val) => !!val || 'This field is required'
      ]
    }),
    created: function () {
      this.initModel(this.pId)
    },
    methods: {
      initModel: async function () {
        if (this.pId) {
          this.model = new GolfUserModel(this.pId, false, model => { this.model = undefined; this.model = model }, error => { this.error = error.message })
        } else {
          this.model = new GolfUserModel()
        }
      },
      setEditMode: function (val) {
        this.editMode = val
      },
      save: async function () {
        if (!/^[0-9]*.[0-9][AI]$/.test(this.model.hdc)) {
          this.$emit('error', 'Hdc should be of the format xx.xA or xx.xI')
          return null
        }
        await this.model.save()
        console.log('SAVED GOLFUSER')
      },
      getModel: function () {
        if (!/^[0-9]*.[0-9][AI]$/.test(this.model.hdc)) {
          this.$emit('error', 'Hdc should be of the format xx.xA or xx.xI')
          return null
        }
        return this.model
      },
      isValid () {
        return this.valid
      },
      submit () {
        return this.$refs.form.validate()
      }
    },
    props: {
      pId: String,
      editMode: {
        default: false,
        type: Boolean
      },
      secrets: {
        default: true,
        type: Boolean
      }
    }
  }
</script>

<style>

</style>
