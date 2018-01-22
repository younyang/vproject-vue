<template>
  <b-form-group
    label="label"
    :horizontal="horizontal"
  >
    <template slot="label">
      {{ label }}
      <i class="require" v-if="require">*</i>
    </template>
    <slot></slot>
    <template slot="description" v-if="description">
      {{ description }}
    </template>
  </b-form-group>
</template>

<script>
  export default {
    props: {
      label: {
        type: String
      },

      description: {
        type: String,
        default: null
      },

      valid: {
        type: String,
        default: null
      },

      horizontal: {
        type: Boolean,
        default: true
      }
    },

    mounted (){
      console.log(this.$slots['default'][0])
    },

    computed: {
      state () {
        return this.name.length >= 4 ? true : false
      },
      invalidFeedback () {
        if (this.name.length > 4) {
          return ''
        } else if (this.name.length > 0) {
          return 'Enter at least 4 characters'
        } else {
          return 'Please enter something'
        }
      },
      validFeedback () {
        return this.state === true ? 'Thank you' : ''
      }
    },
    data () {
      return {
        name: ''
      }
    }
  }
</script>
