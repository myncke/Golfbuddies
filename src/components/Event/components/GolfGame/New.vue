<template>
  <v-card>
    <v-card-title>
      <p class="title">Game Information</p>
    </v-card-title>
    <v-card-text>
      <v-form  v-model="valid" :value="false" ref="form">
        <v-layout row wrap>
          <v-flex lg4 sm6 xs12 class="input-field">
            <v-checkbox label="Buggie Possible?"
                        v-model="model.buggie"
                        color="primary">
            </v-checkbox>
          </v-flex>
          <v-flex lg4 sm6 xs12 class="input-field">
            <v-checkbox label="Overnight Possible?"
                        v-model="model.overnight"
                        color="primary">
            </v-checkbox>
          </v-flex>
          <v-flex sm6 xs12 class="input-field">
            <v-text-field label="Price per Round" :mask="'####'" v-model="model.roundPrice"
            ></v-text-field>
          </v-flex>
          <v-flex sm6 xs12 class="input-field">
            <v-text-field label="Maximum Handicap" :mask="'##'" v-model="model.minHdc" required
                          :rules="rules.hdcRules"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
  import GolfGameModel from '../../../../models/GolfGameModel'

  export default {
    data: () => ({
      valid: false,
      rules: {
        hdcRules: [
          (v) => !!v || 'Minimum Handicap is required'
        ]
      }
    }),
    created: function () {
      this.model = this.model || new GolfGameModel()
    },
    methods: {
      getModel: function () {
        if (typeof this.model.minHdc === 'string') {
          this.model.minHdc = parseInt(this.model.minHdc)
        }
        if (typeof this.model.roundPrice === 'string') {
          this.model.roundPrice = parseFloat(this.model.roundPrice)
        }

        this.model.buggie = this.model.buggie || false
        this.model.overnight = this.model.buggie || false

        return this.model
      },
      isValid () {
        return this.model.roundPrice !== undefined && this.model.minHdc !== undefined
      },
      validate () {
        return this.$refs.form.validate()
      }
    },
    props: {
      model: {
        type: Object,
        default: undefined
      }
    }
  }
</script>

<style scoped>
</style>
