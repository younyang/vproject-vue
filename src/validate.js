
const isBlank = (val) => (val === '' || val === null || typeof val === 'undefined');
const isNotNumber = (val) => (typeof val !== 'number');

const invalidFeedback = {
  require (value = ''){
    const rule = isBlank(value);
    return !rule
  },

  'require-number' (value = ''){
    const rule = isBlank(value) || isNotNumber(value);
    return !rule
  }
};



export default {
  msg: {
    require: '필수 입력 항목입니다.',
    select: '필수 선택 항목입니다.',
    check: '필수 체크 항목 입니다.',
    onlyeng: '영문, 숫자만 입력 가능합니다.'
  },

  is (value, rule='require'){
    return invalidFeedback[rule](value)
  },

  isObject (obj, rule='require'){
    let valid = true;
    let itemKeys = Object.keys(obj);
    if (itemKeys.length === 0){
      return false;
    }

    itemKeys.forEach(key => {
      if (!this.is(obj[key], rule)){
        valid = false;
      }
    });
    return valid;
  },

  isArray (array, rule='require'){
    let valid = true;
    if (array.length === 0){
      return false;
    }
    array.forEach(val => {
      if( typeof val === 'string' || typeof val === 'number' || val === null){
        if (!this.is(val, rule)){
          valid = false;
        }
      }else if (typeof val === 'object' && val.constructor === Object) {
        if (!this.isObject(val)) {
          valid = false;
        }
      }
    });
    return valid;
  },

  all (items, options = {}) {
    const itemKeys = Object.keys(items);

    let valid = true;

    itemKeys.forEach(key => {
      const rule = options[key] || 'require';
      const val = items[key];

      if( typeof val === 'string' || typeof val === 'number' || val === null){
        if (!this.is(val, rule)){
          valid = false;
        }
      }else if (typeof val === 'object' && val.constructor === Object){
        if (!this.isObject(val)) {
          valid = false;
        }
      }else if (typeof val === 'object' && val.constructor === Array){
        if (!this.isArray(val)) {
          valid = false;
        }
      }
    });

    return valid;
  }
};


