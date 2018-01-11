<template>
  <div
    tabindex="0"
    :class="{ 'multiselect--active': isOpen }"
    @focus="activate()"
    @blur="deactivate()"
    @keyup.esc="deactivate()"

    class="multiselect pops">
      <slot name="caret" :toggle="toggle">
        <div @mousedown.prevent.stop="toggle()" class="multiselect__select"></div>
      </slot>
      <div ref="tags" class="multiselect__tags">
        <div class="multiselect__tags-wrap" v-show="value !== null">
          <span class="multiselect__tag">
            <span>{{ getValue() }}</span>
            <i aria-hidden="true" tabindex="1" @mousedown.prevent="onRemove(value)" class="multiselect__tag-icon"></i>
          </span>
        </div>
        <span
          v-show="value === null"
          class="multiselect__single"
          @mousedown.prevent="toggle">
          {{ placeholder }}
        </span>
      </div>
      <transition name="multiselect">
        <div
          class="multiselect__content-wrapper"
          v-show="isOpen"
          @focus="activate"
          @mousedown.prevent
          ref="list">
          <ul class="multiselect__content" :style="contentStyle">
            <li class="multiselect__element" v-for="(opt, index) in options" :key="index">
              <span
                @click.stop="onSelect(opt)"
                :class="{'multiselect__option--selected multiselect__option--disabled': isOptionSelected(opt)}"
                class="multiselect__option">
                <slot name="option" :option="opt">
                  <span>{{ getOptionLabel(opt) }}</span>
                </slot>
              </span>
            </li>
          </ul>
        </div>
      </transition>
  </div>
</template>

<script>
  const deepClone = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(deepClone)
    } else if (obj && typeof obj === 'object') {
      var cloned = {}
      var keys = Object.keys(obj)
      for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i]
        cloned[key] = deepClone(obj[key])
      }
      return cloned
    } else {
      return obj
    }
  };

  export default {
    name: 'multiselect-share',
    props: {
      id: {
        default: null
      },

      value: {
        type: Object,
        default: null
      },

      options: {
        type: Array,
        required: true
      },

      placeholder: {
        type: String,
        default: 'Select'
      },

      shareModel: {
        default: null
      },

      trackBy: {
        type: String
      },

      label: {
        type: String
      },

      isSelected: {
        type: Function,
        default (opt, model) {
          const id = opt[this.trackBy];
          const selectedItem = model.map(obj => obj[this.trackBy]);
          return selectedItem.length ? (selectedItem.find(value => value == id)) : false;
        }
      }
    },

    data (){
      return {
        isOpen: false
      }
    },

    methods: {
      onSelect (opt) {
        this.$emit('select', deepClone(opt), this.id, this.shareModel);
        this.deactivate();
      },

      onRemove (opt) {
        this.$emit('remove', deepClone(opt), this.id, this.shareModel);
        this.deactivate();
      },

      getValue (){
        return this.value ? this.value[this.label] : '';
      },

      getOptionLabel (opt){
        return opt[this.label];
      },

      isOptionSelected (opt){
        const model = this.shareModel ? this.shareModel : this.options;
        return this.isSelected(opt, model);
      },

      activate () {
        this.isOpen = true;
        this.$el.focus();
      },

      deactivate () {
        this.isOpen = false;
        this.$el.blur();
      },

      toggle () {
        this.isOpen
          ? this.deactivate()
          : this.activate()
      },

      contentStyle () {
        return this.options.length
          ? { 'display': 'inline-block' }
          : { 'display': 'block' }
      }
    }
  }
</script>
