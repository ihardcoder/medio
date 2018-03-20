/**
 * @exports
 * @function Error 打印错误信息并且停止进程
 * @param {string|Object} msg 信息文本/对象
 */
exports.Error = msg => {
  console.error(msg);
  process.exit();
};

/**
 * @exports
 * @function Info 打印普通提示信息
 * @param {string} msg 信息文本
 */
exports.Info = msg => {
  console.info(msg);
};

/**
 * @exports
 * @function Warning 打印警告信息
 * @param {string} msg 信息文本
 */
exports.Warning = msg => {
  console.warn(msg);
};

exports.Success = msg => {
  console.log(msg);
};