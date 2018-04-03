const _ = require('lodash');
const Ora = require('ora');
const Chalk = require('chalk');

/**
 * @exports
 * @function Error 打印错误信息并且停止进程
 * @param {string|Object} msg 信息文本/对象
 */
exports.Error = function LogError(msg) {
  Ora().fail(Chalk.red(msg));
  process.exit(1);
};

/**
 * @exports
 * @function Info 打印普通提示信息
 * @param {string} msg 信息文本
 */
exports.Info = function LogInfo(msg) {
  console.info(msg);
};

/**
 * @exports
 * @function Warning 打印警告信息
 * @param {string} msg 信息文本
 */
exports.Warning = function LogWarning(msg) {
  console.warn(msg);
};

/**
 * @exports
 * @function Success 打印成功信息
 * @param {string} msg 信息文本
 */
exports.Success = function LogSuccess(msg) {
  Ora().succeed(msg);
};

/**
 * @exports
 * @function Loading 打印loading信息
 * @param {Promise} action loading期间的执行逻辑
 * @param {string} msg loading文本
 * @param {Function|null|undefined} callback loading结束后的回调函数
 */
exports.Loading = function LogLoading(action, msg, callback=null) {
  if (!action || typeof action.then !== 'function') {
    throw '<Log.loading>Invalid parameter';
  }
  const Spinner = Ora(msg).start();

  action.then(({msg,data}) => {
    Spinner.succeed(msg);
    _.isFunction(callback) && callback(data);
  }).catch(err => {
    throw err;
  });
}