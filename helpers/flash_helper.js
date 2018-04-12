const FlashHelper = {};


FlashHelper.bootstrapAlertClassFor = function(key) {
  return {
    "error": "danger",
    "success": "info",
  }[key] || key;
};


module.exports = FlashHelper;
