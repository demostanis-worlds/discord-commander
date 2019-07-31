"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiscordCommander = exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DiscordCommander =
/*#__PURE__*/
function () {
  function DiscordCommander(config) {
    var _this = this;

    _classCallCheck(this, DiscordCommander);

    this.config = config;
    this.config.client.on("message", function (msg) {
      if (_this.config.disableDMs) return;
      !msg.author.bot && _this.exec(msg);
    });
    this.config.commands.forEach(function (cmd) {
      return cmd.inTimeout = false;
    });
  }

  _createClass(DiscordCommander, [{
    key: "exec",
    value: function exec(msg) {
      var _this2 = this;

      var message = msg.content.replace(/\s+/g, " ");
      var command = this.config.commands.find(function (cmd) {
        return cmd.name === message.split(" ")[0];
      });
      var parts = message.split(" ");
      var argumentList = [];
      var optionList = [];
      if (!command) return;

      if (command.vipOnly && this.config.vipRole && msg.member && !msg.member.roles.has(this.config.vipRole)) {
        msg.reply(this.config.vipOnlyMessage);
        return;
      }

      if (command.timeout && command.inTimeout && msg.member && this.config.vipRole && !msg.member.roles.has(this.config.vipRole)) {
        msg.channel.send(this.config.timeoutMessage);
        return;
      } else if (command.timeout) {
        command.inTimeout = true;
        setTimeout(function () {
          return command.inTimeout = false;
        }, command.timeout);
      }

      var c = true;
      parts.forEach(function (part, i) {
        for (var opt in command.optionList) {
          if (command.optionList[opt].name === part) {
            if (_this2.config.vipRole) {
              if (command.optionList[opt].vipOnly && msg.member && !msg.member.roles.has(_this2.config.vipRole)) {
                msg.reply(_this2.config.vipOnlyMessage);
                return c = false;
              }
            }

            optionList.push({
              name: command.optionList[opt].name,
              value: parts[i + 1] || true,
              rawOption: command.optionList[opt]
            });
          }
        }
      });
      parts.forEach(function (part) {
        if (part !== parts[0] && !optionList.find(function (_ref) {
          var name = _ref.name;
          return name === part;
        })) {
          if (!command.argumentList[argumentList.length]) return;
          argumentList.push({
            name: command.argumentList[argumentList.length].name,
            value: part,
            rawArgument: command.argumentList[argumentList.length]
          });
        }
      });
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var arg = _step.value;

          if (arg.required && !argumentList.find(function (_ref4) {
            var name = _ref4.name;
            return name === arg.name;
          })) {
            msg.reply(_this2.config.argumentRequiredMessage);
            return {
              v: void 0
            };
          }
        };

        for (var _iterator = command.argumentList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ret = _loop();

          if (_typeof(_ret) === "object") return _ret.v;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      Object.assign(argumentList, {
        get: function get(e) {
          var arg = this.find(function (_ref2) {
            var name = _ref2.name;
            return name === e;
          });
          return arg ? arg.value : undefined;
        }
      });
      Object.assign(optionList, {
        get: function get(e) {
          var opt = this.find(function (_ref3) {
            var name = _ref3.name;
            return name === e;
          });
          return opt ? opt.value : undefined;
        }
      });
      c && command.does && command.does(msg, argumentList, optionList);
    }
  }]);

  return DiscordCommander;
}();

exports.DiscordCommander = DiscordCommander;
var _default = DiscordCommander;
exports["default"] = _default;

