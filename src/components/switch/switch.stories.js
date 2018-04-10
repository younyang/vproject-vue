import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import VueInfoAddon from 'storybook-addon-vue-info'

import cSwitch from './Switch.vue'

storiesOf('Form', module)
  .addDecorator(VueInfoAddon)
  .add('Switch', () => ({
    components: { cSwitch },
    template: `<c-switch
  v-model="checked"
  type="text"
  class="v-switch" 
  on="사용" 
  off="미사용"
></c-switch>`,
    methods: {
      log: e => {
        e.preventDefault();
        action('log2')(e.target);
      }
    }
  }));
