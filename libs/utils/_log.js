exports.Error = msg => {
  console.error(msg);
  process.exit(1);
};

exports.Info = msg => {
  console.error(msg);
};

exports.Warning = msg => {
  console.error(msg);
};