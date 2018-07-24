<template>
<div class="animated fadeIn">
  <b-collapse id="formDefault" visible>
    <b-form class="formView">
      <!-- Json File Upload -->
      <b-form-fieldset
        label="File Upload"
        :horizontal="true">
        <input type="file" v-on:change="fileOnChange"/>
      </b-form-fieldset>
      <b-form-fieldset
        label="CONFIG JSON"
        :horizontal="true">
        <b-table
          class="sub"
          show-empty
          :items="configJson.headers">
          <template slot="new" slot-scope="row">
            <pre class="code left text-left" style="height:380px" id="newJson"></pre>
          </template>
          <template slot="old" slot-scope="row">
            <pre class="code right text-left" style="height:380px" id="oldJson"></pre>
          </template>
        </b-table>
      </b-form-fieldset>
    </b-form>
  </b-collapse>
</div>
</template>
<script>
import ContentHeader from '@/components/ContentHeader'
import cSwitch from '@/components/Switch'
import jdc from '../../../jsonDifferentCompare'
export default {
  name: 'diff',
  components: {
    ContentHeader,
    cSwitch
  },
  data() {
    return {
      newJsonObject: '',
      oldJsonObject: '',
      configJson: {
        headers: [{
            new: null,
            old: null
        }]
      }
    }
  },
  computed: {

  },
  created() {
    this.newJsonObject = {
      "control": {
        "command_type": "SERVICE_CONFIG"
      },
      "config": {
        "upstream": {
          "directives": [{
            "key": "testcase",
            "value": "1234567890"
          },{
            "key": "gg",
            "value": "gl"
          }]
        }
      }
    }
    this.oldJsonObject = {
      "control": {
        "command_type": "SERVICE_CONFIG"
      },
      "config": {
        "upstream": {
          "directives": [{
            "key": "testcase",
            "value": "1234567890"
          },{
            "key": "gg",
            "value": "gl"
          }]
        }
      }
    }
  },
  mounted() {
    this.jsonDifferentCompare()
  },
  methods: {
    fileOnChange: function(fileOnChangeEvent) {
      var reader = new FileReader()
      var onloadFunction = function(readerOnLoadEvent) {
        var loadJsonObject = this.isJson(readerOnLoadEvent.target.result)
        if (loadJsonObject) {
          this.newJsonObject = loadJsonObject
          this.jsonDifferentCompare()
        } else {
          alert('NOT JSON')
        }
      }
      reader.onload = onloadFunction.bind(this)
      reader.readAsText(fileOnChangeEvent.target.files[0])
    },
    isJson: function(fileContent) {
      try {
		    var jsonObject = JSON.parse(fileContent)
	      if (jsonObject && typeof jsonObject === 'object') {
		      return jsonObject
        }
      } catch (e) {}
	    return false
    },
    jsonDifferentCompare: function() {
      jdc.jdd.diffs = []
      var newConfig = jdc.createConfig()
      jdc.formatAndDecorate(newConfig, this.newJsonObject)
      document.getElementById('newJson').textContent = newConfig.out
      var oldConfig = jdc.createConfig()
      jdc.formatAndDecorate(oldConfig, this.oldJsonObject)
      document.getElementById('oldJson').textContent = oldConfig.out
      jdc.formatPRETags()
      newConfig.currentPath = []
      oldConfig.currentPath = []
      jdc.diffVal(this.newJsonObject, newConfig, this.oldJsonObject, oldConfig)
      jdc.processDiffs()
      if (jdc.jdd.diffs.length > 0) {
          jdc.highlightDiff(0)
          jdc.currentDiff = 0
      }
      var differentNodeList = document.querySelectorAll('span.diff')
      Array.prototype.forEach.call(differentNodeList, differentNode => {
        differentNode.style.background = 'red'
        differentNode.style.color = 'white'
      })
    }
  }
}
</script>
