import Log from '../utils/log';

const log = Log.getLogger('InputValidator');

/**
 * 校验输入
 */
class InputValidator {
  /*
  state 的结构
  option: {
    required: null,
    minLen: null,
    maxLen: null,
    regex: null,
    min: null,
    max: null
  },
  message: {
    required: null,
    minLen: null,
    maxLen: null,
    regex: null,
    value: null,
    min: null,
    max: null
  }
  */
  static valid(isInit, state, value) {
    log.debug(isInit, state, value);
    // 初始化，空值不处理
    if (isInit && !value) return;

    const { required, minLen, maxLen, regex, min, max } = state.option;

    const message = {};
    let valid = true;

    if (required && (!value || (Array.isArray(value) && value.length === 0))) {
      message.required = state.message.required;
      valid = false;
    }

    if (minLen !== null || minLen !== undefined) {
      if (!value || value.toString().length < minLen) {
        message.minLen = state.message.minLen;
        valid = false;
      }
    }

    if (maxLen !== null || maxLen !== undefined) {
      if (!value || value.toString().length > maxLen) {
        message.maxLen = state.message.maxLen;
        valid = false;
      }
    }

    if (regex && !(new RegExp(regex).test(value))) {
      message.regex = state.message.regex;
      valid = false;
    }

    if (min !== null && min !== undefined && Number.parseInt(value) < min) {
      message.regex = state.message.min;
      valid = false;
    }

    if (max !== null && max !== undefined && Number.parseInt(value) > max) {
      message.regex = state.message.max;
      valid = false;
    }

    if (valid) return valid;
    return message;
  }
}

export default InputValidator;
