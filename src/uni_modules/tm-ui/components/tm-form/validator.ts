//指定了类型校验
const defaultValidatorByType = (value: any, rule: TM.FORM_RULE_TYPE) => {
   
    //但也有可能是string
    if (rule.type == 'number') {
        let val = typeof value == 'string' ? parseFloat(value) : value
        if (isNaN(val)) return false;
        if (rule.max == -1) return val >= rule.min
        return val >= rule.min && val <= rule.max
    }
    if (typeof value == 'undefined' || typeof value == null) {
        return false
    }
    if (rule.type == 'string') {
        let val = value.trim()
        if (val === '') return false;
        let len = value.split('').length
        if (rule.max == -1) return len >= rule.min
        return len >= rule.min && len <= rule.max
    }
    if (Array.isArray(value) && rule.type == 'array') {
        if (value.length == 0) return false;
        if (rule.max == -1) return value.length >= rule.min
        return value.length >= rule.min && value.length <= rule.max
    }

    if (rule.type == 'date') {
        if (typeof value == 'string') {
            let date = new Date(value.replace(/-/g, '/')).getTime()
            return !isNaN(date)
        } else if (typeof value == 'number') {
            let date = new Date(value).getTime()
            return !isNaN(date)
        }
    }
    if (rule.type == 'phone') {
        let val = typeof value == 'string' ? value : value.toString()
        let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        return val.match(reg);
    }
    if (rule.type == 'email' && typeof value == 'string') {
        let reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return reg.test(value)
    }

    return true
}
export const defaultValidator = (value: any, rule: TM.FORM_RULE_TYPE) => {
    if (!rule.required) return true;
    if(rule.validator) return rule.validator(value);
    if(rule.rule) {
        return rule.rule.test(value);
    }
    if (rule.type != 'auto') return defaultValidatorByType(value, rule)
    if (typeof value == 'number') {
        if (isNaN(value)) return false;
        if (rule.max == -1) return value >= rule.min
        return value >= rule.min && value <= rule.max
    }
    if (typeof value == 'undefined' || typeof value == null) {
        return false
    }
    if (typeof value == 'string') {
        let val = value.trim()
        if (val === '') return false;
        let len = value.split('').length
        if (rule.max == -1) return len >= rule.min
        return len >= rule.min && len <= rule.max
    }
    if (Array.isArray(value)) {
        if (value.length == 0) return false;
        if (rule.max == -1) return value.length >= rule.min
        return value.length >= rule.min && value.length <= rule.max
    }

    if (typeof value == 'object') {
        let keys = Object.keys(value)
        return keys.length > 0
    }

    return true
}
