export default {
  jdd: {
    LEFT: 'left',
    RIGHT: 'right',
    EQUALITY: 'eq',
    TYPE: 'type',
    MISSING: 'missing',
    diffs: [],
    requestCount: 0
  },
  createConfig: function() {
    return {
      out: '',
      indent: -1,
      currentPath: [],
      paths: [],
      line: 1
    }
  },
  findDiffs: function( /*Object*/ config1, /*Object*/ data1, /*Object*/ config2, /*Object*/ data2) {
    config1.currentPath.push('/')
    config2.currentPath.push('/')
    var key
    var val
    if (data1.length < data2.length) {
      /*
       * This means the second data has more properties than the first.
       * We need to find the extra ones and create diffs for them.
       */
      for (key in data2) {
        if (data2.hasOwnProperty(key)) {
          val = data1[key]
          if (!data1.hasOwnProperty(key)) {
            this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
              config2, this.generatePath(config2, '/' + key),
              'The right side of this object has more items than the left side', this.jdd.MISSING))
          }
        }
      }
    }
    /*
     * Now we're going to look for all the properties in object one and
     * compare them to object two
     */
    for (key in data1) {
      if (data1.hasOwnProperty(key)) {
        val = data1[key]
        config1.currentPath.push(key)
        if (!data2.hasOwnProperty(key)) {
          /*
           * This means that the first data has a property which
           * isn't present in the second data
           */
          this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
            config2, this.generatePath(config2),
            'Missing property <code>' + key + '</code> from the object on the right side', this.jdd.MISSING))
        } else {
          config2.currentPath.push(key)

          this.diffVal(data1[key], config1, data2[key], config2)
          config2.currentPath.pop()
        }
        config1.currentPath.pop()
      }
    }
    config1.currentPath.pop()
    config2.currentPath.pop()
    /*
     * Now we want to look at all the properties in object two that
     * weren't in object one and generate diffs for them.
     */
    for (key in data2) {
      if (data2.hasOwnProperty(key)) {
        val = data1[key]
        if (!data1.hasOwnProperty(key)) {
          this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
            config2, this.generatePath(config2, key),
            'Missing property <code>' + key + '</code> from the object on the left side', this.jdd.MISSING))
        }
      }
    }
  },
  formatAndDecorate: function( /*Object*/ config, /*Object*/ data) {
    if (_.isArray(data)) {
      this.formatAndDecorateArray(config, data)
      return
    }
    this.startObject(config)
    config.currentPath.push('/')
    var props = this.getSortedProperties(data)
    _.each(props, function(key) {
      config.out += this.newLine(config) + this.getTabs(config.indent) + '"' + this.unescapeString(key) + '": '
      config.currentPath.push(key)
      config.paths.push({
        path: this.generatePath(config),
        line: config.line
      })
      this.formatVal(data[key], config)
      config.currentPath.pop()
    }, this)
    this.finishObject(config)
    config.currentPath.pop()
  },
  startObject: function(config) {
    config.indent++
      config.out += '{'

    if (config.paths.length === 0) {
      /*
       * Then we are at the top of the object and we want to add
       * a path for it.
       */
      config.paths.push({
        path: this.generatePath(config),
        line: config.line
      })
    }

    if (config.indent === 0) {
      config.indent++
    }
  },
  generatePath: function(config, prop) {
    var s = ''
    _.each(config.currentPath, function(path) {
      s += path
    })

    if (prop) {
      s += '/' + prop
    }

    if (s.length === 0) {
      return '/'
    } else {
      return s
    }
  },
  getSortedProperties: function( /*Object*/ obj) {
    var props = []

    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        props.push(prop)
      }
    }

    props = props.sort(function(a, b) {
      return a.localeCompare(b)
    })

    return props
  },
  newLine: function(config) {
    config.line++
      return '\n'
  },
  getTabs: function( /*int*/ indent) {
    var s = ''
    for (var i = 0; i < indent; i++) {
      s += '    '
    }
    return s
  },
  unescapeString: function(val) {
    if (val) {
      return val.replace('\\', '\\\\') // Single slashes need to be replaced first
        .replace('\"', '\\"') // Then double quotes
        .replace('\n', '\\n') // New lines
        .replace('\b', '\\b') // Backspace
        .replace('\f', '\\f') // Formfeed
        .replace('\r', '\\r') // Carriage return
        .replace('\t', '\\t') // Horizontal tabs
    } else {
      return val
    }
  },
  formatVal: function(val, config) {
    if (_.isArray(val)) {
      config.out += '['

      config.indent++
        _.each(val, function(arrayVal, index) {
          config.out += this.newLine(config) + this.getTabs(config.indent)
          config.paths.push({
            path: this.generatePath(config, '[' + index + ']'),
            line: config.line
          })

          config.currentPath.push('/[' + index + ']')
          this.formatVal(arrayVal, config)
          config.currentPath.pop()
        }, this)
      this.removeTrailingComma(config)
      config.indent--

        config.out += this.newLine(config) + this.getTabs(config.indent) + ']' + ','
    } else if (_.isObject(val)) {
      this.formatAndDecorate(config, val)
    } else if (_.isString(val)) {
      config.out += '"' + this.unescapeString(val) + '",'
    } else if (_.isNumber(val)) {
      config.out += val + ','
    } else if (_.isBoolean(val)) {
      config.out += val + ','
    } else if (_.isNull(val)) {
      config.out += 'null,'
    }
  },
  finishObject: function(config) {
    if (config.indent === 0) {
      config.indent--
    }

    this.removeTrailingComma(config)

    config.indent--
      config.out += this.newLine(config) + this.getTabs(config.indent) + '}'
    if (config.indent !== 0) {
      config.out += ','
    } else {
      config.out += this.newLine(config)
    }
  },
  removeTrailingComma: function(config) {
    /*
     * Remove the trailing comma
     */
    if (config.out.charAt(config.out.length - 1) === ',') {
      config.out = config.out.substring(0, config.out.length - 1)
    }
  },
  diffVal: function(val1, config1, val2, config2) {

    if (_.isArray(val1)) {
      this.diffArray(val1, config1, val2, config2)
    } else if (_.isObject(val1)) {
      if (_.isArray(val2) || _.isString(val2) || _.isNumber(val2) || _.isBoolean(val2) || _.isNull(val2)) {
        this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
          config2, this.generatePath(config2),
          'Both types should be objects', this.jdd.TYPE))
      } else {
        this.findDiffs(config1, val1, config2, val2)
      }
    } else if (_.isString(val1)) {
      if (!_.isString(val2)) {
        this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
          config2, this.generatePath(config2),
          'Both types should be strings', this.jdd.TYPE))
      } else if (val1 !== val2) {
        this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
          config2, this.generatePath(config2),
          'Both sides should be equal strings', this.jdd.EQUALITY))
      }
    } else if (_.isNumber(val1)) {
      if (!_.isNumber(val2)) {
        this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
          config2, this.generatePath(config2),
          'Both types should be numbers', this.jdd.TYPE))
      } else if (val1 !== val2) {
        this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
          config2, this.generatePath(config2),
          'Both sides should be equal numbers', this.jdd.EQUALITY))
      }
    } else if (_.isBoolean(val1)) {
      this.diffBool(val1, config1, val2, config2)
    } else if (_.isNull(val1) && !_.isNull(val2)) {
      this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
        config2, this.generatePath(config2),
        'Both types should be nulls', this.jdd.TYPE))
    }
  },
  diffArray: function(val1, config1, val2, config2) {
    if (!_.isArray(val2)) {
      this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
        config2, this.generatePath(config2),
        'Both types should be arrays', this.jdd.TYPE))
      return
    }

    if (val1.length < val2.length) {
      /*
       * Then there were more elements on the right side and we need to
       * generate those differences.
       */
      for (var i = val1.length; i < val2.length; i++) {
        this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1),
          config2, this.generatePath(config2, '[' + i + ']'),
          'Missing element <code>' + i + '</code> from the array on the left side', this.jdd.MISSING))
      }
    }
    _.each(val1, function(arrayVal, index) {
      if (val2.length <= index) {
        this.jdd.diffs.push(this.generateDiff(config1, this.generatePath(config1, '[' + index + ']'),
          config2, this.generatePath(config2),
          'Missing element <code>' + index + '</code> from the array on the right side', this.jdd.MISSING))
      } else {
        config1.currentPath.push('/[' + index + ']')
        config2.currentPath.push('/[' + index + ']')

        if (_.isArray(val2)) {
          /*
           * If both sides are arrays then we want to diff them.
           */
          this.diffVal(val1[index], config1, val2[index], config2)
        }
        config1.currentPath.pop()
        config2.currentPath.pop()
      }
    }, this)
  },
  generateDiff: function(config1, path1, config2, path2, /*String*/ msg, type) {
    if (path1 !== '/' && path1.charAt(path1.length - 1) === '/') {
      path1 = path1.substring(0, path1.length - 1)
    }

    if (path2 !== '/' && path2.charAt(path2.length - 1) === '/') {
      path2 = path2.substring(0, path2.length - 1)
    }

    var pathObj1 = _.find(config1.paths, function(path) {
      return path.path === path1
    })

    var pathObj2 = _.find(config2.paths, function(path) {
      return path.path === path2
    })

    if (!pathObj1) {
      throw 'Unable to find line number for (' + msg + '): ' + path1
    }

    if (!pathObj2) {
      throw 'Unable to find line number for (' + msg + '): ' + path2
    }

    return {
      path1: pathObj1,
      path2: pathObj2,
      type: type,
      msg: msg
    }
  },
  formatPRETags: function() {
    _.each(document.querySelectorAll('pre'), function(pre) {

      var codeBlock = document.createElement('pre')
      codeBlock.className = 'codeBlock'
      var codeLines = document.createElement('div')
      codeBlock.append(codeLines)

      var addLine = function(line, index) {
        var div = document.createElement('div')
        div.className = 'codeLine line' + (index + 1)

        var span = document.createElement('span')
        span.className = 'code'
        span.textContent = line
        div.append(span)

        codeLines.append(div)
      }

      var lines = pre.textContent.split('\n')
      _.each(lines, addLine)

      codeBlock.className = pre.className
      codeBlock.id = pre.id
      pre.replaceWith(codeBlock)
    })
  },
  processDiffs: function() {
    var left = []
    var right = []

    _.each(this.jdd.diffs, function(diff, index) {
      var leftLine = document.querySelector('pre.left div.line' + diff.path1.line + ' span.code')
      leftLine.classList.add(diff.type)
      leftLine.classList.add('diff')
      var rightLine = document.querySelector('pre.right div.line' + diff.path2.line + ' span.code')
      rightLine.classList.add(diff.type)
      rightLine.classList.add('diff')
    })

    this.jdd.diffs = this.jdd.diffs.sort(function(a, b) {
      return a.path1.line - b.path1.line
    })

  },
  highlightDiff: function(index) {
    this.handleDiffClick(this.jdd.diffs[index].path1.line, this.jdd.BOTH)
  },
  handleDiffClick: function(line, side) {
    var diffs = _.filter(this.jdd.diffs, function(diff) {
      if (side === this.jdd.LEFT) {
        return line === diff.path1.line
      } else if (side === this.jdd.RIGHT) {
        return line === diff.path2.line
      } else {
        return line === diff.path1.line || line === diff.path2.line
      }
    }, this)

    var leftSpanList = document.querySelectorAll('pre.left span.code')
    leftSpanList.forEach(span => {
      span.classList.remove('selected')
    })
    var rightSpanList = document.querySelectorAll('pre.right span.code')
    rightSpanList.forEach(span => {
      span.classList.remove('selected')
    })

    _.each(diffs, function(diff) {
      document.querySelector('pre.left div.line' + diff.path1.line + ' span.code').classList.add('selected')
      document.querySelector('pre.right div.line' + diff.path2.line + ' span.code').classList.add('selected')
    })

    if (side === this.jdd.LEFT || side === this.jdd.RIGHT) {
      this.currentDiff = _.findIndex(this.jdd.diffs, function(diff) {
        return diff.path1.line === line
      })
    }

    if (this.currentDiff === -1) {
      this.currentDiff = _.findIndex(this.jdd.diffs, function(diff) {
        return diff.path2.line === line
      })
    }
  }
}
