'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kdj = require('./kdj');

var _kdj2 = _interopRequireDefault(_kdj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * KDJTooltip
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var KDJTooltip = function (_kdjTooltip) {
  _inherits(KDJTooltip, _kdjTooltip);

  function KDJTooltip() {
    _classCallCheck(this, KDJTooltip);

    return _possibleConstructorReturn(this, (KDJTooltip.__proto__ || Object.getPrototypeOf(KDJTooltip)).apply(this, arguments));
  }

  return KDJTooltip;
}(_kdj2.default);

exports.default = KDJTooltip;