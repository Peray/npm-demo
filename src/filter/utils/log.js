import logConfig from './logConfig';

class Log {
    static LEVEL = {
      debug: 1,
      info: 2,
      warn: 3,
      error: 4
    }

    // static logConfig = {
    //     __ROOT__: {
    //         level: 'info'
    //     }
    // }
    static logConfig = logConfig

    constructor(className) {
      this.className = className;
    }

    getClassLogLevelNo() {
      // 如果log配置存在
      if (Log.logConfig) {
        if (Log.logConfig[this.className] && Log.logConfig[this.className].level) {
          return Log.LEVEL[Log.logConfig[this.className].level.toLowerCase()];
        } else if (Log.logConfig.__ROOT__) {
          return Log.LEVEL[Log.logConfig.__ROOT__.level];
        }
      }
      return 0;
    }

    __log(level, ...args) {
      let levelNo = Log.LEVEL[level];
      let classLevelNo = this.getClassLogLevelNo();
      // console.log(levelNo, classLevelNo, this.className, Log.logConfig[this.className]);
      if (levelNo < classLevelNo) { return; }

      switch (level) {
        case 'debug':
          console.debug(...args);
          break;
        case 'info':
          console.log(...args);
          break;
        case 'warn':
          console.warn(...args);
          break;
        case 'error':
          console.error(...args);
          break;
        default:
          break;
      }
    }

    static getLogger(className) {
      const log = new Log(className);
      return log;
    }

    __getClassPrintName() {
      return `<${this.className}>`;
    }

    debug(...args) {
      this.__log('debug', this.__getClassPrintName(), ...args);
    }

    info(...args) {
      this.__log('info', this.__getClassPrintName(), ...args);
    }

    warn(...args) {
      this.__log('warn', this.__getClassPrintName(), ...args);
    }

    error(...args) {
      this.__log('error', this.__getClassPrintName(), ...args);
    }
}

export default Log;
