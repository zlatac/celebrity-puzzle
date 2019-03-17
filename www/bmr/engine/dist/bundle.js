/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./www/bmr/engine/src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  for (var i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(
      uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
    ))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
var ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
var isArray = __webpack_require__(/*! isarray */ "./node_modules/buffer/node_modules/isarray/index.js")

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/buffer/node_modules/isarray/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/buffer/node_modules/isarray/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item, useSourceMap);

      if (item[2]) {
        return '@media ' + item[2] + '{' + content + '}';
      } else {
        return content;
      }
    }).join('');
  }; // import a list of modules into the list


  list.i = function (modules, mediaQuery) {
    if (typeof modules === 'string') {
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    for (var i = 0; i < this.length; i++) {
      var id = this[i][0];

      if (id != null) {
        alreadyImportedModules[id] = true;
      }
    }

    for (i = 0; i < modules.length; i++) {
      var item = modules[i]; // skip already imported module
      // this implementation is not 100% perfect for weird media query combinations
      // when a module is imported multiple times with different media queries.
      // I hope this will never occur (Hey this way we have smaller bundles)

      if (item[0] == null || !alreadyImportedModules[item[0]]) {
        if (mediaQuery && !item[2]) {
          item[2] = mediaQuery;
        } else if (mediaQuery) {
          item[2] = '(' + item[2] + ') and (' + mediaQuery + ')';
        }

        list.push(item);
      }
    }
  };

  return list;
};

function cssWithMappingToString(item, useSourceMap) {
  var content = item[1] || '';
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (useSourceMap && typeof btoa === 'function') {
    var sourceMapping = toComment(cssMapping);
    var sourceURLs = cssMapping.sources.map(function (source) {
      return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
} // Adapted from convert-source-map (MIT)


function toComment(sourceMap) {
  // eslint-disable-next-line no-undef
  var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
  var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;
  return '/*# ' + data + ' */';
}

/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/socket.io-client/dist/socket.io.slim.js":
/*!**************************************************************!*\
  !*** ./node_modules/socket.io-client/dist/socket.io.slim.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
 * Socket.IO v2.2.0
 * (c) 2014-2018 Guillermo Rauch
 * Released under the MIT License.
 */
!function(t,e){ true?module.exports=e():undefined}(this,function(){return function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){"use strict";function n(t,e){"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{};var r,n=i(t),s=n.source,p=n.id,h=n.path,u=c[p]&&h in c[p].nsps,f=e.forceNew||e["force new connection"]||!1===e.multiplex||u;return f?r=a(s,e):(c[p]||(c[p]=a(s,e)),r=c[p]),n.query&&!e.query&&(e.query=n.query),r.socket(n.path,e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(1),s=r(4),a=r(9);r(3)("socket.io-client");t.exports=e=n;var c=e.managers={};e.protocol=s.protocol,e.connect=n,e.Manager=r(9),e.Socket=r(33)},function(t,e,r){"use strict";function n(t,e){var r=t;e=e||"undefined"!=typeof location&&location,null==t&&(t=e.protocol+"//"+e.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?e.protocol+t:e.host+t),/^(https?|wss?):\/\//.test(t)||(t="undefined"!=typeof e?e.protocol+"//"+t:"https://"+t),r=o(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";var n=r.host.indexOf(":")!==-1,i=n?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+i+":"+r.port,r.href=r.protocol+"://"+i+(e&&e.port===r.port?"":":"+r.port),r}var o=r(2);r(3)("socket.io-client:url");t.exports=n},function(t,e){var r=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,n=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");o!=-1&&i!=-1&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=r.exec(t||""),a={},c=14;c--;)a[n[c]]=s[c]||"";return o!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a}},function(t,e){"use strict";t.exports=function(){return function(){}}},function(t,e,r){function n(){}function o(t){var r=""+t.type;if(e.BINARY_EVENT!==t.type&&e.BINARY_ACK!==t.type||(r+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(r+=t.nsp+","),null!=t.id&&(r+=t.id),null!=t.data){var n=i(t.data);if(n===!1)return m;r+=n}return r}function i(t){try{return JSON.stringify(t)}catch(t){return!1}}function s(t,e){function r(t){var r=l.deconstructPacket(t),n=o(r.packet),i=r.buffers;i.unshift(n),e(i)}l.removeBlobs(t,r)}function a(){this.reconstructor=null}function c(t){var r=0,n={type:Number(t.charAt(0))};if(null==e.types[n.type])return u("unknown packet type "+n.type);if(e.BINARY_EVENT===n.type||e.BINARY_ACK===n.type){for(var o="";"-"!==t.charAt(++r)&&(o+=t.charAt(r),r!=t.length););if(o!=Number(o)||"-"!==t.charAt(r))throw new Error("Illegal attachments");n.attachments=Number(o)}if("/"===t.charAt(r+1))for(n.nsp="";++r;){var i=t.charAt(r);if(","===i)break;if(n.nsp+=i,r===t.length)break}else n.nsp="/";var s=t.charAt(r+1);if(""!==s&&Number(s)==s){for(n.id="";++r;){var i=t.charAt(r);if(null==i||Number(i)!=i){--r;break}if(n.id+=t.charAt(r),r===t.length)break}n.id=Number(n.id)}if(t.charAt(++r)){var a=p(t.substr(r)),c=a!==!1&&(n.type===e.ERROR||d(a));if(!c)return u("invalid payload");n.data=a}return n}function p(t){try{return JSON.parse(t)}catch(t){return!1}}function h(t){this.reconPack=t,this.buffers=[]}function u(t){return{type:e.ERROR,data:"parser error: "+t}}var f=(r(3)("socket.io-parser"),r(5)),l=r(6),d=r(7),y=r(8);e.protocol=4,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6,e.Encoder=n,e.Decoder=a;var m=e.ERROR+'"encode error"';n.prototype.encode=function(t,r){if(e.BINARY_EVENT===t.type||e.BINARY_ACK===t.type)s(t,r);else{var n=o(t);r([n])}},f(a.prototype),a.prototype.add=function(t){var r;if("string"==typeof t)r=c(t),e.BINARY_EVENT===r.type||e.BINARY_ACK===r.type?(this.reconstructor=new h(r),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",r)):this.emit("decoded",r);else{if(!y(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");r=this.reconstructor.takeBinaryData(t),r&&(this.reconstructor=null,this.emit("decoded",r))}},a.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},h.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){var e=l.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},h.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},function(t,e,r){function n(t){if(t)return o(t)}function o(t){for(var e in n.prototype)t[e]=n.prototype[e];return t}t.exports=n,n.prototype.on=n.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},n.prototype.once=function(t,e){function r(){this.off(t,r),e.apply(this,arguments)}return r.fn=e,this.on(t,r),this},n.prototype.off=n.prototype.removeListener=n.prototype.removeAllListeners=n.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var r=this._callbacks["$"+t];if(!r)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var n,o=0;o<r.length;o++)if(n=r[o],n===e||n.fn===e){r.splice(o,1);break}return this},n.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),r=this._callbacks["$"+t];if(r){r=r.slice(0);for(var n=0,o=r.length;n<o;++n)r[n].apply(this,e)}return this},n.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},n.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,r){function n(t,e){if(!t)return t;if(s(t)){var r={_placeholder:!0,num:e.length};return e.push(t),r}if(i(t)){for(var o=new Array(t.length),a=0;a<t.length;a++)o[a]=n(t[a],e);return o}if("object"==typeof t&&!(t instanceof Date)){var o={};for(var c in t)o[c]=n(t[c],e);return o}return t}function o(t,e){if(!t)return t;if(t&&t._placeholder)return e[t.num];if(i(t))for(var r=0;r<t.length;r++)t[r]=o(t[r],e);else if("object"==typeof t)for(var n in t)t[n]=o(t[n],e);return t}var i=r(7),s=r(8),a=Object.prototype.toString,c="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===a.call(Blob),p="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===a.call(File);e.deconstructPacket=function(t){var e=[],r=t.data,o=t;return o.data=n(r,e),o.attachments=e.length,{packet:o,buffers:e}},e.reconstructPacket=function(t,e){return t.data=o(t.data,e),t.attachments=void 0,t},e.removeBlobs=function(t,e){function r(t,a,h){if(!t)return t;if(c&&t instanceof Blob||p&&t instanceof File){n++;var u=new FileReader;u.onload=function(){h?h[a]=this.result:o=this.result,--n||e(o)},u.readAsArrayBuffer(t)}else if(i(t))for(var f=0;f<t.length;f++)r(t[f],f,t);else if("object"==typeof t&&!s(t))for(var l in t)r(t[l],l,t)}var n=0,o=t;r(o),n||e(o)}},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==r.call(t)}},function(t,e){function r(t){return n&&Buffer.isBuffer(t)||o&&(t instanceof ArrayBuffer||i(t))}t.exports=r;var n="function"==typeof Buffer&&"function"==typeof Buffer.isBuffer,o="function"==typeof ArrayBuffer,i=function(t){return"function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):t.buffer instanceof ArrayBuffer}},function(t,e,r){"use strict";function n(t,e){if(!(this instanceof n))return new n(t,e);t&&"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new f({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var r=e.parser||c;this.encoder=new r.Encoder,this.decoder=new r.Decoder,this.autoConnect=e.autoConnect!==!1,this.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(10),s=r(33),a=r(5),c=r(4),p=r(35),h=r(36),u=(r(3)("socket.io-client:manager"),r(32)),f=r(37),l=Object.prototype.hasOwnProperty;t.exports=n,n.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)l.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},n.prototype.updateSocketIds=function(){for(var t in this.nsps)l.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t))},n.prototype.generateId=function(t){return("/"===t?"":t+"#")+this.engine.id},a(n.prototype),n.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},n.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},n.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},n.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},n.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},n.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},n.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},n.prototype.open=n.prototype.connect=function(t,e){if(~this.readyState.indexOf("open"))return this;this.engine=i(this.uri,this.opts);var r=this.engine,n=this;this.readyState="opening",this.skipReconnect=!1;var o=p(r,"open",function(){n.onopen(),t&&t()}),s=p(r,"error",function(e){if(n.cleanup(),n.readyState="closed",n.emitAll("connect_error",e),t){var r=new Error("Connection error");r.data=e,t(r)}else n.maybeReconnectOnOpen()});if(!1!==this._timeout){var a=this._timeout,c=setTimeout(function(){o.destroy(),r.close(),r.emit("error","timeout"),n.emitAll("connect_timeout",a)},a);this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(o),this.subs.push(s),this},n.prototype.onopen=function(){this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(p(t,"data",h(this,"ondata"))),this.subs.push(p(t,"ping",h(this,"onping"))),this.subs.push(p(t,"pong",h(this,"onpong"))),this.subs.push(p(t,"error",h(this,"onerror"))),this.subs.push(p(t,"close",h(this,"onclose"))),this.subs.push(p(this.decoder,"decoded",h(this,"ondecoded")))},n.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},n.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},n.prototype.ondata=function(t){this.decoder.add(t)},n.prototype.ondecoded=function(t){this.emit("packet",t)},n.prototype.onerror=function(t){this.emitAll("error",t)},n.prototype.socket=function(t,e){function r(){~u(o.connecting,n)||o.connecting.push(n)}var n=this.nsps[t];if(!n){n=new s(this,t,e),this.nsps[t]=n;var o=this;n.on("connecting",r),n.on("connect",function(){n.id=o.generateId(t)}),this.autoConnect&&r()}return n},n.prototype.destroy=function(t){var e=u(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},n.prototype.packet=function(t){var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(r){for(var n=0;n<r.length;n++)e.engine.write(r[n],t.options);e.encoding=!1,e.processPacketQueue()}))},n.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},n.prototype.cleanup=function(){for(var t=this.subs.length,e=0;e<t;e++){var r=this.subs.shift();r.destroy()}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},n.prototype.close=n.prototype.disconnect=function(){this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},n.prototype.onclose=function(t){this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},n.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();this.reconnecting=!0;var r=setTimeout(function(){t.skipReconnect||(t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):t.onreconnect()}))},e);this.subs.push({destroy:function(){clearTimeout(r)}})}},n.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)}},function(t,e,r){t.exports=r(11),t.exports.parser=r(18)},function(t,e,r){function n(t,e){return this instanceof n?(e=e||{},t&&"object"==typeof t&&(e=t,t=null),t?(t=p(t),e.hostname=t.host,e.secure="https"===t.protocol||"wss"===t.protocol,e.port=t.port,t.query&&(e.query=t.query)):e.host&&(e.hostname=p(e.host).host),this.secure=null!=e.secure?e.secure:"undefined"!=typeof location&&"https:"===location.protocol,e.hostname&&!e.port&&(e.port=this.secure?"443":"80"),this.agent=e.agent||!1,this.hostname=e.hostname||("undefined"!=typeof location?location.hostname:"localhost"),this.port=e.port||("undefined"!=typeof location&&location.port?location.port:this.secure?443:80),this.query=e.query||{},"string"==typeof this.query&&(this.query=h.decode(this.query)),this.upgrade=!1!==e.upgrade,this.path=(e.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!e.forceJSONP,this.jsonp=!1!==e.jsonp,this.forceBase64=!!e.forceBase64,this.enablesXDR=!!e.enablesXDR,this.timestampParam=e.timestampParam||"t",this.timestampRequests=e.timestampRequests,this.transports=e.transports||["polling","websocket"],this.transportOptions=e.transportOptions||{},this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=e.policyPort||843,this.rememberUpgrade=e.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=e.onlyBinaryUpgrades,this.perMessageDeflate=!1!==e.perMessageDeflate&&(e.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=e.pfx||null,this.key=e.key||null,this.passphrase=e.passphrase||null,this.cert=e.cert||null,this.ca=e.ca||null,this.ciphers=e.ciphers||null,this.rejectUnauthorized=void 0===e.rejectUnauthorized||e.rejectUnauthorized,this.forceNode=!!e.forceNode,this.isReactNative="undefined"!=typeof navigator&&"string"==typeof navigator.product&&"reactnative"===navigator.product.toLowerCase(),("undefined"==typeof self||this.isReactNative)&&(e.extraHeaders&&Object.keys(e.extraHeaders).length>0&&(this.extraHeaders=e.extraHeaders),e.localAddress&&(this.localAddress=e.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,void this.open()):new n(t,e)}function o(t){var e={};for(var r in t)t.hasOwnProperty(r)&&(e[r]=t[r]);return e}var i=r(12),s=r(5),a=(r(3)("engine.io-client:socket"),r(32)),c=r(18),p=r(2),h=r(26);t.exports=n,n.priorWebsocketSuccess=!1,s(n.prototype),n.protocol=c.protocol,n.Socket=n,n.Transport=r(17),n.transports=r(12),n.parser=r(18),n.prototype.createTransport=function(t){var e=o(this.query);e.EIO=c.protocol,e.transport=t;var r=this.transportOptions[t]||{};this.id&&(e.sid=this.id);var n=new i[t]({query:e,socket:this,agent:r.agent||this.agent,hostname:r.hostname||this.hostname,port:r.port||this.port,secure:r.secure||this.secure,path:r.path||this.path,forceJSONP:r.forceJSONP||this.forceJSONP,jsonp:r.jsonp||this.jsonp,forceBase64:r.forceBase64||this.forceBase64,enablesXDR:r.enablesXDR||this.enablesXDR,timestampRequests:r.timestampRequests||this.timestampRequests,timestampParam:r.timestampParam||this.timestampParam,policyPort:r.policyPort||this.policyPort,pfx:r.pfx||this.pfx,key:r.key||this.key,passphrase:r.passphrase||this.passphrase,cert:r.cert||this.cert,ca:r.ca||this.ca,ciphers:r.ciphers||this.ciphers,rejectUnauthorized:r.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:r.perMessageDeflate||this.perMessageDeflate,extraHeaders:r.extraHeaders||this.extraHeaders,forceNode:r.forceNode||this.forceNode,localAddress:r.localAddress||this.localAddress,requestTimeout:r.requestTimeout||this.requestTimeout,protocols:r.protocols||void 0,isReactNative:this.isReactNative});return n},n.prototype.open=function(){var t;if(this.rememberUpgrade&&n.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1)t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout(function(){e.emit("error","No transports available")},0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(t){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)},n.prototype.setTransport=function(t){var e=this;this.transport&&this.transport.removeAllListeners(),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},n.prototype.probe=function(t){function e(){if(u.onlyBinaryUpgrades){var t=!this.supportsBinary&&u.transport.supportsBinary;h=h||t}h||(p.send([{type:"ping",data:"probe"}]),p.once("packet",function(t){if(!h)if("pong"===t.type&&"probe"===t.data){if(u.upgrading=!0,u.emit("upgrading",p),!p)return;n.priorWebsocketSuccess="websocket"===p.name,u.transport.pause(function(){h||"closed"!==u.readyState&&(c(),u.setTransport(p),p.send([{type:"upgrade"}]),u.emit("upgrade",p),p=null,u.upgrading=!1,u.flush())})}else{var e=new Error("probe error");e.transport=p.name,u.emit("upgradeError",e)}}))}function r(){h||(h=!0,c(),p.close(),p=null)}function o(t){var e=new Error("probe error: "+t);e.transport=p.name,r(),u.emit("upgradeError",e)}function i(){o("transport closed")}function s(){o("socket closed")}function a(t){p&&t.name!==p.name&&r()}function c(){p.removeListener("open",e),p.removeListener("error",o),p.removeListener("close",i),u.removeListener("close",s),u.removeListener("upgrading",a)}var p=this.createTransport(t,{probe:1}),h=!1,u=this;n.priorWebsocketSuccess=!1,p.once("open",e),p.once("error",o),p.once("close",i),this.once("close",s),this.once("upgrading",a),p.open()},n.prototype.onOpen=function(){if(this.readyState="open",n.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause)for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t])},n.prototype.onPacket=function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(JSON.parse(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}},n.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},n.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!==e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},n.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},n.prototype.ping=function(){var t=this;this.sendPacket("ping",function(){t.emit("ping")})},n.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},n.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},n.prototype.write=n.prototype.send=function(t,e,r){return this.sendPacket("message",t,e,r),this},n.prototype.sendPacket=function(t,e,r,n){if("function"==typeof e&&(n=e,e=void 0),"function"==typeof r&&(n=r,r=null),"closing"!==this.readyState&&"closed"!==this.readyState){r=r||{},r.compress=!1!==r.compress;var o={type:t,data:e,options:r};this.emit("packetCreate",o),this.writeBuffer.push(o),n&&this.once("flush",n),this.flush()}},n.prototype.close=function(){function t(){n.onClose("forced close"),n.transport.close()}function e(){n.removeListener("upgrade",e),n.removeListener("upgradeError",e),t()}function r(){n.once("upgrade",e),n.once("upgradeError",e)}if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var n=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?r():t()}):this.upgrading?r():t()}return this},n.prototype.onError=function(t){n.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},n.prototype.onClose=function(t,e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){var r=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),r.writeBuffer=[],r.prevBufferLen=0}},n.prototype.filterUpgrades=function(t){for(var e=[],r=0,n=t.length;r<n;r++)~a(this.transports,t[r])&&e.push(t[r]);return e}},function(t,e,r){function n(t){var e,r=!1,n=!1,a=!1!==t.jsonp;if("undefined"!=typeof location){var c="https:"===location.protocol,p=location.port;p||(p=c?443:80),r=t.hostname!==location.hostname||p!==t.port,n=t.secure!==c}if(t.xdomain=r,t.xscheme=n,e=new o(t),"open"in e&&!t.forceJSONP)return new i(t);if(!a)throw new Error("JSONP disabled");return new s(t)}var o=r(13),i=r(15),s=r(29),a=r(30);e.polling=n,e.websocket=a},function(t,e,r){var n=r(14);t.exports=function(t){var e=t.xdomain,r=t.xscheme,o=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!e||n))return new XMLHttpRequest}catch(t){}try{if("undefined"!=typeof XDomainRequest&&!r&&o)return new XDomainRequest}catch(t){}if(!e)try{return new(self[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(t){}}},function(t,e){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(e){t.exports=!1}},function(t,e,r){function n(){}function o(t){if(c.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,"undefined"!=typeof location){var e="https:"===location.protocol,r=location.port;r||(r=e?443:80),this.xd="undefined"!=typeof location&&t.hostname!==location.hostname||r!==t.port,this.xs=t.secure!==e}}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort()}var a=r(13),c=r(16),p=r(5),h=r(27);r(3)("engine.io-client:polling-xhr");if(t.exports=o,t.exports.Request=i,h(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new i(t)},o.prototype.doWrite=function(t,e){var r="string"!=typeof t&&void 0!==t,n=this.request({method:"POST",data:t,isBinary:r}),o=this;n.on("success",e),n.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=n},o.prototype.doPoll=function(){var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},p(i.prototype),i.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var e=this.xhr=new a(t),r=this;try{e.open(this.method,this.uri,this.async);try{if(this.extraHeaders){e.setDisableHeaderCheck&&e.setDisableHeaderCheck(!0);for(var n in this.extraHeaders)this.extraHeaders.hasOwnProperty(n)&&e.setRequestHeader(n,this.extraHeaders[n])}}catch(t){}if("POST"===this.method)try{this.isBinary?e.setRequestHeader("Content-type","application/octet-stream"):e.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(t){}try{e.setRequestHeader("Accept","*/*")}catch(t){}"withCredentials"in e&&(e.withCredentials=!0),this.requestTimeout&&(e.timeout=this.requestTimeout),this.hasXDR()?(e.onload=function(){r.onLoad()},e.onerror=function(){r.onError(e.responseText)}):e.onreadystatechange=function(){if(2===e.readyState)try{var t=e.getResponseHeader("Content-Type");r.supportsBinary&&"application/octet-stream"===t&&(e.responseType="arraybuffer")}catch(t){}4===e.readyState&&(200===e.status||1223===e.status?r.onLoad():setTimeout(function(){r.onError(e.status)},0))},e.send(this.data)}catch(t){return void setTimeout(function(){r.onError(t)},0)}"undefined"!=typeof document&&(this.index=i.requestsCount++,i.requests[this.index]=this)},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},i.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},i.prototype.cleanup=function(t){if("undefined"!=typeof this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=n:this.xhr.onreadystatechange=n,t)try{this.xhr.abort()}catch(t){}"undefined"!=typeof document&&delete i.requests[this.index],this.xhr=null}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type")}catch(t){}t="application/octet-stream"===e?this.xhr.response||this.xhr.responseText:this.xhr.responseText}catch(t){this.onError(t)}null!=t&&this.onData(t)},i.prototype.hasXDR=function(){return"undefined"!=typeof XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup()},i.requestsCount=0,i.requests={},"undefined"!=typeof document)if("function"==typeof attachEvent)attachEvent("onunload",s);else if("function"==typeof addEventListener){var u="onpagehide"in self?"pagehide":"unload";addEventListener(u,s,!1)}},function(t,e,r){function n(t){var e=t&&t.forceBase64;p&&!e||(this.supportsBinary=!1),o.call(this,t)}var o=r(17),i=r(26),s=r(18),a=r(27),c=r(28);r(3)("engine.io-client:polling");t.exports=n;var p=function(){var t=r(13),e=new t({xdomain:!1});return null!=e.responseType}();a(n,o),n.prototype.name="polling",n.prototype.doOpen=function(){this.poll()},n.prototype.pause=function(t){function e(){r.readyState="paused",t()}var r=this;if(this.readyState="pausing",this.polling||!this.writable){var n=0;this.polling&&(n++,this.once("pollComplete",function(){--n||e()})),this.writable||(n++,this.once("drain",function(){--n||e()}))}else e()},n.prototype.poll=function(){this.polling=!0,this.doPoll(),this.emit("poll")},n.prototype.onData=function(t){var e=this,r=function(t,r,n){return"opening"===e.readyState&&e.onOpen(),"close"===t.type?(e.onClose(),!1):void e.onPacket(t)};s.decodePayload(t,this.socket.binaryType,r),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState&&this.poll())},n.prototype.doClose=function(){function t(){e.write([{type:"close"}])}var e=this;"open"===this.readyState?t():this.once("open",t)},n.prototype.write=function(t){var e=this;this.writable=!1;var r=function(){e.writable=!0,e.emit("drain")};s.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,r)})},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",r="";!1!==this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||t.sid||(t.b64=1),t=i.encode(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(r=":"+this.port),t.length&&(t="?"+t);var n=this.hostname.indexOf(":")!==-1;return e+"://"+(n?"["+this.hostname+"]":this.hostname)+r+this.path+t}},function(t,e,r){function n(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.isReactNative=t.isReactNative,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress}var o=r(18),i=r(5);t.exports=n,i(n.prototype),n.prototype.onError=function(t,e){var r=new Error(t);return r.type="TransportError",r.description=e,this.emit("error",r),this},n.prototype.open=function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},n.prototype.close=function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},n.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");this.write(t)},n.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},n.prototype.onData=function(t){var e=o.decodePacket(t,this.socket.binaryType);this.onPacket(e)},n.prototype.onPacket=function(t){this.emit("packet",t)},n.prototype.onClose=function(){this.readyState="closed",this.emit("close");
}},function(t,e,r){function n(t,r){var n="b"+e.packets[t.type]+t.data.data;return r(n)}function o(t,r,n){if(!r)return e.encodeBase64Packet(t,n);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=v[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return n(s.buffer)}function i(t,r,n){if(!r)return e.encodeBase64Packet(t,n);var o=new FileReader;return o.onload=function(){e.encodePacket({type:t.type,data:o.result},r,!0,n)},o.readAsArrayBuffer(t.data)}function s(t,r,n){if(!r)return e.encodeBase64Packet(t,n);if(g)return i(t,r,n);var o=new Uint8Array(1);o[0]=v[t.type];var s=new w([o.buffer,t.data]);return n(s)}function a(t){try{t=d.decode(t,{strict:!1})}catch(t){return!1}return t}function c(t,e,r){for(var n=new Array(t.length),o=l(t.length,r),i=function(t,r,o){e(r,function(e,r){n[t]=r,o(e,n)})},s=0;s<t.length;s++)i(s,t[s],o)}var p,h=r(19),u=r(20),f=r(21),l=r(22),d=r(23);"undefined"!=typeof ArrayBuffer&&(p=r(24));var y="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),m="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),g=y||m;e.protocol=3;var v=e.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},b=h(v),k={type:"error",data:"parser error"},w=r(25);e.encodePacket=function(t,e,r,i){"function"==typeof e&&(i=e,e=!1),"function"==typeof r&&(i=r,r=null);var a=void 0===t.data?void 0:t.data.buffer||t.data;if("undefined"!=typeof ArrayBuffer&&a instanceof ArrayBuffer)return o(t,e,i);if("undefined"!=typeof w&&a instanceof w)return s(t,e,i);if(a&&a.base64)return n(t,i);var c=v[t.type];return void 0!==t.data&&(c+=r?d.encode(String(t.data),{strict:!1}):String(t.data)),i(""+c)},e.encodeBase64Packet=function(t,r){var n="b"+e.packets[t.type];if("undefined"!=typeof w&&t.data instanceof w){var o=new FileReader;return o.onload=function(){var t=o.result.split(",")[1];r(n+t)},o.readAsDataURL(t.data)}var i;try{i=String.fromCharCode.apply(null,new Uint8Array(t.data))}catch(e){for(var s=new Uint8Array(t.data),a=new Array(s.length),c=0;c<s.length;c++)a[c]=s[c];i=String.fromCharCode.apply(null,a)}return n+=btoa(i),r(n)},e.decodePacket=function(t,r,n){if(void 0===t)return k;if("string"==typeof t){if("b"===t.charAt(0))return e.decodeBase64Packet(t.substr(1),r);if(n&&(t=a(t),t===!1))return k;var o=t.charAt(0);return Number(o)==o&&b[o]?t.length>1?{type:b[o],data:t.substring(1)}:{type:b[o]}:k}var i=new Uint8Array(t),o=i[0],s=f(t,1);return w&&"blob"===r&&(s=new w([s])),{type:b[o],data:s}},e.decodeBase64Packet=function(t,e){var r=b[t.charAt(0)];if(!p)return{type:r,data:{base64:!0,data:t.substr(1)}};var n=p.decode(t.substr(1));return"blob"===e&&w&&(n=new w([n])),{type:r,data:n}},e.encodePayload=function(t,r,n){function o(t){return t.length+":"+t}function i(t,n){e.encodePacket(t,!!s&&r,!1,function(t){n(null,o(t))})}"function"==typeof r&&(n=r,r=null);var s=u(t);return r&&s?w&&!g?e.encodePayloadAsBlob(t,n):e.encodePayloadAsArrayBuffer(t,n):t.length?void c(t,i,function(t,e){return n(e.join(""))}):n("0:")},e.decodePayload=function(t,r,n){if("string"!=typeof t)return e.decodePayloadAsBinary(t,r,n);"function"==typeof r&&(n=r,r=null);var o;if(""===t)return n(k,0,1);for(var i,s,a="",c=0,p=t.length;c<p;c++){var h=t.charAt(c);if(":"===h){if(""===a||a!=(i=Number(a)))return n(k,0,1);if(s=t.substr(c+1,i),a!=s.length)return n(k,0,1);if(s.length){if(o=e.decodePacket(s,r,!1),k.type===o.type&&k.data===o.data)return n(k,0,1);var u=n(o,c+i,p);if(!1===u)return}c+=i,a=""}else a+=h}return""!==a?n(k,0,1):void 0},e.encodePayloadAsArrayBuffer=function(t,r){function n(t,r){e.encodePacket(t,!0,!0,function(t){return r(null,t)})}return t.length?void c(t,n,function(t,e){var n=e.reduce(function(t,e){var r;return r="string"==typeof e?e.length:e.byteLength,t+r.toString().length+r+2},0),o=new Uint8Array(n),i=0;return e.forEach(function(t){var e="string"==typeof t,r=t;if(e){for(var n=new Uint8Array(t.length),s=0;s<t.length;s++)n[s]=t.charCodeAt(s);r=n.buffer}e?o[i++]=0:o[i++]=1;for(var a=r.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var n=new Uint8Array(r),s=0;s<n.length;s++)o[i++]=n[s]}),r(o.buffer)}):r(new ArrayBuffer(0))},e.encodePayloadAsBlob=function(t,r){function n(t,r){e.encodePacket(t,!0,!0,function(t){var e=new Uint8Array(1);if(e[0]=1,"string"==typeof t){for(var n=new Uint8Array(t.length),o=0;o<t.length;o++)n[o]=t.charCodeAt(o);t=n.buffer,e[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,w){var c=new w([e.buffer,a.buffer,t]);r(null,c)}})}c(t,n,function(t,e){return r(new w(e))})},e.decodePayloadAsBinary=function(t,r,n){"function"==typeof r&&(n=r,r=null);for(var o=t,i=[];o.byteLength>0;){for(var s=new Uint8Array(o),a=0===s[0],c="",p=1;255!==s[p];p++){if(c.length>310)return n(k,0,1);c+=s[p]}o=f(o,2+c.length),c=parseInt(c);var h=f(o,0,c);if(a)try{h=String.fromCharCode.apply(null,new Uint8Array(h))}catch(t){var u=new Uint8Array(h);h="";for(var p=0;p<u.length;p++)h+=String.fromCharCode(u[p])}i.push(h),o=f(o,c)}var l=i.length;i.forEach(function(t,o){n(e.decodePacket(t,r,!0),o,l)})}},function(t,e){t.exports=Object.keys||function(t){var e=[],r=Object.prototype.hasOwnProperty;for(var n in t)r.call(t,n)&&e.push(n);return e}},function(t,e,r){function n(t){if(!t||"object"!=typeof t)return!1;if(o(t)){for(var e=0,r=t.length;e<r;e++)if(n(t[e]))return!0;return!1}if("function"==typeof Buffer&&Buffer.isBuffer&&Buffer.isBuffer(t)||"function"==typeof ArrayBuffer&&t instanceof ArrayBuffer||s&&t instanceof Blob||a&&t instanceof File)return!0;if(t.toJSON&&"function"==typeof t.toJSON&&1===arguments.length)return n(t.toJSON(),!0);for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&n(t[i]))return!0;return!1}var o=r(7),i=Object.prototype.toString,s="function"==typeof Blob||"undefined"!=typeof Blob&&"[object BlobConstructor]"===i.call(Blob),a="function"==typeof File||"undefined"!=typeof File&&"[object FileConstructor]"===i.call(File);t.exports=n},function(t,e){t.exports=function(t,e,r){var n=t.byteLength;if(e=e||0,r=r||n,t.slice)return t.slice(e,r);if(e<0&&(e+=n),r<0&&(r+=n),r>n&&(r=n),e>=n||e>=r||0===n)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(r-e),s=e,a=0;s<r;s++,a++)i[a]=o[s];return i.buffer}},function(t,e){function r(t,e,r){function o(t,n){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(i=!0,e(t),e=r):0!==o.count||i||e(null,n)}var i=!1;return r=r||n,o.count=t,0===t?e():o}function n(){}t.exports=r},function(t,e){function r(t){for(var e,r,n=[],o=0,i=t.length;o<i;)e=t.charCodeAt(o++),e>=55296&&e<=56319&&o<i?(r=t.charCodeAt(o++),56320==(64512&r)?n.push(((1023&e)<<10)+(1023&r)+65536):(n.push(e),o--)):n.push(e);return n}function n(t){for(var e,r=t.length,n=-1,o="";++n<r;)e=t[n],e>65535&&(e-=65536,o+=d(e>>>10&1023|55296),e=56320|1023&e),o+=d(e);return o}function o(t,e){if(t>=55296&&t<=57343){if(e)throw Error("Lone surrogate U+"+t.toString(16).toUpperCase()+" is not a scalar value");return!1}return!0}function i(t,e){return d(t>>e&63|128)}function s(t,e){if(0==(4294967168&t))return d(t);var r="";return 0==(4294965248&t)?r=d(t>>6&31|192):0==(4294901760&t)?(o(t,e)||(t=65533),r=d(t>>12&15|224),r+=i(t,6)):0==(4292870144&t)&&(r=d(t>>18&7|240),r+=i(t,12),r+=i(t,6)),r+=d(63&t|128)}function a(t,e){e=e||{};for(var n,o=!1!==e.strict,i=r(t),a=i.length,c=-1,p="";++c<a;)n=i[c],p+=s(n,o);return p}function c(){if(l>=f)throw Error("Invalid byte index");var t=255&u[l];if(l++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function p(t){var e,r,n,i,s;if(l>f)throw Error("Invalid byte index");if(l==f)return!1;if(e=255&u[l],l++,0==(128&e))return e;if(192==(224&e)){if(r=c(),s=(31&e)<<6|r,s>=128)return s;throw Error("Invalid continuation byte")}if(224==(240&e)){if(r=c(),n=c(),s=(15&e)<<12|r<<6|n,s>=2048)return o(s,t)?s:65533;throw Error("Invalid continuation byte")}if(240==(248&e)&&(r=c(),n=c(),i=c(),s=(7&e)<<18|r<<12|n<<6|i,s>=65536&&s<=1114111))return s;throw Error("Invalid UTF-8 detected")}function h(t,e){e=e||{};var o=!1!==e.strict;u=r(t),f=u.length,l=0;for(var i,s=[];(i=p(o))!==!1;)s.push(i);return n(s)}/*! https://mths.be/utf8js v2.1.2 by @mathias */
var u,f,l,d=String.fromCharCode;t.exports={version:"2.1.2",encode:a,decode:h}},function(t,e){!function(){"use strict";for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r=new Uint8Array(256),n=0;n<t.length;n++)r[t.charCodeAt(n)]=n;e.encode=function(e){var r,n=new Uint8Array(e),o=n.length,i="";for(r=0;r<o;r+=3)i+=t[n[r]>>2],i+=t[(3&n[r])<<4|n[r+1]>>4],i+=t[(15&n[r+1])<<2|n[r+2]>>6],i+=t[63&n[r+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},e.decode=function(t){var e,n,o,i,s,a=.75*t.length,c=t.length,p=0;"="===t[t.length-1]&&(a--,"="===t[t.length-2]&&a--);var h=new ArrayBuffer(a),u=new Uint8Array(h);for(e=0;e<c;e+=4)n=r[t.charCodeAt(e)],o=r[t.charCodeAt(e+1)],i=r[t.charCodeAt(e+2)],s=r[t.charCodeAt(e+3)],u[p++]=n<<2|o>>4,u[p++]=(15&o)<<4|i>>2,u[p++]=(3&i)<<6|63&s;return h}}()},function(t,e){function r(t){return t.map(function(t){if(t.buffer instanceof ArrayBuffer){var e=t.buffer;if(t.byteLength!==e.byteLength){var r=new Uint8Array(t.byteLength);r.set(new Uint8Array(e,t.byteOffset,t.byteLength)),e=r.buffer}return e}return t})}function n(t,e){e=e||{};var n=new i;return r(t).forEach(function(t){n.append(t)}),e.type?n.getBlob(e.type):n.getBlob()}function o(t,e){return new Blob(r(t),e||{})}var i="undefined"!=typeof i?i:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder&&MozBlobBuilder,s=function(){try{var t=new Blob(["hi"]);return 2===t.size}catch(t){return!1}}(),a=s&&function(){try{var t=new Blob([new Uint8Array([1,2])]);return 2===t.size}catch(t){return!1}}(),c=i&&i.prototype.append&&i.prototype.getBlob;"undefined"!=typeof Blob&&(n.prototype=Blob.prototype,o.prototype=Blob.prototype),t.exports=function(){return s?a?Blob:o:c?n:void 0}()},function(t,e){e.encode=function(t){var e="";for(var r in t)t.hasOwnProperty(r)&&(e.length&&(e+="&"),e+=encodeURIComponent(r)+"="+encodeURIComponent(t[r]));return e},e.decode=function(t){for(var e={},r=t.split("&"),n=0,o=r.length;n<o;n++){var i=r[n].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},function(t,e){t.exports=function(t,e){var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}},function(t,e){"use strict";function r(t){var e="";do e=s[t%a]+e,t=Math.floor(t/a);while(t>0);return e}function n(t){var e=0;for(h=0;h<t.length;h++)e=e*a+c[t.charAt(h)];return e}function o(){var t=r(+new Date);return t!==i?(p=0,i=t):t+"."+r(p++)}for(var i,s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),a=64,c={},p=0,h=0;h<a;h++)c[s[h]]=h;o.encode=r,o.decode=n,t.exports=o},function(t,e,r){(function(e){function n(){}function o(){return"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof e?e:{}}function i(t){if(s.call(this,t),this.query=this.query||{},!c){var e=o();c=e.___eio=e.___eio||[]}this.index=c.length;var r=this;c.push(function(t){r.onData(t)}),this.query.j=this.index,"function"==typeof addEventListener&&addEventListener("beforeunload",function(){r.script&&(r.script.onerror=n)},!1)}var s=r(16),a=r(27);t.exports=i;var c,p=/\n/g,h=/\\n/g;a(i,s),i.prototype.supportsBinary=!1,i.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),s.prototype.doClose.call(this)},i.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var r=document.getElementsByTagName("script")[0];r?r.parentNode.insertBefore(e,r):(document.head||document.body).appendChild(e),this.script=e;var n="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);n&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)},100)},i.prototype.doWrite=function(t,e){function r(){n(),e()}function n(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var t='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(t)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),c=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=c,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),n(),t=t.replace(h,"\\\n"),this.area.value=t.replace(p,"\\n");try{this.form.submit()}catch(t){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===o.iframe.readyState&&r()}:this.iframe.onload=r}}).call(e,function(){return this}())},function(t,e,r){function n(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,this.usingBrowserWebSocket=o&&!t.forceNode,this.protocols=t.protocols,this.usingBrowserWebSocket||(u=i),s.call(this,t)}var o,i,s=r(17),a=r(18),c=r(26),p=r(27),h=r(28);r(3)("engine.io-client:websocket");if("undefined"==typeof self)try{i=r(31)}catch(t){}else o=self.WebSocket||self.MozWebSocket;var u=o||i;t.exports=n,p(n,s),n.prototype.name="websocket",n.prototype.supportsBinary=!0,n.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=this.protocols,r={agent:this.agent,perMessageDeflate:this.perMessageDeflate};r.pfx=this.pfx,r.key=this.key,r.passphrase=this.passphrase,r.cert=this.cert,r.ca=this.ca,r.ciphers=this.ciphers,r.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(r.headers=this.extraHeaders),this.localAddress&&(r.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket&&!this.isReactNative?e?new u(t,e):new u(t):new u(t,e,r)}catch(t){return this.emit("error",t)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},n.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},n.prototype.write=function(t){function e(){r.emit("flush"),setTimeout(function(){r.writable=!0,r.emit("drain")},0)}var r=this;this.writable=!1;for(var n=t.length,o=0,i=n;o<i;o++)!function(t){a.encodePacket(t,r.supportsBinary,function(o){if(!r.usingBrowserWebSocket){var i={};if(t.options&&(i.compress=t.options.compress),r.perMessageDeflate){var s="string"==typeof o?Buffer.byteLength(o):o.length;s<r.perMessageDeflate.threshold&&(i.compress=!1)}}try{r.usingBrowserWebSocket?r.ws.send(o):r.ws.send(o,i)}catch(t){}--n||e()})}(t[o])},n.prototype.onClose=function(){s.prototype.onClose.call(this)},n.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close()},n.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",r="";this.port&&("wss"===e&&443!==Number(this.port)||"ws"===e&&80!==Number(this.port))&&(r=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=h()),this.supportsBinary||(t.b64=1),t=c.encode(t),t.length&&(t="?"+t);var n=this.hostname.indexOf(":")!==-1;return e+"://"+(n?"["+this.hostname+"]":this.hostname)+r+this.path+t},n.prototype.check=function(){return!(!u||"__initialize"in u&&this.name===n.prototype.name)}},function(t,e){},function(t,e){var r=[].indexOf;t.exports=function(t,e){if(r)return t.indexOf(e);for(var n=0;n<t.length;++n)if(t[n]===e)return n;return-1}},function(t,e,r){"use strict";function n(t,e,r){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,this.flags={},r&&r.query&&(this.query=r.query),this.io.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=r(4),s=r(5),a=r(34),c=r(35),p=r(36),h=(r(3)("socket.io-client:socket"),r(26)),u=r(20);t.exports=e=n;var f={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},l=s.prototype.emit;s(n.prototype),n.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[c(t,"open",p(this,"onopen")),c(t,"packet",p(this,"onpacket")),c(t,"close",p(this,"onclose"))]}},n.prototype.open=n.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting"),this)},n.prototype.send=function(){var t=a(arguments);return t.unshift("message"),this.emit.apply(this,t),this},n.prototype.emit=function(t){if(f.hasOwnProperty(t))return l.apply(this,arguments),this;var e=a(arguments),r={type:(void 0!==this.flags.binary?this.flags.binary:u(e))?i.BINARY_EVENT:i.EVENT,data:e};return r.options={},r.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(this.acks[this.ids]=e.pop(),r.id=this.ids++),this.connected?this.packet(r):this.sendBuffer.push(r),this.flags={},this},n.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},n.prototype.onopen=function(){if("/"!==this.nsp)if(this.query){var t="object"===o(this.query)?h.encode(this.query):this.query;this.packet({type:i.CONNECT,query:t})}else this.packet({type:i.CONNECT})},n.prototype.onclose=function(t){this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},n.prototype.onpacket=function(t){var e=t.nsp===this.nsp,r=t.type===i.ERROR&&"/"===t.nsp;if(e||r)switch(t.type){case i.CONNECT:this.onconnect();break;case i.EVENT:this.onevent(t);break;case i.BINARY_EVENT:this.onevent(t);break;case i.ACK:this.onack(t);break;case i.BINARY_ACK:this.onack(t);break;case i.DISCONNECT:this.ondisconnect();break;case i.ERROR:this.emit("error",t.data)}},n.prototype.onevent=function(t){var e=t.data||[];null!=t.id&&e.push(this.ack(t.id)),this.connected?l.apply(this,e):this.receiveBuffer.push(e)},n.prototype.ack=function(t){var e=this,r=!1;return function(){if(!r){r=!0;var n=a(arguments);e.packet({type:u(n)?i.BINARY_ACK:i.ACK,id:t,data:n})}}},n.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e&&(e.apply(this,t.data),delete this.acks[t.id])},n.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},n.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)l.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},n.prototype.ondisconnect=function(){this.destroy(),this.onclose("io server disconnect")},n.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},n.prototype.close=n.prototype.disconnect=function(){return this.connected&&this.packet({type:i.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},n.prototype.compress=function(t){return this.flags.compress=t,this},n.prototype.binary=function(t){return this.flags.binary=t,this}},function(t,e){function r(t,e){var r=[];e=e||0;for(var n=e||0;n<t.length;n++)r[n-e]=t[n];return r}t.exports=r},function(t,e){"use strict";function r(t,e,r){return t.on(e,r),{destroy:function(){t.removeListener(e,r)}}}t.exports=r},function(t,e){var r=[].slice;t.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var n=r.call(arguments,2);return function(){return e.apply(t,n.concat(r.call(arguments)))}}},function(t,e){function r(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=r,r.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),r=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-r:t+r}return 0|Math.min(t,this.max)},r.prototype.reset=function(){this.attempts=0},r.prototype.setMin=function(t){this.ms=t},r.prototype.setMax=function(t){this.max=t},r.prototype.setJitter=function(t){this.jitter=t}}])});
//# sourceMappingURL=socket.io.slim.js.map
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../buffer/index.js */ "./node_modules/buffer/index.js").Buffer))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./www/bmr/engine/src/index.js":
/*!*************************************!*\
  !*** ./www/bmr/engine/src/index.js ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_styl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.styl */ "./www/bmr/engine/src/style.styl");
/* harmony import */ var _style_styl__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_styl__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var socket_io_client_dist_socket_io_slim__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! socket.io-client/dist/socket.io.slim */ "./node_modules/socket.io-client/dist/socket.io.slim.js");
/* harmony import */ var socket_io_client_dist_socket_io_slim__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(socket_io_client_dist_socket_io_slim__WEBPACK_IMPORTED_MODULE_1__);
//import css from './style.css';


//console.log(css, styl.toString());

(function(){
	"use strict"
	const socketUrl = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.4/socket.io.min.js'

	const App = {
		isConnected: false,
		metrics: {},
		accessToken: '',
		pendingSearch: [],
		socket: {},
		searchResult: {},
		noResult: [],
		requestedSongs: [],
		appName: '1030',
		vipMode: {
			limit: 0,
			uuid: 0,
			insta: '',
			club: ''
		},
		addScripts:  async function(array){
			var promises = [];
			var hookScripts = function(url, src) {
				return new Promise(function(resolve,reject){
					var s = document.createElement("script");
					s.type = "text/javascript";
					s.setAttribute('async','false')
					s.onload = ()=>{resolve(url)};
					s.onerror = ()=>{reject(`${url} did not load`)};
					s.src = url || null;
					s.innerHTML = src || null;
					document.getElementsByTagName("body")[0].appendChild(s);
				});
				
			};
			array.forEach(function(item){
				var exist = document.querySelector(`script[src="${item}"]`);
				if(!exist){
					promises.push(hookScripts(item));
				}
				
			});
			return Promise.all(promises)
		},
		isOnline: async function(){
			const url = window.location.origin
			try{
				const request = await fetch('https://styleminions.co/api/radio',{
				mode: 'no-cors',	
				params:{url}
				})
			}catch(e){
				console.log(new Error(e))
			}finally {
				return true
			}
			//return true
			
		},
		launchApp: async function(){
			const isOnline = await this.isOnline()
			if (isOnline) {
				try {
					//const boom = await this.addScripts([socketUrl])
					if(true){
						console.log('socket.io in in the DOM')
						this.socket = socket_io_client_dist_socket_io_slim__WEBPACK_IMPORTED_MODULE_1___default()('https://blessmyrequest.com')
						// this.socket = io('http://localhost:8000')
						this.setUpSocket()

						// let hmm = '';
						// for(let x = 0; x<7; x++){
						// 	const payload = {song:`ida song${x}`,artist:`ida${x}`,image:'https://avatars0.githubusercontent.com/u/28629414?s=460&v=4',index:x}
						// 	hmm += this.resultHtml(payload)
						// }
						const headElement = document.head
						const bodyElement = document.body
						const elem = document.createElement('div')
						const styleElem = document.createElement('style')
						elem.classList.add('bmr-container')
						this.render(_style_styl__WEBPACK_IMPORTED_MODULE_0___default.a.toString(),styleElem)
						this.render(this.appHtml(),elem)
						headElement.appendChild(styleElem)
						bodyElement.appendChild(elem)
					}
				} catch (error) {
					console.log(error)
				}
			}
		},
		render: function (template, node) {
			if (!node) return
			node.innerHTML = template
		},	
		setUpSocket: function() {
			this.socket.on('connect', (data)=>{
				this.isConnected = true
				this.socket.emit('audience',{appName:this.appName,id:this.socket.id,task:'population'});
				console.log(data, 'connected to server');
			});
			this.socket.on('disconnect', (data)=>{
					this.isConnected = false
			});
			this.socket.on('reconnect', (data)=>{
					this.isConnected = true
			});
			this.socket.on('sendMetrics',(data)=>{
					//console.log(data,'metric data');
					if(data.appName === this.appName && 'task' in data && data.task === 'request'){
							this.metrics = data;
					}
			});
			this.socket.on('newToken',(data)=>{
					this.accessToken = data
					if(this.pendingSearch.length > 0){
							this.searchTrack()
					}
			});
		},
		toggleAppDisplay: function(){
			const doc = document.documentElement;
			const circle = doc.style.getPropertyValue('--circle-bmr')
			//const requestContainer = doc.style.getPropertyValue('--request-container')
			if(circle === 'flex' || circle === ''){
				doc.style.setProperty('--circle-bmr','none')
				doc.style.setProperty('--request-container','flex')
			}else{
				doc.style.setProperty('--circle-bmr','flex')
				doc.style.setProperty('--request-container','none')
			}

		},
		appHtml(){
			return `
				<div class="circle-bmr" onclick="bmr.toggleAppDisplay()">
					<span>song</span>
					<span>request</span>
				</div>
				<div class="request-container">
					<div class="search-container">
						<div class="close" onclick="bmr.toggleAppDisplay()">
							<i class="bmr-icons tablet-desktop">keyboard_arrow_down</i>
						</div>
						<div class="search-component">
							<input type="text" name="search" onkeyup="bmr.searchEnter(event)" 
								placeholder="Search tracks" autocomplete="off">
							<div class="btn-bmr" onclick="bmr.searchTrack()"><i class="bmr-icons">search</i></div>
						</div>
					</div>
					<div class="result-container"></div>
				</div>            
			`
		},
		resultHtml: (data) => {
			const alreadyRequested = data.alreadyRequested ? 'requested' : ''
			return `
				<div class="result z-depth-3 result-${data.id} ${alreadyRequested}">
					<div class="image">
						<img src="${data.image}" alt="image">
						<span class="btn-bmr btn-small-bmr lead-fab"><i class="bmr-icons">check</i></span>
					</div>					
					<div class="result-details">
						<span>${data.song}</span>
						<span>${data.artist}</span>
					</div>
					<div class="button-bmr" onclick="bmr.sendRequest('${data.id}')">
						<div class="btn-bmr">
							<i class="bmr-icons">send</i>
						</div>
					</div>						     
				</div>
			`
		},
		noResultHtml: () => {
			return `
					<div class="z-depth-3 result result-none">
						<span>Sorry!! Can't find that song.</span>
						<span>Search for another song.</span>
					</div>
				`
		},
		renderData(obj, template, node){
			let html = ''
			obj.forEach(item => html += template(item))
			this.render(html, node)
		},
		safe(value){
			if (value === '' || value === undefined || value === false){
				return false
			}
			return true
		},
		async searchTrack(){
			this.searchInput = document.querySelector('.bmr-container input').value
			if(this.safe(this.searchInput)){
					this.loader = true
					let token = this.accessToken
					let query = encodeURIComponent(this.searchInput)
					let type = 'track'
					const resultContainer = document.querySelector('.result-container')
					console.log(this.searchInput)

					try {
						const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=${type}&access_token=${token}`)
						const data = response.status === 200 ? await response.json() : 'fail'
						if(data !== 'fail'){
							this.searchResult = data.tracks.items.map((item)=>{
									let obj = {}
									obj.image = item.album.images[1].url
									obj.song = item.name
									obj.artist = item.artists.map((item)=> item.name).join(', ')
									obj.id = item.id
									obj.alreadyRequested =  
										this.requestedSongs.find((i) => i === item.id) !== undefined

									return obj
							})
							this.noResult = (this.searchResult.length === 0) ? true : false
							this.pendingSearch = []
							if(this.noResult){
								this.render(this.noResultHtml(),resultContainer)
							}else{
								this.renderData(this.searchResult,this.resultHtml,resultContainer)
							}							
							this.loader = false;
						}else if(data === 'fail'){
							this.pendingSearch.push(this.searchInput)
							this.socket.emit('newTokenPlease')
						}
					} catch (error) {
							console.error(new Error(error))
					} finally {
							//let payload = {trackTask:'search',search:this.searchInput, timestamp:moment().toISOString(),domain:location.host}
							//this.trackAction(payload)
					}
			}
		},
		searchEnter(event){
			try {
				const keyCode =  event.which || event.keyCode;
				if(keyCode === 13){
					this.searchTrack()
					event.target.blur()
				}
			} catch (error) {
				console.warn(error)
			}			
		},
		sendRequest(id){
			if(this.safe(id) && this.isConnected === true){
					const payload = this.searchResult.find((item) => item.id === id)
					const notRequested = this.requestedSongs.find((item) => item === id) === undefined
					if(this.safe(payload) && notRequested){
						payload.timestamp = new Date().toISOString()
						console.log(payload)
						this.socket.emit('audience',{
							appName:this.appName,
							id:this.socket.id,
							task:'request',
							song:payload,
							vip: this.vipMode,
						})
						try {
							document.querySelector(`.result-${id}`).classList.add('requested')
						} catch (error) {
							console.warn(error)
						}
						this.requestedSongs.push(payload.id)
						payload.trackTask = 'request'
						payload.domain = location.host
						//this.trackAction(payload)
					}					
			}
		}
	};

	//Lock App methods to be immutable
	Object.keys(App).map((item) => typeof App[item] === 'function' ? Object.defineProperty(App, item, { configurable: false, writable: false }) : null)
	window.bmr = App
	App.launchApp()
})();

/***/ }),

/***/ "./www/bmr/engine/src/style.styl":
/*!***************************************!*\
  !*** ./www/bmr/engine/src/style.styl ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js")(false);
// Module
exports.push([module.i, ":root {\n  --circle-bmr: flex;\n  --request-container: none;\n  --main-bmr: linear-gradient(120deg, #92fe9d 0%, #00c9ff 107%);\n  --dark-theme-bmr: #252525;\n}\n.bmr-container {\n  position: fixed;\n  bottom: 0;\n  right: 0;\n  width: auto;\n  height: auto;\n  z-index: 100000;\n/* Mobile Responsive style */\n/* Tablet Responsive style */\n/* Desktop Responsive style */\n/* fallback */\n}\n.bmr-container .circle-bmr {\n  width: 100px;\n  height: 100px;\n  background: var(--main-bmr);\n  border-radius: 50%;\n  position: absolute;\n  bottom: 20px;\n  right: 5%;\n  display: var(--circle-bmr);\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  color: #fff;\n  margin: 0 10px;\n}\n.bmr-container .request-container {\n  width: 100vw;\n  height: 100vh;\n  display: var(--request-container);\n  flex-direction: column;\n  animation: slideUp 0.2s ease-in;\n}\n.bmr-container .search-container {\n  order: 1;\n  flex-basis: 40%;\n  display: flex;\n  flex-direction: column;\n  background-color: rgba(0,0,0,0.639);\n}\n.bmr-container .result-container {\n  order: 2;\n  flex-basis: 60%;\n  background-color: var(--dark-theme-bmr);\n  overflow-y: scroll;\n  scroll-behavior: smooth;\n  -webkit-overflow-scrolling: touch;\n}\n.bmr-container .result {\n  display: flex;\n  margin: 10px 0;\n  height: 75px;\n  align-items: center;\n  background: var(--dark-theme-bmr);\n  animation: slideUp 0.5s linear;\n}\n.bmr-container .result.result-none {\n  flex-direction: column;\n  justify-content: center;\n}\n.bmr-container img {\n  width: 70px;\n}\n.bmr-container .image,\n.bmr-container .button-bmr,\n.bmr-container .result-details {\n  padding: 0 0.75rem;\n}\n.bmr-container .result .image {\n  flex-basis: 30%;\n  position: relative;\n}\n.bmr-container .result .button-bmr {\n  flex-basis: 30%;\n  align-self: center;\n}\n.bmr-container .result .button-bmr .btn-bmr {\n  margin: 0 auto;\n}\n.bmr-container .result-details {\n  flex-basis: 60%;\n  display: flex;\n  flex-direction: column;\n  font-size: 14px;\n}\n.bmr-container .result-details span,\n.bmr-container .button-bmr .btn-bmr {\n  align-self: center;\n  text-align: center;\n}\n.bmr-container .result-details span:nth-child(1),\n.bmr-container .result-none span,\n.bmr-container .btn-bmr {\n  color: #fff;\n}\n.bmr-container .result-details span:nth-child(2) {\n  color: #9e9e9e;\n}\n.bmr-container .btn-bmr {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: var(--main-bmr);\n}\n.bmr-container input[type=text] {\n  background-color: transparent;\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  border-radius: 0;\n  outline: none;\n  height: 3rem;\n  width: 100%;\n  font-size: 16px;\n  margin: 0 0 8px 0;\n  padding: 0;\n  flex-basis: 70%;\n}\n.bmr-container input[type=text]::placeholder {\n  color: #959595;\n}\n.bmr-container input[type=text]:focus {\n  border-bottom: 1px solid #13d0f2;\n  box-shadow: 0 1px 0 0 #13d0f2;\n}\n.bmr-container .z-depth-3 {\n  box-shadow: 0 8px 17px 2px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2);\n}\n.bmr-container .search-component {\n  display: flex;\n  flex-basis: 50%;\n  background-color: #fff;\n  padding: 0% 5%;\n  align-items: center;\n  justify-content: space-evenly;\n}\n.bmr-container .close {\n  flex-basis: 50%;\n  background-color: transparent;\n  display: flex;\n  justify-content: center;\n}\n.bmr-container .close i {\n  font-size: 66px;\n  color: #fff;\n}\n.bmr-container .lead-fab {\n  bottom: -3px;\n  position: absolute;\n  right: 7px;\n}\n.bmr-container .btn-bmr.btn-small-bmr {\n  width: 27px;\n  height: 27px;\n}\n.bmr-container .image .btn-bmr {\n  display: none;\n}\n.bmr-container .requested .image .btn-bmr {\n  display: flex;\n  align-items: center;\n}\n.bmr-container .requested .button-bmr .btn-bmr {\n  opacity: 0.2;\n}\n@media only screen and (max-width: 749px) {\n  .bmr-container .tablet-desktop {\n    display: none !important;\n  }\n}\n@media only screen and (min-width: 750px) {\n  .bmr-container .request-container {\n    width: 56vw;\n    height: 60vh;\n  }\n  .bmr-container .mobile,\n  .bmr-container .desktop {\n    display: none !important;\n  }\n}\n@media only screen and (min-width: 1280px) {\n  .bmr-container .request-container {\n    width: 35vw;\n    height: 65vh;\n  }\n  .bmr-container .mobile,\n  .bmr-container .tablet {\n    display: none !important;\n  }\n}\n@font-face {\n  font-family: 'Material Icons';\n  font-style: normal;\n  font-weight: 400;\n  src: url(\"https://fonts.gstatic.com/s/materialicons/v43/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2\") format('woff2');\n}\n.bmr-container .bmr-icons {\n  font-family: 'Material Icons';\n  font-weight: normal;\n  font-style: normal;\n  font-size: 24px;\n  line-height: 1;\n  letter-spacing: normal;\n  text-transform: none;\n  display: inline-block;\n  white-space: nowrap;\n  word-wrap: normal;\n  direction: ltr;\n  -webkit-font-feature-settings: 'liga';\n  -webkit-font-smoothing: antialiased;\n}\n@-moz-keyframes slideUp {\n  0% {\n    transform: translate3d(0, 100%, 0);\n  }\n  100% {\n    transform: none;\n  }\n}\n@-webkit-keyframes slideUp {\n  0% {\n    transform: translate3d(0, 100%, 0);\n  }\n  100% {\n    transform: none;\n  }\n}\n@-o-keyframes slideUp {\n  0% {\n    transform: translate3d(0, 100%, 0);\n  }\n  100% {\n    transform: none;\n  }\n}\n@keyframes slideUp {\n  0% {\n    transform: translate3d(0, 100%, 0);\n  }\n  100% {\n    transform: none;\n  }\n}\n", ""]);



/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2lzYXJyYXkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc29ja2V0LmlvLWNsaWVudC9kaXN0L3NvY2tldC5pby5zbGltLmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vd3d3L2Jtci9lbmdpbmUvc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3d3dy9ibXIvZW5naW5lL3NyYy9zdHlsZS5zdHlsIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFD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QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixVQUFVO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUEsdUNBQXVDLFNBQVM7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxpQkFBaUI7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxhQUFhLGlCQUFpQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFNBQVM7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsRUFBRTtBQUNsRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZUFBZTtBQUN2QztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSx3QkFBd0IsUUFBUTtBQUNoQztBQUNBLHFCQUFxQixlQUFlO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixZQUFZO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUIsU0FBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGtCQUFrQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsbUJBQW1CLGNBQWM7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RCxPQUFPO0FBQzlEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQsT0FBTztBQUM5RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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QWlCLHVCQUF1QixlQUFlLEdBQUcseUNBQXlDLGdCQUFnQixpQkFBaUIsR0FBRyxrQ0FBa0Msa0JBQWtCLEdBQUcsNkNBQTZDLGtCQUFrQix3QkFBd0IsR0FBRyxrREFBa0QsaUJBQWlCLEdBQUcsNkNBQTZDLG9DQUFvQywrQkFBK0IsS0FBSyxHQUFHLDZDQUE2Qyx1Q0FBdUMsa0JBQWtCLG1CQUFtQixLQUFLLHdEQUF3RCwrQkFBK0IsS0FBSyxHQUFHLDhDQUE4Qyx1Q0FBdUMsa0JBQWtCLG1CQUFtQixLQUFLLHVEQUF1RCwrQkFBK0IsS0FBSyxHQUFHLGNBQWMsa0NBQWtDLHVCQUF1QixxQkFBcUIsbUhBQW1ILEdBQUcsNkJBQTZCLGtDQUFrQyx3QkFBd0IsdUJBQXVCLG9CQUFvQixtQkFBbUIsMkJBQTJCLHlCQUF5QiwwQkFBMEIsd0JBQXdCLHNCQUFzQixtQkFBbUIsMENBQTBDLHdDQUF3QyxHQUFHLDJCQUEyQixRQUFRLHlDQUF5QyxLQUFLLFVBQVUsc0JBQXNCLEtBQUssR0FBRyw4QkFBOEIsUUFBUSx5Q0FBeUMsS0FBSyxVQUFVLHNCQUFzQixLQUFLLEdBQUcseUJBQXlCLFFBQVEseUNBQXlDLEtBQUssVUFBVSxzQkFBc0IsS0FBSyxHQUFHLHNCQUFzQixRQUFRLHlDQUF5QyxLQUFLLFVBQVUsc0JBQXNCLEtBQUssR0FBRyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3d3dy9ibXIvZW5naW5lL3NyYy9pbmRleC5qc1wiKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxudmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbmZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG59XG5cbi8vIFN1cHBvcnQgZGVjb2RpbmcgVVJMLXNhZmUgYmFzZTY0IHN0cmluZ3MsIGFzIE5vZGUuanMgZG9lcy5cbi8vIFNlZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0I1VSTF9hcHBsaWNhdGlvbnNcbnJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxucmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG5cbmZ1bmN0aW9uIGdldExlbnMgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyBUcmltIG9mZiBleHRyYSBieXRlcyBhZnRlciBwbGFjZWhvbGRlciBieXRlcyBhcmUgZm91bmRcbiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYmVhdGdhbW1pdC9iYXNlNjQtanMvaXNzdWVzLzQyXG4gIHZhciB2YWxpZExlbiA9IGI2NC5pbmRleE9mKCc9JylcbiAgaWYgKHZhbGlkTGVuID09PSAtMSkgdmFsaWRMZW4gPSBsZW5cblxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gdmFsaWRMZW4gPT09IGxlblxuICAgID8gMFxuICAgIDogNCAtICh2YWxpZExlbiAlIDQpXG5cbiAgcmV0dXJuIFt2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuXVxufVxuXG4vLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKGI2NCkge1xuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiBfYnl0ZUxlbmd0aCAoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSB7XG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuXG4gIHZhciBhcnIgPSBuZXcgQXJyKF9ieXRlTGVuZ3RoKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikpXG5cbiAgdmFyIGN1ckJ5dGUgPSAwXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICB2YXIgbGVuID0gcGxhY2VIb2xkZXJzTGVuID4gMFxuICAgID8gdmFsaWRMZW4gLSA0XG4gICAgOiB2YWxpZExlblxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTgpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCAxMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildIDw8IDYpIHxcbiAgICAgIHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMyldXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDE2KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAyKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA+PiA0KVxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMSkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxMCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDQpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA+PiAyKVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBhcnJcbn1cblxuZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcbiAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiAxMiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDYgJiAweDNGXSArXG4gICAgbG9va3VwW251bSAmIDB4M0ZdXG59XG5cbmZ1bmN0aW9uIGVuY29kZUNodW5rICh1aW50OCwgc3RhcnQsIGVuZCkge1xuICB2YXIgdG1wXG4gIHZhciBvdXRwdXQgPSBbXVxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkgKz0gMykge1xuICAgIHRtcCA9XG4gICAgICAoKHVpbnQ4W2ldIDw8IDE2KSAmIDB4RkYwMDAwKSArXG4gICAgICAoKHVpbnQ4W2kgKyAxXSA8PCA4KSAmIDB4RkYwMCkgK1xuICAgICAgKHVpbnQ4W2kgKyAyXSAmIDB4RkYpXG4gICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpXG4gIH1cbiAgcmV0dXJuIG91dHB1dC5qb2luKCcnKVxufVxuXG5mdW5jdGlvbiBmcm9tQnl0ZUFycmF5ICh1aW50OCkge1xuICB2YXIgdG1wXG4gIHZhciBsZW4gPSB1aW50OC5sZW5ndGhcbiAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4gJSAzIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG4gIHZhciBwYXJ0cyA9IFtdXG4gIHZhciBtYXhDaHVua0xlbmd0aCA9IDE2MzgzIC8vIG11c3QgYmUgbXVsdGlwbGUgb2YgM1xuXG4gIC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbjIgPSBsZW4gLSBleHRyYUJ5dGVzOyBpIDwgbGVuMjsgaSArPSBtYXhDaHVua0xlbmd0aCkge1xuICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsoXG4gICAgICB1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpXG4gICAgKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDJdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl0gK1xuICAgICAgJz09J1xuICAgIClcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAxMF0gK1xuICAgICAgbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdICtcbiAgICAgICc9J1xuICAgIClcbiAgfVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cblxuJ3VzZSBzdHJpY3QnXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnaXNhcnJheScpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBTbG93QnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogRHVlIHRvIHZhcmlvdXMgYnJvd3NlciBidWdzLCBzb21ldGltZXMgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiB3aWxsIGJlIHVzZWQgZXZlblxuICogd2hlbiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0eXBlZCBhcnJheXMuXG4gKlxuICogTm90ZTpcbiAqXG4gKiAgIC0gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLFxuICogICAgIFNlZTogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4LlxuICpcbiAqICAgLSBDaHJvbWUgOS0xMCBpcyBtaXNzaW5nIHRoZSBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uLlxuICpcbiAqICAgLSBJRTEwIGhhcyBhIGJyb2tlbiBgVHlwZWRBcnJheS5wcm90b3R5cGUuc3ViYXJyYXlgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYXJyYXlzIG9mXG4gKiAgICAgaW5jb3JyZWN0IGxlbmd0aCBpbiBzb21lIHNpdHVhdGlvbnMuXG5cbiAqIFdlIGRldGVjdCB0aGVzZSBidWdneSBicm93c2VycyBhbmQgc2V0IGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGAgdG8gYGZhbHNlYCBzbyB0aGV5XG4gKiBnZXQgdGhlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggaXMgc2xvd2VyIGJ1dCBiZWhhdmVzIGNvcnJlY3RseS5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSBnbG9iYWwuVFlQRURfQVJSQVlfU1VQUE9SVCAhPT0gdW5kZWZpbmVkXG4gID8gZ2xvYmFsLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgOiB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbi8qXG4gKiBFeHBvcnQga01heExlbmd0aCBhZnRlciB0eXBlZCBhcnJheSBzdXBwb3J0IGlzIGRldGVybWluZWQuXG4gKi9cbmV4cG9ydHMua01heExlbmd0aCA9IGtNYXhMZW5ndGgoKVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgYXJyLl9fcHJvdG9fXyA9IHtfX3Byb3RvX186IFVpbnQ4QXJyYXkucHJvdG90eXBlLCBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH19XG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDIgJiYgLy8gdHlwZWQgYXJyYXkgaW5zdGFuY2VzIGNhbiBiZSBhdWdtZW50ZWRcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAmJiAvLyBjaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgICAgICAgYXJyLnN1YmFycmF5KDEsIDEpLmJ5dGVMZW5ndGggPT09IDAgLy8gaWUxMCBoYXMgYnJva2VuIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbmZ1bmN0aW9uIGtNYXhMZW5ndGggKCkge1xuICByZXR1cm4gQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRcbiAgICA/IDB4N2ZmZmZmZmZcbiAgICA6IDB4M2ZmZmZmZmZcbn1cblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyICh0aGF0LCBsZW5ndGgpIHtcbiAgaWYgKGtNYXhMZW5ndGgoKSA8IGxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHR5cGVkIGFycmF5IGxlbmd0aCcpXG4gIH1cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgICB0aGF0Ll9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIGFuIG9iamVjdCBpbnN0YW5jZSBvZiB0aGUgQnVmZmVyIGNsYXNzXG4gICAgaWYgKHRoYXQgPT09IG51bGwpIHtcbiAgICAgIHRoYXQgPSBuZXcgQnVmZmVyKGxlbmd0aClcbiAgICB9XG4gICAgdGhhdC5sZW5ndGggPSBsZW5ndGhcbiAgfVxuXG4gIHJldHVybiB0aGF0XG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUICYmICEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIENvbW1vbiBjYXNlLlxuICBpZiAodHlwZW9mIGFyZyA9PT0gJ251bWJlcicpIHtcbiAgICBpZiAodHlwZW9mIGVuY29kaW5nT3JPZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdJZiBlbmNvZGluZyBpcyBzcGVjaWZpZWQgdGhlbiB0aGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIHN0cmluZydcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKHRoaXMsIGFyZylcbiAgfVxuICByZXR1cm4gZnJvbSh0aGlzLCBhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbi8vIFRPRE86IExlZ2FjeSwgbm90IG5lZWRlZCBhbnltb3JlLiBSZW1vdmUgaW4gbmV4dCBtYWpvciB2ZXJzaW9uLlxuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX19wcm90b19fID0gQnVmZmVyLnByb3RvdHlwZVxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIGZyb20gKHRoYXQsIHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGZyb21TdHJpbmcodGhhdCwgdmFsdWUsIGVuY29kaW5nT3JPZmZzZXQpXG4gIH1cblxuICByZXR1cm4gZnJvbU9iamVjdCh0aGF0LCB2YWx1ZSlcbn1cblxuLyoqXG4gKiBGdW5jdGlvbmFsbHkgZXF1aXZhbGVudCB0byBCdWZmZXIoYXJnLCBlbmNvZGluZykgYnV0IHRocm93cyBhIFR5cGVFcnJvclxuICogaWYgdmFsdWUgaXMgYSBudW1iZXIuXG4gKiBCdWZmZXIuZnJvbShzdHJbLCBlbmNvZGluZ10pXG4gKiBCdWZmZXIuZnJvbShhcnJheSlcbiAqIEJ1ZmZlci5mcm9tKGJ1ZmZlcilcbiAqIEJ1ZmZlci5mcm9tKGFycmF5QnVmZmVyWywgYnl0ZU9mZnNldFssIGxlbmd0aF1dKVxuICoqL1xuQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gZnJvbShudWxsLCB2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5pZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgQnVmZmVyLnByb3RvdHlwZS5fX3Byb3RvX18gPSBVaW50OEFycmF5LnByb3RvdHlwZVxuICBCdWZmZXIuX19wcm90b19fID0gVWludDhBcnJheVxuICBpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnNwZWNpZXMgJiZcbiAgICAgIEJ1ZmZlcltTeW1ib2wuc3BlY2llc10gPT09IEJ1ZmZlcikge1xuICAgIC8vIEZpeCBzdWJhcnJheSgpIGluIEVTMjAxNi4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9wdWxsLzk3XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlciwgU3ltYm9sLnNwZWNpZXMsIHtcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBuZWdhdGl2ZScpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHRoYXQsIHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0dGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcih0aGF0LCBzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKG51bGwsIHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAodGhhdCwgc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHRoYXQgPSBjcmVhdGVCdWZmZXIodGhhdCwgc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG4gIGlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpemU7ICsraSkge1xuICAgICAgdGhhdFtpXSA9IDBcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoYXRcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShudWxsLCBzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nICh0aGF0LCBzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiZW5jb2RpbmdcIiBtdXN0IGJlIGEgdmFsaWQgc3RyaW5nIGVuY29kaW5nJylcbiAgfVxuXG4gIHZhciBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcblxuICB2YXIgYWN0dWFsID0gdGhhdC53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgdGhhdCA9IHRoYXQuc2xpY2UoMCwgYWN0dWFsKVxuICB9XG5cbiAgcmV0dXJuIHRoYXRcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAodGhhdCwgYXJyYXkpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbmd0aClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgIHRoYXRbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAodGhhdCwgYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBhcnJheS5ieXRlTGVuZ3RoIC8vIHRoaXMgdGhyb3dzIGlmIGBhcnJheWAgaXMgbm90IGEgdmFsaWQgQXJyYXlCdWZmZXJcblxuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXFwnb2Zmc2V0XFwnIGlzIG91dCBvZiBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcXCdsZW5ndGhcXCcgaXMgb3V0IG9mIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYnl0ZU9mZnNldCA9PT0gdW5kZWZpbmVkICYmIGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UsIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgdGhhdCA9IGFycmF5XG4gICAgdGhhdC5fX3Byb3RvX18gPSBCdWZmZXIucHJvdG90eXBlXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBhbiBvYmplY3QgaW5zdGFuY2Ugb2YgdGhlIEJ1ZmZlciBjbGFzc1xuICAgIHRoYXQgPSBmcm9tQXJyYXlMaWtlKHRoYXQsIGFycmF5KVxuICB9XG4gIHJldHVybiB0aGF0XG59XG5cbmZ1bmN0aW9uIGZyb21PYmplY3QgKHRoYXQsIG9iaikge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKG9iaikpIHtcbiAgICB2YXIgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICB0aGF0ID0gY3JlYXRlQnVmZmVyKHRoYXQsIGxlbilcblxuICAgIGlmICh0aGF0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoYXRcbiAgICB9XG5cbiAgICBvYmouY29weSh0aGF0LCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIHRoYXRcbiAgfVxuXG4gIGlmIChvYmopIHtcbiAgICBpZiAoKHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgb2JqLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fCAnbGVuZ3RoJyBpbiBvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgaXNuYW4ob2JqLmxlbmd0aCkpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcih0aGF0LCAwKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UodGhhdCwgb2JqKVxuICAgIH1cblxuICAgIGlmIChvYmoudHlwZSA9PT0gJ0J1ZmZlcicgJiYgaXNBcnJheShvYmouZGF0YSkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKHRoYXQsIG9iai5kYXRhKVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCBvciBhcnJheS1saWtlIG9iamVjdC4nKVxufVxuXG5mdW5jdGlvbiBjaGVja2VkIChsZW5ndGgpIHtcbiAgLy8gTm90ZTogY2Fubm90IHVzZSBgbGVuZ3RoIDwga01heExlbmd0aCgpYCBoZXJlIGJlY2F1c2UgdGhhdCBmYWlscyB3aGVuXG4gIC8vIGxlbmd0aCBpcyBOYU4gKHdoaWNoIGlzIG90aGVyd2lzZSBjb2VyY2VkIHRvIHplcm8uKVxuICBpZiAobGVuZ3RoID49IGtNYXhMZW5ndGgoKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIGFsbG9jYXRlIEJ1ZmZlciBsYXJnZXIgdGhhbiBtYXhpbXVtICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICdzaXplOiAweCcgKyBrTWF4TGVuZ3RoKCkudG9TdHJpbmcoMTYpICsgJyBieXRlcycpXG4gIH1cbiAgcmV0dXJuIGxlbmd0aCB8IDBcbn1cblxuZnVuY3Rpb24gU2xvd0J1ZmZlciAobGVuZ3RoKSB7XG4gIGlmICgrbGVuZ3RoICE9IGxlbmd0aCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuICAgIGxlbmd0aCA9IDBcbiAgfVxuICByZXR1cm4gQnVmZmVyLmFsbG9jKCtsZW5ndGgpXG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIGlzQnVmZmVyIChiKSB7XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAoYSwgYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnRzIG11c3QgYmUgQnVmZmVycycpXG4gIH1cblxuICBpZiAoYSA9PT0gYikgcmV0dXJuIDBcblxuICB2YXIgeCA9IGEubGVuZ3RoXG4gIHZhciB5ID0gYi5sZW5ndGhcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXVxuICAgICAgeSA9IGJbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIGlzRW5jb2RpbmcgKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gY29uY2F0IChsaXN0LCBsZW5ndGgpIHtcbiAgaWYgKCFpc0FycmF5KGxpc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgfVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBCdWZmZXIuYWxsb2MoMClcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGxlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgbGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICAgIH1cbiAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBzdHJpbmcgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZ1xuICB9XG5cbiAgdmFyIGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgaWYgKGxlbiA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBVc2UgYSBmb3IgbG9vcCB0byBhdm9pZCByZWN1cnNpb25cbiAgdmFyIGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGVuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aFxuXG5mdW5jdGlvbiBzbG93VG9TdHJpbmcgKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsb3dlcmVkQ2FzZSA9IGZhbHNlXG5cbiAgLy8gTm8gbmVlZCB0byB2ZXJpZnkgdGhhdCBcInRoaXMubGVuZ3RoIDw9IE1BWF9VSU5UMzJcIiBzaW5jZSBpdCdzIGEgcmVhZC1vbmx5XG4gIC8vIHByb3BlcnR5IG9mIGEgdHlwZWQgYXJyYXkuXG5cbiAgLy8gVGhpcyBiZWhhdmVzIG5laXRoZXIgbGlrZSBTdHJpbmcgbm9yIFVpbnQ4QXJyYXkgaW4gdGhhdCB3ZSBzZXQgc3RhcnQvZW5kXG4gIC8vIHRvIHRoZWlyIHVwcGVyL2xvd2VyIGJvdW5kcyBpZiB0aGUgdmFsdWUgcGFzc2VkIGlzIG91dCBvZiByYW5nZS5cbiAgLy8gdW5kZWZpbmVkIGlzIGhhbmRsZWQgc3BlY2lhbGx5IGFzIHBlciBFQ01BLTI2MiA2dGggRWRpdGlvbixcbiAgLy8gU2VjdGlvbiAxMy4zLjMuNyBSdW50aW1lIFNlbWFudGljczogS2V5ZWRCaW5kaW5nSW5pdGlhbGl6YXRpb24uXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkIHx8IHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ID0gMFxuICB9XG4gIC8vIFJldHVybiBlYXJseSBpZiBzdGFydCA+IHRoaXMubGVuZ3RoLiBEb25lIGhlcmUgdG8gcHJldmVudCBwb3RlbnRpYWwgdWludDMyXG4gIC8vIGNvZXJjaW9uIGZhaWwgYmVsb3cuXG4gIGlmIChzdGFydCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoZW5kID09PSB1bmRlZmluZWQgfHwgZW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKGVuZCA8PSAwKSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICAvLyBGb3JjZSBjb2Vyc2lvbiB0byB1aW50MzIuIFRoaXMgd2lsbCBhbHNvIGNvZXJjZSBmYWxzZXkvTmFOIHZhbHVlcyB0byAwLlxuICBlbmQgPj4+PSAwXG4gIHN0YXJ0ID4+Pj0gMFxuXG4gIGlmIChlbmQgPD0gc3RhcnQpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgICByZXR1cm4gYXNjaWlTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxhdGluMVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdXRmMTZsZVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9IChlbmNvZGluZyArICcnKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyBUaGUgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCBhbmQgYGlzLWJ1ZmZlcmAgKGluIFNhZmFyaSA1LTcpIHRvIGRldGVjdFxuLy8gQnVmZmVyIGluc3RhbmNlcy5cbkJ1ZmZlci5wcm90b3R5cGUuX2lzQnVmZmVyID0gdHJ1ZVxuXG5mdW5jdGlvbiBzd2FwIChiLCBuLCBtKSB7XG4gIHZhciBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbiAlIDQgIT09IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHMnKVxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDQpIHtcbiAgICBzd2FwKHRoaXMsIGksIGkgKyAzKVxuICAgIHN3YXAodGhpcywgaSArIDEsIGkgKyAyKVxuICB9XG4gIHJldHVybiB0aGlzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc3dhcDY0ID0gZnVuY3Rpb24gc3dhcDY0ICgpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggfCAwXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAnJ1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCAwLCBsZW5ndGgpXG4gIHJldHVybiBzbG93VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAoYikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihiKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlcicpXG4gIGlmICh0aGlzID09PSBiKSByZXR1cm4gdHJ1ZVxuICByZXR1cm4gQnVmZmVyLmNvbXBhcmUodGhpcywgYikgPT09IDBcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gaW5zcGVjdCAoKSB7XG4gIHZhciBzdHIgPSAnJ1xuICB2YXIgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBpZiAodGhpcy5sZW5ndGggPiAwKSB7XG4gICAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5tYXRjaCgvLnsyfS9nKS5qb2luKCcgJylcbiAgICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgdmFyIHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIHZhciB5ID0gZW5kIC0gc3RhcnRcbiAgdmFyIGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgdmFyIHRoaXNDb3B5ID0gdGhpcy5zbGljZSh0aGlzU3RhcnQsIHRoaXNFbmQpXG4gIHZhciB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKGlzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiZcbiAgICAgICAgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgWyB2YWwgXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgdmFyIGluZGV4U2l6ZSA9IDFcbiAgdmFyIGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgdmFyIHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKGRpcikge1xuICAgIHZhciBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHZhciBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGlmIChzdHJMZW4gJSAyICE9PSAwKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgcGFyc2VkID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGlmIChpc05hTihwYXJzZWQpKSByZXR1cm4gaVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IHBhcnNlZFxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIHV0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZywgYnVmLmxlbmd0aCAtIG9mZnNldCksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGFzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gbGF0aW4xV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggfCAwXG4gICAgICBpZiAoZW5jb2RpbmcgPT09IHVuZGVmaW5lZCkgZW5jb2RpbmcgPSAndXRmOCdcbiAgICB9IGVsc2Uge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgLy8gbGVnYWN5IHdyaXRlKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKSAtIHJlbW92ZSBpbiB2MC4xM1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkIHx8IGxlbmd0aCA+IHJlbWFpbmluZykgbGVuZ3RoID0gcmVtYWluaW5nXG5cbiAgaWYgKChzdHJpbmcubGVuZ3RoID4gMCAmJiAobGVuZ3RoIDwgMCB8fCBvZmZzZXQgPCAwKSkgfHwgb2Zmc2V0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB2YXIgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICAvLyBXYXJuaW5nOiBtYXhMZW5ndGggbm90IHRha2VuIGludG8gYWNjb3VudCBpbiBiYXNlNjRXcml0ZVxuICAgICAgICByZXR1cm4gYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHVjczJXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoJycgKyBlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiB1dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG4gIHZhciByZXMgPSBbXVxuXG4gIHZhciBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICB2YXIgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgdmFyIGNvZGVQb2ludCA9IG51bGxcbiAgICB2YXIgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKSA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpID8gM1xuICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRikgPyAyXG4gICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIHZhciBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbnZhciBNQVhfQVJHVU1FTlRTX0xFTkdUSCA9IDB4MTAwMFxuXG5mdW5jdGlvbiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkgKGNvZGVQb2ludHMpIHtcbiAgdmFyIGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgdmFyIHJlcyA9ICcnXG4gIHZhciBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpICsgMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gfn5zdGFydFxuICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IH5+ZW5kXG5cbiAgaWYgKHN0YXJ0IDwgMCkge1xuICAgIHN0YXJ0ICs9IGxlblxuICAgIGlmIChzdGFydCA8IDApIHN0YXJ0ID0gMFxuICB9IGVsc2UgaWYgKHN0YXJ0ID4gbGVuKSB7XG4gICAgc3RhcnQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCAwKSB7XG4gICAgZW5kICs9IGxlblxuICAgIGlmIChlbmQgPCAwKSBlbmQgPSAwXG4gIH0gZWxzZSBpZiAoZW5kID4gbGVuKSB7XG4gICAgZW5kID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgdmFyIG5ld0J1ZlxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gICAgbmV3QnVmLl9fcHJvdG9fXyA9IEJ1ZmZlci5wcm90b3R5cGVcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZClcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyArK2kpIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuZXdCdWZcbn1cblxuLypcbiAqIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgYnVmZmVyIGlzbid0IHRyeWluZyB0byB3cml0ZSBvdXQgb2YgYm91bmRzLlxuICovXG5mdW5jdGlvbiBjaGVja09mZnNldCAob2Zmc2V0LCBleHQsIGxlbmd0aCkge1xuICBpZiAoKG9mZnNldCAlIDEpICE9PSAwIHx8IG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdvZmZzZXQgaXMgbm90IHVpbnQnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gbGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXRdXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRCRSA9IGZ1bmN0aW9uIHJlYWRVSW50QkUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICB2YXIgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIHZhciBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiByZWFkVUludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdICogMHgxMDAwMDAwKSArXG4gICAgKCh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgIHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XVxuICB2YXIgbXVsID0gMVxuICB2YXIgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgdmFyIGkgPSBieXRlTGVuZ3RoXG4gIHZhciBtdWwgPSAxXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIC0taV1cbiAgd2hpbGUgKGkgPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1pXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiByZWFkSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgdmFyIHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHZhciB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdIDw8IDI0KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10pXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiByZWFkRmxvYXRCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgOCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgNTIsIDgpXG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJidWZmZXJcIiBhcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKVxuICBpZiAob2Zmc2V0ICsgZXh0ID4gYnVmLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBtdWwgPSAxXG4gIHZhciBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCB8IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIHZhciBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmYgKyB2YWx1ZSArIDFcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihidWYubGVuZ3RoIC0gb2Zmc2V0LCAyKTsgaSA8IGo7ICsraSkge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9ICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5mdW5jdGlvbiBvYmplY3RXcml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4pIHtcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4oYnVmLmxlbmd0aCAtIG9mZnNldCwgNCk7IGkgPCBqOyArK2kpIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gICAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gICAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50TEUgPSBmdW5jdGlvbiB3cml0ZUludExFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gMFxuICB2YXIgbXVsID0gMVxuICB2YXIgc3ViID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgLSAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50QkUgPSBmdW5jdGlvbiB3cml0ZUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgfCAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICB2YXIgbGltaXQgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCAtIDEpXG5cbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBsaW1pdCAtIDEsIC1saW1pdClcbiAgfVxuXG4gIHZhciBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgdmFyIG11bCA9IDFcbiAgdmFyIHN1YiA9IDBcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICBpZiAodmFsdWUgPCAwICYmIHN1YiA9PT0gMCAmJiB0aGlzW29mZnNldCArIGkgKyAxXSAhPT0gMCkge1xuICAgICAgc3ViID0gMVxuICAgIH1cbiAgICB0aGlzW29mZnNldCArIGldID0gKCh2YWx1ZSAvIG11bCkgPj4gMCkgLSBzdWIgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uIHdyaXRlSW50OCAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkgdmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiB3cml0ZUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIGlmIChCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCkge1xuICAgIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgfSBlbHNlIHtcbiAgICBvYmplY3RXcml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSlcbiAgfVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0IHwgMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKEJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB9IGVsc2Uge1xuICAgIG9iamVjdFdyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCB8IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZmZmZmZmZiArIHZhbHVlICsgMVxuICBpZiAoQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQpIHtcbiAgICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICAgIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICAgIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gICAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIH0gZWxzZSB7XG4gICAgb2JqZWN0V3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UpXG4gIH1cbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgNCwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gd3JpdGVGbG9hdExFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgaWYgKGVuZCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0IDwgZW5kIC0gc3RhcnQpIHtcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgKyBzdGFydFxuICB9XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG4gIHZhciBpXG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiBzdGFydCA8IHRhcmdldFN0YXJ0ICYmIHRhcmdldFN0YXJ0IDwgZW5kKSB7XG4gICAgLy8gZGVzY2VuZGluZyBjb3B5IGZyb20gZW5kXG4gICAgZm9yIChpID0gbGVuIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0U3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICB9IGVsc2UgaWYgKGxlbiA8IDEwMDAgfHwgIUJ1ZmZlci5UWVBFRF9BUlJBWV9TVVBQT1JUKSB7XG4gICAgLy8gYXNjZW5kaW5nIGNvcHkgZnJvbSBzdGFydFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRTdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksXG4gICAgICB0YXJnZXRTdGFydFxuICAgIClcbiAgfVxuXG4gIHJldHVybiBsZW5cbn1cblxuLy8gVXNhZ2U6XG4vLyAgICBidWZmZXIuZmlsbChudW1iZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKGJ1ZmZlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoc3RyaW5nWywgb2Zmc2V0WywgZW5kXV1bLCBlbmNvZGluZ10pXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiBmaWxsICh2YWwsIHN0YXJ0LCBlbmQsIGVuY29kaW5nKSB7XG4gIC8vIEhhbmRsZSBzdHJpbmcgY2FzZXM6XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGlmICh0eXBlb2Ygc3RhcnQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IHN0YXJ0XG4gICAgICBzdGFydCA9IDBcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZW5kID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBlbmRcbiAgICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gICAgfVxuICAgIGlmICh2YWwubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoY29kZSA8IDI1Nikge1xuICAgICAgICB2YWwgPSBjb2RlXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChlbmNvZGluZyAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbmNvZGluZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2VuY29kaW5nIG11c3QgYmUgYSBzdHJpbmcnKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGVuY29kaW5nID09PSAnc3RyaW5nJyAmJiAhQnVmZmVyLmlzRW5jb2RpbmcoZW5jb2RpbmcpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgdmFsID0gdmFsICYgMjU1XG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYnl0ZXMgPSBCdWZmZXIuaXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogdXRmOFRvQnl0ZXMobmV3IEJ1ZmZlcih2YWwsIGVuY29kaW5nKS50b1N0cmluZygpKVxuICAgIHZhciBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBmb3IgKGkgPSAwOyBpIDwgZW5kIC0gc3RhcnQ7ICsraSkge1xuICAgICAgdGhpc1tpICsgc3RhcnRdID0gYnl0ZXNbaSAlIGxlbl1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpc1xufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbnZhciBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXitcXC8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHJpbmd0cmltKHN0cikucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyaW5nLCB1bml0cykge1xuICB1bml0cyA9IHVuaXRzIHx8IEluZmluaXR5XG4gIHZhciBjb2RlUG9pbnRcbiAgdmFyIGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgdmFyIGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIHZhciBieXRlcyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIsIHVuaXRzKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBpc25hbiAodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IHZhbCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGFycikgPT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1c2VTb3VyY2VNYXApIHtcbiAgdmFyIGxpc3QgPSBbXTsgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICByZXR1cm4gJ0BtZWRpYSAnICsgaXRlbVsyXSArICd7JyArIGNvbnRlbnQgKyAnfSc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICAgIH1cbiAgICB9KS5qb2luKCcnKTtcbiAgfTsgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcblxuXG4gIGxpc3QuaSA9IGZ1bmN0aW9uIChtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSAnc3RyaW5nJykge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgJyddXTtcbiAgICB9XG5cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXG4gICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpdGVtID0gbW9kdWxlc1tpXTsgLy8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuICAgICAgLy8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcbiAgICAgIC8vIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cbiAgICAgIC8vIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblxuICAgICAgaWYgKGl0ZW1bMF0gPT0gbnVsbCB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBpZiAobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuICAgICAgICB9IGVsc2UgaWYgKG1lZGlhUXVlcnkpIHtcbiAgICAgICAgICBpdGVtWzJdID0gJygnICsgaXRlbVsyXSArICcpIGFuZCAoJyArIG1lZGlhUXVlcnkgKyAnKSc7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cblxuICBpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLyc7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG4gIH1cblxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufSAvLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5cblxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcbiAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG4gIHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG4gIHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59IiwiZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiLyohXG4gKiBTb2NrZXQuSU8gdjIuMi4wXG4gKiAoYykgMjAxNC0yMDE4IEd1aWxsZXJtbyBSYXVjaFxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICovXG4hZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShbXSxlKTpcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cz9leHBvcnRzLmlvPWUoKTp0LmlvPWUoKX0odGhpcyxmdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbih0KXtmdW5jdGlvbiBlKG4pe2lmKHJbbl0pcmV0dXJuIHJbbl0uZXhwb3J0czt2YXIgbz1yW25dPXtleHBvcnRzOnt9LGlkOm4sbG9hZGVkOiExfTtyZXR1cm4gdFtuXS5jYWxsKG8uZXhwb3J0cyxvLG8uZXhwb3J0cyxlKSxvLmxvYWRlZD0hMCxvLmV4cG9ydHN9dmFyIHI9e307cmV0dXJuIGUubT10LGUuYz1yLGUucD1cIlwiLGUoMCl9KFtmdW5jdGlvbih0LGUscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0LGUpe1wib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpvKHQpKSYmKGU9dCx0PXZvaWQgMCksZT1lfHx7fTt2YXIgcixuPWkodCkscz1uLnNvdXJjZSxwPW4uaWQsaD1uLnBhdGgsdT1jW3BdJiZoIGluIGNbcF0ubnNwcyxmPWUuZm9yY2VOZXd8fGVbXCJmb3JjZSBuZXcgY29ubmVjdGlvblwiXXx8ITE9PT1lLm11bHRpcGxleHx8dTtyZXR1cm4gZj9yPWEocyxlKTooY1twXXx8KGNbcF09YShzLGUpKSxyPWNbcF0pLG4ucXVlcnkmJiFlLnF1ZXJ5JiYoZS5xdWVyeT1uLnF1ZXJ5KSxyLnNvY2tldChuLnBhdGgsZSl9dmFyIG89XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0saT1yKDEpLHM9cig0KSxhPXIoOSk7cigzKShcInNvY2tldC5pby1jbGllbnRcIik7dC5leHBvcnRzPWU9bjt2YXIgYz1lLm1hbmFnZXJzPXt9O2UucHJvdG9jb2w9cy5wcm90b2NvbCxlLmNvbm5lY3Q9bixlLk1hbmFnZXI9cig5KSxlLlNvY2tldD1yKDMzKX0sZnVuY3Rpb24odCxlLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIG4odCxlKXt2YXIgcj10O2U9ZXx8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGxvY2F0aW9uJiZsb2NhdGlvbixudWxsPT10JiYodD1lLnByb3RvY29sK1wiLy9cIitlLmhvc3QpLFwic3RyaW5nXCI9PXR5cGVvZiB0JiYoXCIvXCI9PT10LmNoYXJBdCgwKSYmKHQ9XCIvXCI9PT10LmNoYXJBdCgxKT9lLnByb3RvY29sK3Q6ZS5ob3N0K3QpLC9eKGh0dHBzP3x3c3M/KTpcXC9cXC8vLnRlc3QodCl8fCh0PVwidW5kZWZpbmVkXCIhPXR5cGVvZiBlP2UucHJvdG9jb2wrXCIvL1wiK3Q6XCJodHRwczovL1wiK3QpLHI9byh0KSksci5wb3J0fHwoL14oaHR0cHx3cykkLy50ZXN0KHIucHJvdG9jb2wpP3IucG9ydD1cIjgwXCI6L14oaHR0cHx3cylzJC8udGVzdChyLnByb3RvY29sKSYmKHIucG9ydD1cIjQ0M1wiKSksci5wYXRoPXIucGF0aHx8XCIvXCI7dmFyIG49ci5ob3N0LmluZGV4T2YoXCI6XCIpIT09LTEsaT1uP1wiW1wiK3IuaG9zdCtcIl1cIjpyLmhvc3Q7cmV0dXJuIHIuaWQ9ci5wcm90b2NvbCtcIjovL1wiK2krXCI6XCIrci5wb3J0LHIuaHJlZj1yLnByb3RvY29sK1wiOi8vXCIraSsoZSYmZS5wb3J0PT09ci5wb3J0P1wiXCI6XCI6XCIrci5wb3J0KSxyfXZhciBvPXIoMik7cigzKShcInNvY2tldC5pby1jbGllbnQ6dXJsXCIpO3QuZXhwb3J0cz1ufSxmdW5jdGlvbih0LGUpe3ZhciByPS9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKGh0dHB8aHR0cHN8d3N8d3NzKTpcXC9cXC8pPygoPzooKFteOkBdKikoPzo6KFteOkBdKikpPyk/QCk/KCg/OlthLWYwLTldezAsNH06KXsyLDd9W2EtZjAtOV17MCw0fXxbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLG49W1wic291cmNlXCIsXCJwcm90b2NvbFwiLFwiYXV0aG9yaXR5XCIsXCJ1c2VySW5mb1wiLFwidXNlclwiLFwicGFzc3dvcmRcIixcImhvc3RcIixcInBvcnRcIixcInJlbGF0aXZlXCIsXCJwYXRoXCIsXCJkaXJlY3RvcnlcIixcImZpbGVcIixcInF1ZXJ5XCIsXCJhbmNob3JcIl07dC5leHBvcnRzPWZ1bmN0aW9uKHQpe3ZhciBlPXQsbz10LmluZGV4T2YoXCJbXCIpLGk9dC5pbmRleE9mKFwiXVwiKTtvIT0tMSYmaSE9LTEmJih0PXQuc3Vic3RyaW5nKDAsbykrdC5zdWJzdHJpbmcobyxpKS5yZXBsYWNlKC86L2csXCI7XCIpK3Quc3Vic3RyaW5nKGksdC5sZW5ndGgpKTtmb3IodmFyIHM9ci5leGVjKHR8fFwiXCIpLGE9e30sYz0xNDtjLS07KWFbbltjXV09c1tjXXx8XCJcIjtyZXR1cm4gbyE9LTEmJmkhPS0xJiYoYS5zb3VyY2U9ZSxhLmhvc3Q9YS5ob3N0LnN1YnN0cmluZygxLGEuaG9zdC5sZW5ndGgtMSkucmVwbGFjZSgvOy9nLFwiOlwiKSxhLmF1dGhvcml0eT1hLmF1dGhvcml0eS5yZXBsYWNlKFwiW1wiLFwiXCIpLnJlcGxhY2UoXCJdXCIsXCJcIikucmVwbGFjZSgvOy9nLFwiOlwiKSxhLmlwdjZ1cmk9ITApLGF9fSxmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO3QuZXhwb3J0cz1mdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbigpe319fSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbigpe31mdW5jdGlvbiBvKHQpe3ZhciByPVwiXCIrdC50eXBlO2lmKGUuQklOQVJZX0VWRU5UIT09dC50eXBlJiZlLkJJTkFSWV9BQ0shPT10LnR5cGV8fChyKz10LmF0dGFjaG1lbnRzK1wiLVwiKSx0Lm5zcCYmXCIvXCIhPT10Lm5zcCYmKHIrPXQubnNwK1wiLFwiKSxudWxsIT10LmlkJiYocis9dC5pZCksbnVsbCE9dC5kYXRhKXt2YXIgbj1pKHQuZGF0YSk7aWYobj09PSExKXJldHVybiBtO3IrPW59cmV0dXJuIHJ9ZnVuY3Rpb24gaSh0KXt0cnl7cmV0dXJuIEpTT04uc3RyaW5naWZ5KHQpfWNhdGNoKHQpe3JldHVybiExfX1mdW5jdGlvbiBzKHQsZSl7ZnVuY3Rpb24gcih0KXt2YXIgcj1sLmRlY29uc3RydWN0UGFja2V0KHQpLG49byhyLnBhY2tldCksaT1yLmJ1ZmZlcnM7aS51bnNoaWZ0KG4pLGUoaSl9bC5yZW1vdmVCbG9icyh0LHIpfWZ1bmN0aW9uIGEoKXt0aGlzLnJlY29uc3RydWN0b3I9bnVsbH1mdW5jdGlvbiBjKHQpe3ZhciByPTAsbj17dHlwZTpOdW1iZXIodC5jaGFyQXQoMCkpfTtpZihudWxsPT1lLnR5cGVzW24udHlwZV0pcmV0dXJuIHUoXCJ1bmtub3duIHBhY2tldCB0eXBlIFwiK24udHlwZSk7aWYoZS5CSU5BUllfRVZFTlQ9PT1uLnR5cGV8fGUuQklOQVJZX0FDSz09PW4udHlwZSl7Zm9yKHZhciBvPVwiXCI7XCItXCIhPT10LmNoYXJBdCgrK3IpJiYobys9dC5jaGFyQXQociksciE9dC5sZW5ndGgpOyk7aWYobyE9TnVtYmVyKG8pfHxcIi1cIiE9PXQuY2hhckF0KHIpKXRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgYXR0YWNobWVudHNcIik7bi5hdHRhY2htZW50cz1OdW1iZXIobyl9aWYoXCIvXCI9PT10LmNoYXJBdChyKzEpKWZvcihuLm5zcD1cIlwiOysrcjspe3ZhciBpPXQuY2hhckF0KHIpO2lmKFwiLFwiPT09aSlicmVhaztpZihuLm5zcCs9aSxyPT09dC5sZW5ndGgpYnJlYWt9ZWxzZSBuLm5zcD1cIi9cIjt2YXIgcz10LmNoYXJBdChyKzEpO2lmKFwiXCIhPT1zJiZOdW1iZXIocyk9PXMpe2ZvcihuLmlkPVwiXCI7KytyOyl7dmFyIGk9dC5jaGFyQXQocik7aWYobnVsbD09aXx8TnVtYmVyKGkpIT1pKXstLXI7YnJlYWt9aWYobi5pZCs9dC5jaGFyQXQocikscj09PXQubGVuZ3RoKWJyZWFrfW4uaWQ9TnVtYmVyKG4uaWQpfWlmKHQuY2hhckF0KCsrcikpe3ZhciBhPXAodC5zdWJzdHIocikpLGM9YSE9PSExJiYobi50eXBlPT09ZS5FUlJPUnx8ZChhKSk7aWYoIWMpcmV0dXJuIHUoXCJpbnZhbGlkIHBheWxvYWRcIik7bi5kYXRhPWF9cmV0dXJuIG59ZnVuY3Rpb24gcCh0KXt0cnl7cmV0dXJuIEpTT04ucGFyc2UodCl9Y2F0Y2godCl7cmV0dXJuITF9fWZ1bmN0aW9uIGgodCl7dGhpcy5yZWNvblBhY2s9dCx0aGlzLmJ1ZmZlcnM9W119ZnVuY3Rpb24gdSh0KXtyZXR1cm57dHlwZTplLkVSUk9SLGRhdGE6XCJwYXJzZXIgZXJyb3I6IFwiK3R9fXZhciBmPShyKDMpKFwic29ja2V0LmlvLXBhcnNlclwiKSxyKDUpKSxsPXIoNiksZD1yKDcpLHk9cig4KTtlLnByb3RvY29sPTQsZS50eXBlcz1bXCJDT05ORUNUXCIsXCJESVNDT05ORUNUXCIsXCJFVkVOVFwiLFwiQUNLXCIsXCJFUlJPUlwiLFwiQklOQVJZX0VWRU5UXCIsXCJCSU5BUllfQUNLXCJdLGUuQ09OTkVDVD0wLGUuRElTQ09OTkVDVD0xLGUuRVZFTlQ9MixlLkFDSz0zLGUuRVJST1I9NCxlLkJJTkFSWV9FVkVOVD01LGUuQklOQVJZX0FDSz02LGUuRW5jb2Rlcj1uLGUuRGVjb2Rlcj1hO3ZhciBtPWUuRVJST1IrJ1wiZW5jb2RlIGVycm9yXCInO24ucHJvdG90eXBlLmVuY29kZT1mdW5jdGlvbih0LHIpe2lmKGUuQklOQVJZX0VWRU5UPT09dC50eXBlfHxlLkJJTkFSWV9BQ0s9PT10LnR5cGUpcyh0LHIpO2Vsc2V7dmFyIG49byh0KTtyKFtuXSl9fSxmKGEucHJvdG90eXBlKSxhLnByb3RvdHlwZS5hZGQ9ZnVuY3Rpb24odCl7dmFyIHI7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQpcj1jKHQpLGUuQklOQVJZX0VWRU5UPT09ci50eXBlfHxlLkJJTkFSWV9BQ0s9PT1yLnR5cGU/KHRoaXMucmVjb25zdHJ1Y3Rvcj1uZXcgaChyKSwwPT09dGhpcy5yZWNvbnN0cnVjdG9yLnJlY29uUGFjay5hdHRhY2htZW50cyYmdGhpcy5lbWl0KFwiZGVjb2RlZFwiLHIpKTp0aGlzLmVtaXQoXCJkZWNvZGVkXCIscik7ZWxzZXtpZigheSh0KSYmIXQuYmFzZTY0KXRocm93IG5ldyBFcnJvcihcIlVua25vd24gdHlwZTogXCIrdCk7aWYoIXRoaXMucmVjb25zdHJ1Y3Rvcil0aHJvdyBuZXcgRXJyb3IoXCJnb3QgYmluYXJ5IGRhdGEgd2hlbiBub3QgcmVjb25zdHJ1Y3RpbmcgYSBwYWNrZXRcIik7cj10aGlzLnJlY29uc3RydWN0b3IudGFrZUJpbmFyeURhdGEodCksciYmKHRoaXMucmVjb25zdHJ1Y3Rvcj1udWxsLHRoaXMuZW1pdChcImRlY29kZWRcIixyKSl9fSxhLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7dGhpcy5yZWNvbnN0cnVjdG9yJiZ0aGlzLnJlY29uc3RydWN0b3IuZmluaXNoZWRSZWNvbnN0cnVjdGlvbigpfSxoLnByb3RvdHlwZS50YWtlQmluYXJ5RGF0YT1mdW5jdGlvbih0KXtpZih0aGlzLmJ1ZmZlcnMucHVzaCh0KSx0aGlzLmJ1ZmZlcnMubGVuZ3RoPT09dGhpcy5yZWNvblBhY2suYXR0YWNobWVudHMpe3ZhciBlPWwucmVjb25zdHJ1Y3RQYWNrZXQodGhpcy5yZWNvblBhY2ssdGhpcy5idWZmZXJzKTtyZXR1cm4gdGhpcy5maW5pc2hlZFJlY29uc3RydWN0aW9uKCksZX1yZXR1cm4gbnVsbH0saC5wcm90b3R5cGUuZmluaXNoZWRSZWNvbnN0cnVjdGlvbj1mdW5jdGlvbigpe3RoaXMucmVjb25QYWNrPW51bGwsdGhpcy5idWZmZXJzPVtdfX0sZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCl7aWYodClyZXR1cm4gbyh0KX1mdW5jdGlvbiBvKHQpe2Zvcih2YXIgZSBpbiBuLnByb3RvdHlwZSl0W2VdPW4ucHJvdG90eXBlW2VdO3JldHVybiB0fXQuZXhwb3J0cz1uLG4ucHJvdG90eXBlLm9uPW4ucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5fY2FsbGJhY2tzPXRoaXMuX2NhbGxiYWNrc3x8e30sKHRoaXMuX2NhbGxiYWNrc1tcIiRcIit0XT10aGlzLl9jYWxsYmFja3NbXCIkXCIrdF18fFtdKS5wdXNoKGUpLHRoaXN9LG4ucHJvdG90eXBlLm9uY2U9ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKCl7dGhpcy5vZmYodCxyKSxlLmFwcGx5KHRoaXMsYXJndW1lbnRzKX1yZXR1cm4gci5mbj1lLHRoaXMub24odCxyKSx0aGlzfSxuLnByb3RvdHlwZS5vZmY9bi5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI9bi5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzPW4ucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXI9ZnVuY3Rpb24odCxlKXtpZih0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fSwwPT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiB0aGlzLl9jYWxsYmFja3M9e30sdGhpczt2YXIgcj10aGlzLl9jYWxsYmFja3NbXCIkXCIrdF07aWYoIXIpcmV0dXJuIHRoaXM7aWYoMT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gZGVsZXRlIHRoaXMuX2NhbGxiYWNrc1tcIiRcIit0XSx0aGlzO2Zvcih2YXIgbixvPTA7bzxyLmxlbmd0aDtvKyspaWYobj1yW29dLG49PT1lfHxuLmZuPT09ZSl7ci5zcGxpY2UobywxKTticmVha31yZXR1cm4gdGhpc30sbi5wcm90b3R5cGUuZW1pdD1mdW5jdGlvbih0KXt0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fTt2YXIgZT1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSxyPXRoaXMuX2NhbGxiYWNrc1tcIiRcIit0XTtpZihyKXtyPXIuc2xpY2UoMCk7Zm9yKHZhciBuPTAsbz1yLmxlbmd0aDtuPG87KytuKXJbbl0uYXBwbHkodGhpcyxlKX1yZXR1cm4gdGhpc30sbi5wcm90b3R5cGUubGlzdGVuZXJzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9jYWxsYmFja3M9dGhpcy5fY2FsbGJhY2tzfHx7fSx0aGlzLl9jYWxsYmFja3NbXCIkXCIrdF18fFtdfSxuLnByb3RvdHlwZS5oYXNMaXN0ZW5lcnM9ZnVuY3Rpb24odCl7cmV0dXJuISF0aGlzLmxpc3RlbmVycyh0KS5sZW5ndGh9fSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe2lmKCF0KXJldHVybiB0O2lmKHModCkpe3ZhciByPXtfcGxhY2Vob2xkZXI6ITAsbnVtOmUubGVuZ3RofTtyZXR1cm4gZS5wdXNoKHQpLHJ9aWYoaSh0KSl7Zm9yKHZhciBvPW5ldyBBcnJheSh0Lmxlbmd0aCksYT0wO2E8dC5sZW5ndGg7YSsrKW9bYV09bih0W2FdLGUpO3JldHVybiBvfWlmKFwib2JqZWN0XCI9PXR5cGVvZiB0JiYhKHQgaW5zdGFuY2VvZiBEYXRlKSl7dmFyIG89e307Zm9yKHZhciBjIGluIHQpb1tjXT1uKHRbY10sZSk7cmV0dXJuIG99cmV0dXJuIHR9ZnVuY3Rpb24gbyh0LGUpe2lmKCF0KXJldHVybiB0O2lmKHQmJnQuX3BsYWNlaG9sZGVyKXJldHVybiBlW3QubnVtXTtpZihpKHQpKWZvcih2YXIgcj0wO3I8dC5sZW5ndGg7cisrKXRbcl09byh0W3JdLGUpO2Vsc2UgaWYoXCJvYmplY3RcIj09dHlwZW9mIHQpZm9yKHZhciBuIGluIHQpdFtuXT1vKHRbbl0sZSk7cmV0dXJuIHR9dmFyIGk9cig3KSxzPXIoOCksYT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLGM9XCJmdW5jdGlvblwiPT10eXBlb2YgQmxvYnx8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEJsb2ImJlwiW29iamVjdCBCbG9iQ29uc3RydWN0b3JdXCI9PT1hLmNhbGwoQmxvYikscD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBGaWxlfHxcInVuZGVmaW5lZFwiIT10eXBlb2YgRmlsZSYmXCJbb2JqZWN0IEZpbGVDb25zdHJ1Y3Rvcl1cIj09PWEuY2FsbChGaWxlKTtlLmRlY29uc3RydWN0UGFja2V0PWZ1bmN0aW9uKHQpe3ZhciBlPVtdLHI9dC5kYXRhLG89dDtyZXR1cm4gby5kYXRhPW4ocixlKSxvLmF0dGFjaG1lbnRzPWUubGVuZ3RoLHtwYWNrZXQ6byxidWZmZXJzOmV9fSxlLnJlY29uc3RydWN0UGFja2V0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQuZGF0YT1vKHQuZGF0YSxlKSx0LmF0dGFjaG1lbnRzPXZvaWQgMCx0fSxlLnJlbW92ZUJsb2JzPWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcih0LGEsaCl7aWYoIXQpcmV0dXJuIHQ7aWYoYyYmdCBpbnN0YW5jZW9mIEJsb2J8fHAmJnQgaW5zdGFuY2VvZiBGaWxlKXtuKys7dmFyIHU9bmV3IEZpbGVSZWFkZXI7dS5vbmxvYWQ9ZnVuY3Rpb24oKXtoP2hbYV09dGhpcy5yZXN1bHQ6bz10aGlzLnJlc3VsdCwtLW58fGUobyl9LHUucmVhZEFzQXJyYXlCdWZmZXIodCl9ZWxzZSBpZihpKHQpKWZvcih2YXIgZj0wO2Y8dC5sZW5ndGg7ZisrKXIodFtmXSxmLHQpO2Vsc2UgaWYoXCJvYmplY3RcIj09dHlwZW9mIHQmJiFzKHQpKWZvcih2YXIgbCBpbiB0KXIodFtsXSxsLHQpfXZhciBuPTAsbz10O3Iobyksbnx8ZShvKX19LGZ1bmN0aW9uKHQsZSl7dmFyIHI9e30udG9TdHJpbmc7dC5leHBvcnRzPUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKHQpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09ci5jYWxsKHQpfX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQpe3JldHVybiBuJiZCdWZmZXIuaXNCdWZmZXIodCl8fG8mJih0IGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fGkodCkpfXQuZXhwb3J0cz1yO3ZhciBuPVwiZnVuY3Rpb25cIj09dHlwZW9mIEJ1ZmZlciYmXCJmdW5jdGlvblwiPT10eXBlb2YgQnVmZmVyLmlzQnVmZmVyLG89XCJmdW5jdGlvblwiPT10eXBlb2YgQXJyYXlCdWZmZXIsaT1mdW5jdGlvbih0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXc/QXJyYXlCdWZmZXIuaXNWaWV3KHQpOnQuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ9fSxmdW5jdGlvbih0LGUscil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih0LGUpe2lmKCEodGhpcyBpbnN0YW5jZW9mIG4pKXJldHVybiBuZXcgbih0LGUpO3QmJlwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHQ/XCJ1bmRlZmluZWRcIjpvKHQpKSYmKGU9dCx0PXZvaWQgMCksZT1lfHx7fSxlLnBhdGg9ZS5wYXRofHxcIi9zb2NrZXQuaW9cIix0aGlzLm5zcHM9e30sdGhpcy5zdWJzPVtdLHRoaXMub3B0cz1lLHRoaXMucmVjb25uZWN0aW9uKGUucmVjb25uZWN0aW9uIT09ITEpLHRoaXMucmVjb25uZWN0aW9uQXR0ZW1wdHMoZS5yZWNvbm5lY3Rpb25BdHRlbXB0c3x8MS8wKSx0aGlzLnJlY29ubmVjdGlvbkRlbGF5KGUucmVjb25uZWN0aW9uRGVsYXl8fDFlMyksdGhpcy5yZWNvbm5lY3Rpb25EZWxheU1heChlLnJlY29ubmVjdGlvbkRlbGF5TWF4fHw1ZTMpLHRoaXMucmFuZG9taXphdGlvbkZhY3RvcihlLnJhbmRvbWl6YXRpb25GYWN0b3J8fC41KSx0aGlzLmJhY2tvZmY9bmV3IGYoe21pbjp0aGlzLnJlY29ubmVjdGlvbkRlbGF5KCksbWF4OnRoaXMucmVjb25uZWN0aW9uRGVsYXlNYXgoKSxqaXR0ZXI6dGhpcy5yYW5kb21pemF0aW9uRmFjdG9yKCl9KSx0aGlzLnRpbWVvdXQobnVsbD09ZS50aW1lb3V0PzJlNDplLnRpbWVvdXQpLHRoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiLHRoaXMudXJpPXQsdGhpcy5jb25uZWN0aW5nPVtdLHRoaXMubGFzdFBpbmc9bnVsbCx0aGlzLmVuY29kaW5nPSExLHRoaXMucGFja2V0QnVmZmVyPVtdO3ZhciByPWUucGFyc2VyfHxjO3RoaXMuZW5jb2Rlcj1uZXcgci5FbmNvZGVyLHRoaXMuZGVjb2Rlcj1uZXcgci5EZWNvZGVyLHRoaXMuYXV0b0Nvbm5lY3Q9ZS5hdXRvQ29ubmVjdCE9PSExLHRoaXMuYXV0b0Nvbm5lY3QmJnRoaXMub3BlbigpfXZhciBvPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9LGk9cigxMCkscz1yKDMzKSxhPXIoNSksYz1yKDQpLHA9cigzNSksaD1yKDM2KSx1PShyKDMpKFwic29ja2V0LmlvLWNsaWVudDptYW5hZ2VyXCIpLHIoMzIpKSxmPXIoMzcpLGw9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTt0LmV4cG9ydHM9bixuLnByb3RvdHlwZS5lbWl0QWxsPWZ1bmN0aW9uKCl7dGhpcy5lbWl0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtmb3IodmFyIHQgaW4gdGhpcy5uc3BzKWwuY2FsbCh0aGlzLm5zcHMsdCkmJnRoaXMubnNwc1t0XS5lbWl0LmFwcGx5KHRoaXMubnNwc1t0XSxhcmd1bWVudHMpfSxuLnByb3RvdHlwZS51cGRhdGVTb2NrZXRJZHM9ZnVuY3Rpb24oKXtmb3IodmFyIHQgaW4gdGhpcy5uc3BzKWwuY2FsbCh0aGlzLm5zcHMsdCkmJih0aGlzLm5zcHNbdF0uaWQ9dGhpcy5nZW5lcmF0ZUlkKHQpKX0sbi5wcm90b3R5cGUuZ2VuZXJhdGVJZD1mdW5jdGlvbih0KXtyZXR1cm4oXCIvXCI9PT10P1wiXCI6dCtcIiNcIikrdGhpcy5lbmdpbmUuaWR9LGEobi5wcm90b3R5cGUpLG4ucHJvdG90eXBlLnJlY29ubmVjdGlvbj1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVjb25uZWN0aW9uPSEhdCx0aGlzKTp0aGlzLl9yZWNvbm5lY3Rpb259LG4ucHJvdG90eXBlLnJlY29ubmVjdGlvbkF0dGVtcHRzPWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9yZWNvbm5lY3Rpb25BdHRlbXB0cz10LHRoaXMpOnRoaXMuX3JlY29ubmVjdGlvbkF0dGVtcHRzfSxuLnByb3RvdHlwZS5yZWNvbm5lY3Rpb25EZWxheT1mdW5jdGlvbih0KXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD8odGhpcy5fcmVjb25uZWN0aW9uRGVsYXk9dCx0aGlzLmJhY2tvZmYmJnRoaXMuYmFja29mZi5zZXRNaW4odCksdGhpcyk6dGhpcy5fcmVjb25uZWN0aW9uRGVsYXl9LG4ucHJvdG90eXBlLnJhbmRvbWl6YXRpb25GYWN0b3I9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JhbmRvbWl6YXRpb25GYWN0b3I9dCx0aGlzLmJhY2tvZmYmJnRoaXMuYmFja29mZi5zZXRKaXR0ZXIodCksdGhpcyk6dGhpcy5fcmFuZG9taXphdGlvbkZhY3Rvcn0sbi5wcm90b3R5cGUucmVjb25uZWN0aW9uRGVsYXlNYXg9ZnVuY3Rpb24odCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/KHRoaXMuX3JlY29ubmVjdGlvbkRlbGF5TWF4PXQsdGhpcy5iYWNrb2ZmJiZ0aGlzLmJhY2tvZmYuc2V0TWF4KHQpLHRoaXMpOnRoaXMuX3JlY29ubmVjdGlvbkRlbGF5TWF4fSxuLnByb3RvdHlwZS50aW1lb3V0PWZ1bmN0aW9uKHQpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoPyh0aGlzLl90aW1lb3V0PXQsdGhpcyk6dGhpcy5fdGltZW91dH0sbi5wcm90b3R5cGUubWF5YmVSZWNvbm5lY3RPbk9wZW49ZnVuY3Rpb24oKXshdGhpcy5yZWNvbm5lY3RpbmcmJnRoaXMuX3JlY29ubmVjdGlvbiYmMD09PXRoaXMuYmFja29mZi5hdHRlbXB0cyYmdGhpcy5yZWNvbm5lY3QoKX0sbi5wcm90b3R5cGUub3Blbj1uLnByb3RvdHlwZS5jb25uZWN0PWZ1bmN0aW9uKHQsZSl7aWYofnRoaXMucmVhZHlTdGF0ZS5pbmRleE9mKFwib3BlblwiKSlyZXR1cm4gdGhpczt0aGlzLmVuZ2luZT1pKHRoaXMudXJpLHRoaXMub3B0cyk7dmFyIHI9dGhpcy5lbmdpbmUsbj10aGlzO3RoaXMucmVhZHlTdGF0ZT1cIm9wZW5pbmdcIix0aGlzLnNraXBSZWNvbm5lY3Q9ITE7dmFyIG89cChyLFwib3BlblwiLGZ1bmN0aW9uKCl7bi5vbm9wZW4oKSx0JiZ0KCl9KSxzPXAocixcImVycm9yXCIsZnVuY3Rpb24oZSl7aWYobi5jbGVhbnVwKCksbi5yZWFkeVN0YXRlPVwiY2xvc2VkXCIsbi5lbWl0QWxsKFwiY29ubmVjdF9lcnJvclwiLGUpLHQpe3ZhciByPW5ldyBFcnJvcihcIkNvbm5lY3Rpb24gZXJyb3JcIik7ci5kYXRhPWUsdChyKX1lbHNlIG4ubWF5YmVSZWNvbm5lY3RPbk9wZW4oKX0pO2lmKCExIT09dGhpcy5fdGltZW91dCl7dmFyIGE9dGhpcy5fdGltZW91dCxjPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtvLmRlc3Ryb3koKSxyLmNsb3NlKCksci5lbWl0KFwiZXJyb3JcIixcInRpbWVvdXRcIiksbi5lbWl0QWxsKFwiY29ubmVjdF90aW1lb3V0XCIsYSl9LGEpO3RoaXMuc3Vicy5wdXNoKHtkZXN0cm95OmZ1bmN0aW9uKCl7Y2xlYXJUaW1lb3V0KGMpfX0pfXJldHVybiB0aGlzLnN1YnMucHVzaChvKSx0aGlzLnN1YnMucHVzaChzKSx0aGlzfSxuLnByb3RvdHlwZS5vbm9wZW49ZnVuY3Rpb24oKXt0aGlzLmNsZWFudXAoKSx0aGlzLnJlYWR5U3RhdGU9XCJvcGVuXCIsdGhpcy5lbWl0KFwib3BlblwiKTt2YXIgdD10aGlzLmVuZ2luZTt0aGlzLnN1YnMucHVzaChwKHQsXCJkYXRhXCIsaCh0aGlzLFwib25kYXRhXCIpKSksdGhpcy5zdWJzLnB1c2gocCh0LFwicGluZ1wiLGgodGhpcyxcIm9ucGluZ1wiKSkpLHRoaXMuc3Vicy5wdXNoKHAodCxcInBvbmdcIixoKHRoaXMsXCJvbnBvbmdcIikpKSx0aGlzLnN1YnMucHVzaChwKHQsXCJlcnJvclwiLGgodGhpcyxcIm9uZXJyb3JcIikpKSx0aGlzLnN1YnMucHVzaChwKHQsXCJjbG9zZVwiLGgodGhpcyxcIm9uY2xvc2VcIikpKSx0aGlzLnN1YnMucHVzaChwKHRoaXMuZGVjb2RlcixcImRlY29kZWRcIixoKHRoaXMsXCJvbmRlY29kZWRcIikpKX0sbi5wcm90b3R5cGUub25waW5nPWZ1bmN0aW9uKCl7dGhpcy5sYXN0UGluZz1uZXcgRGF0ZSx0aGlzLmVtaXRBbGwoXCJwaW5nXCIpfSxuLnByb3RvdHlwZS5vbnBvbmc9ZnVuY3Rpb24oKXt0aGlzLmVtaXRBbGwoXCJwb25nXCIsbmV3IERhdGUtdGhpcy5sYXN0UGluZyl9LG4ucHJvdG90eXBlLm9uZGF0YT1mdW5jdGlvbih0KXt0aGlzLmRlY29kZXIuYWRkKHQpfSxuLnByb3RvdHlwZS5vbmRlY29kZWQ9ZnVuY3Rpb24odCl7dGhpcy5lbWl0KFwicGFja2V0XCIsdCl9LG4ucHJvdG90eXBlLm9uZXJyb3I9ZnVuY3Rpb24odCl7dGhpcy5lbWl0QWxsKFwiZXJyb3JcIix0KX0sbi5wcm90b3R5cGUuc29ja2V0PWZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcigpe351KG8uY29ubmVjdGluZyxuKXx8by5jb25uZWN0aW5nLnB1c2gobil9dmFyIG49dGhpcy5uc3BzW3RdO2lmKCFuKXtuPW5ldyBzKHRoaXMsdCxlKSx0aGlzLm5zcHNbdF09bjt2YXIgbz10aGlzO24ub24oXCJjb25uZWN0aW5nXCIsciksbi5vbihcImNvbm5lY3RcIixmdW5jdGlvbigpe24uaWQ9by5nZW5lcmF0ZUlkKHQpfSksdGhpcy5hdXRvQ29ubmVjdCYmcigpfXJldHVybiBufSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKHQpe3ZhciBlPXUodGhpcy5jb25uZWN0aW5nLHQpO35lJiZ0aGlzLmNvbm5lY3Rpbmcuc3BsaWNlKGUsMSksdGhpcy5jb25uZWN0aW5nLmxlbmd0aHx8dGhpcy5jbG9zZSgpfSxuLnByb3RvdHlwZS5wYWNrZXQ9ZnVuY3Rpb24odCl7dmFyIGU9dGhpczt0LnF1ZXJ5JiYwPT09dC50eXBlJiYodC5uc3ArPVwiP1wiK3QucXVlcnkpLGUuZW5jb2Rpbmc/ZS5wYWNrZXRCdWZmZXIucHVzaCh0KTooZS5lbmNvZGluZz0hMCx0aGlzLmVuY29kZXIuZW5jb2RlKHQsZnVuY3Rpb24ocil7Zm9yKHZhciBuPTA7bjxyLmxlbmd0aDtuKyspZS5lbmdpbmUud3JpdGUocltuXSx0Lm9wdGlvbnMpO2UuZW5jb2Rpbmc9ITEsZS5wcm9jZXNzUGFja2V0UXVldWUoKX0pKX0sbi5wcm90b3R5cGUucHJvY2Vzc1BhY2tldFF1ZXVlPWZ1bmN0aW9uKCl7aWYodGhpcy5wYWNrZXRCdWZmZXIubGVuZ3RoPjAmJiF0aGlzLmVuY29kaW5nKXt2YXIgdD10aGlzLnBhY2tldEJ1ZmZlci5zaGlmdCgpO3RoaXMucGFja2V0KHQpfX0sbi5wcm90b3R5cGUuY2xlYW51cD1mdW5jdGlvbigpe2Zvcih2YXIgdD10aGlzLnN1YnMubGVuZ3RoLGU9MDtlPHQ7ZSsrKXt2YXIgcj10aGlzLnN1YnMuc2hpZnQoKTtyLmRlc3Ryb3koKX10aGlzLnBhY2tldEJ1ZmZlcj1bXSx0aGlzLmVuY29kaW5nPSExLHRoaXMubGFzdFBpbmc9bnVsbCx0aGlzLmRlY29kZXIuZGVzdHJveSgpfSxuLnByb3RvdHlwZS5jbG9zZT1uLnByb3RvdHlwZS5kaXNjb25uZWN0PWZ1bmN0aW9uKCl7dGhpcy5za2lwUmVjb25uZWN0PSEwLHRoaXMucmVjb25uZWN0aW5nPSExLFwib3BlbmluZ1wiPT09dGhpcy5yZWFkeVN0YXRlJiZ0aGlzLmNsZWFudXAoKSx0aGlzLmJhY2tvZmYucmVzZXQoKSx0aGlzLnJlYWR5U3RhdGU9XCJjbG9zZWRcIix0aGlzLmVuZ2luZSYmdGhpcy5lbmdpbmUuY2xvc2UoKX0sbi5wcm90b3R5cGUub25jbG9zZT1mdW5jdGlvbih0KXt0aGlzLmNsZWFudXAoKSx0aGlzLmJhY2tvZmYucmVzZXQoKSx0aGlzLnJlYWR5U3RhdGU9XCJjbG9zZWRcIix0aGlzLmVtaXQoXCJjbG9zZVwiLHQpLHRoaXMuX3JlY29ubmVjdGlvbiYmIXRoaXMuc2tpcFJlY29ubmVjdCYmdGhpcy5yZWNvbm5lY3QoKX0sbi5wcm90b3R5cGUucmVjb25uZWN0PWZ1bmN0aW9uKCl7aWYodGhpcy5yZWNvbm5lY3Rpbmd8fHRoaXMuc2tpcFJlY29ubmVjdClyZXR1cm4gdGhpczt2YXIgdD10aGlzO2lmKHRoaXMuYmFja29mZi5hdHRlbXB0cz49dGhpcy5fcmVjb25uZWN0aW9uQXR0ZW1wdHMpdGhpcy5iYWNrb2ZmLnJlc2V0KCksdGhpcy5lbWl0QWxsKFwicmVjb25uZWN0X2ZhaWxlZFwiKSx0aGlzLnJlY29ubmVjdGluZz0hMTtlbHNle3ZhciBlPXRoaXMuYmFja29mZi5kdXJhdGlvbigpO3RoaXMucmVjb25uZWN0aW5nPSEwO3ZhciByPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt0LnNraXBSZWNvbm5lY3R8fCh0LmVtaXRBbGwoXCJyZWNvbm5lY3RfYXR0ZW1wdFwiLHQuYmFja29mZi5hdHRlbXB0cyksdC5lbWl0QWxsKFwicmVjb25uZWN0aW5nXCIsdC5iYWNrb2ZmLmF0dGVtcHRzKSx0LnNraXBSZWNvbm5lY3R8fHQub3BlbihmdW5jdGlvbihlKXtlPyh0LnJlY29ubmVjdGluZz0hMSx0LnJlY29ubmVjdCgpLHQuZW1pdEFsbChcInJlY29ubmVjdF9lcnJvclwiLGUuZGF0YSkpOnQub25yZWNvbm5lY3QoKX0pKX0sZSk7dGhpcy5zdWJzLnB1c2goe2Rlc3Ryb3k6ZnVuY3Rpb24oKXtjbGVhclRpbWVvdXQocil9fSl9fSxuLnByb3RvdHlwZS5vbnJlY29ubmVjdD1mdW5jdGlvbigpe3ZhciB0PXRoaXMuYmFja29mZi5hdHRlbXB0czt0aGlzLnJlY29ubmVjdGluZz0hMSx0aGlzLmJhY2tvZmYucmVzZXQoKSx0aGlzLnVwZGF0ZVNvY2tldElkcygpLHRoaXMuZW1pdEFsbChcInJlY29ubmVjdFwiLHQpfX0sZnVuY3Rpb24odCxlLHIpe3QuZXhwb3J0cz1yKDExKSx0LmV4cG9ydHMucGFyc2VyPXIoMTgpfSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0LGUpe3JldHVybiB0aGlzIGluc3RhbmNlb2Ygbj8oZT1lfHx7fSx0JiZcIm9iamVjdFwiPT10eXBlb2YgdCYmKGU9dCx0PW51bGwpLHQ/KHQ9cCh0KSxlLmhvc3RuYW1lPXQuaG9zdCxlLnNlY3VyZT1cImh0dHBzXCI9PT10LnByb3RvY29sfHxcIndzc1wiPT09dC5wcm90b2NvbCxlLnBvcnQ9dC5wb3J0LHQucXVlcnkmJihlLnF1ZXJ5PXQucXVlcnkpKTplLmhvc3QmJihlLmhvc3RuYW1lPXAoZS5ob3N0KS5ob3N0KSx0aGlzLnNlY3VyZT1udWxsIT1lLnNlY3VyZT9lLnNlY3VyZTpcInVuZGVmaW5lZFwiIT10eXBlb2YgbG9jYXRpb24mJlwiaHR0cHM6XCI9PT1sb2NhdGlvbi5wcm90b2NvbCxlLmhvc3RuYW1lJiYhZS5wb3J0JiYoZS5wb3J0PXRoaXMuc2VjdXJlP1wiNDQzXCI6XCI4MFwiKSx0aGlzLmFnZW50PWUuYWdlbnR8fCExLHRoaXMuaG9zdG5hbWU9ZS5ob3N0bmFtZXx8KFwidW5kZWZpbmVkXCIhPXR5cGVvZiBsb2NhdGlvbj9sb2NhdGlvbi5ob3N0bmFtZTpcImxvY2FsaG9zdFwiKSx0aGlzLnBvcnQ9ZS5wb3J0fHwoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIGxvY2F0aW9uJiZsb2NhdGlvbi5wb3J0P2xvY2F0aW9uLnBvcnQ6dGhpcy5zZWN1cmU/NDQzOjgwKSx0aGlzLnF1ZXJ5PWUucXVlcnl8fHt9LFwic3RyaW5nXCI9PXR5cGVvZiB0aGlzLnF1ZXJ5JiYodGhpcy5xdWVyeT1oLmRlY29kZSh0aGlzLnF1ZXJ5KSksdGhpcy51cGdyYWRlPSExIT09ZS51cGdyYWRlLHRoaXMucGF0aD0oZS5wYXRofHxcIi9lbmdpbmUuaW9cIikucmVwbGFjZSgvXFwvJC8sXCJcIikrXCIvXCIsdGhpcy5mb3JjZUpTT05QPSEhZS5mb3JjZUpTT05QLHRoaXMuanNvbnA9ITEhPT1lLmpzb25wLHRoaXMuZm9yY2VCYXNlNjQ9ISFlLmZvcmNlQmFzZTY0LHRoaXMuZW5hYmxlc1hEUj0hIWUuZW5hYmxlc1hEUix0aGlzLnRpbWVzdGFtcFBhcmFtPWUudGltZXN0YW1wUGFyYW18fFwidFwiLHRoaXMudGltZXN0YW1wUmVxdWVzdHM9ZS50aW1lc3RhbXBSZXF1ZXN0cyx0aGlzLnRyYW5zcG9ydHM9ZS50cmFuc3BvcnRzfHxbXCJwb2xsaW5nXCIsXCJ3ZWJzb2NrZXRcIl0sdGhpcy50cmFuc3BvcnRPcHRpb25zPWUudHJhbnNwb3J0T3B0aW9uc3x8e30sdGhpcy5yZWFkeVN0YXRlPVwiXCIsdGhpcy53cml0ZUJ1ZmZlcj1bXSx0aGlzLnByZXZCdWZmZXJMZW49MCx0aGlzLnBvbGljeVBvcnQ9ZS5wb2xpY3lQb3J0fHw4NDMsdGhpcy5yZW1lbWJlclVwZ3JhZGU9ZS5yZW1lbWJlclVwZ3JhZGV8fCExLHRoaXMuYmluYXJ5VHlwZT1udWxsLHRoaXMub25seUJpbmFyeVVwZ3JhZGVzPWUub25seUJpbmFyeVVwZ3JhZGVzLHRoaXMucGVyTWVzc2FnZURlZmxhdGU9ITEhPT1lLnBlck1lc3NhZ2VEZWZsYXRlJiYoZS5wZXJNZXNzYWdlRGVmbGF0ZXx8e30pLCEwPT09dGhpcy5wZXJNZXNzYWdlRGVmbGF0ZSYmKHRoaXMucGVyTWVzc2FnZURlZmxhdGU9e30pLHRoaXMucGVyTWVzc2FnZURlZmxhdGUmJm51bGw9PXRoaXMucGVyTWVzc2FnZURlZmxhdGUudGhyZXNob2xkJiYodGhpcy5wZXJNZXNzYWdlRGVmbGF0ZS50aHJlc2hvbGQ9MTAyNCksdGhpcy5wZng9ZS5wZnh8fG51bGwsdGhpcy5rZXk9ZS5rZXl8fG51bGwsdGhpcy5wYXNzcGhyYXNlPWUucGFzc3BocmFzZXx8bnVsbCx0aGlzLmNlcnQ9ZS5jZXJ0fHxudWxsLHRoaXMuY2E9ZS5jYXx8bnVsbCx0aGlzLmNpcGhlcnM9ZS5jaXBoZXJzfHxudWxsLHRoaXMucmVqZWN0VW5hdXRob3JpemVkPXZvaWQgMD09PWUucmVqZWN0VW5hdXRob3JpemVkfHxlLnJlamVjdFVuYXV0aG9yaXplZCx0aGlzLmZvcmNlTm9kZT0hIWUuZm9yY2VOb2RlLHRoaXMuaXNSZWFjdE5hdGl2ZT1cInVuZGVmaW5lZFwiIT10eXBlb2YgbmF2aWdhdG9yJiZcInN0cmluZ1wiPT10eXBlb2YgbmF2aWdhdG9yLnByb2R1Y3QmJlwicmVhY3RuYXRpdmVcIj09PW5hdmlnYXRvci5wcm9kdWN0LnRvTG93ZXJDYXNlKCksKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBzZWxmfHx0aGlzLmlzUmVhY3ROYXRpdmUpJiYoZS5leHRyYUhlYWRlcnMmJk9iamVjdC5rZXlzKGUuZXh0cmFIZWFkZXJzKS5sZW5ndGg+MCYmKHRoaXMuZXh0cmFIZWFkZXJzPWUuZXh0cmFIZWFkZXJzKSxlLmxvY2FsQWRkcmVzcyYmKHRoaXMubG9jYWxBZGRyZXNzPWUubG9jYWxBZGRyZXNzKSksdGhpcy5pZD1udWxsLHRoaXMudXBncmFkZXM9bnVsbCx0aGlzLnBpbmdJbnRlcnZhbD1udWxsLHRoaXMucGluZ1RpbWVvdXQ9bnVsbCx0aGlzLnBpbmdJbnRlcnZhbFRpbWVyPW51bGwsdGhpcy5waW5nVGltZW91dFRpbWVyPW51bGwsdm9pZCB0aGlzLm9wZW4oKSk6bmV3IG4odCxlKX1mdW5jdGlvbiBvKHQpe3ZhciBlPXt9O2Zvcih2YXIgciBpbiB0KXQuaGFzT3duUHJvcGVydHkocikmJihlW3JdPXRbcl0pO3JldHVybiBlfXZhciBpPXIoMTIpLHM9cig1KSxhPShyKDMpKFwiZW5naW5lLmlvLWNsaWVudDpzb2NrZXRcIikscigzMikpLGM9cigxOCkscD1yKDIpLGg9cigyNik7dC5leHBvcnRzPW4sbi5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9ITEscyhuLnByb3RvdHlwZSksbi5wcm90b2NvbD1jLnByb3RvY29sLG4uU29ja2V0PW4sbi5UcmFuc3BvcnQ9cigxNyksbi50cmFuc3BvcnRzPXIoMTIpLG4ucGFyc2VyPXIoMTgpLG4ucHJvdG90eXBlLmNyZWF0ZVRyYW5zcG9ydD1mdW5jdGlvbih0KXt2YXIgZT1vKHRoaXMucXVlcnkpO2UuRUlPPWMucHJvdG9jb2wsZS50cmFuc3BvcnQ9dDt2YXIgcj10aGlzLnRyYW5zcG9ydE9wdGlvbnNbdF18fHt9O3RoaXMuaWQmJihlLnNpZD10aGlzLmlkKTt2YXIgbj1uZXcgaVt0XSh7cXVlcnk6ZSxzb2NrZXQ6dGhpcyxhZ2VudDpyLmFnZW50fHx0aGlzLmFnZW50LGhvc3RuYW1lOnIuaG9zdG5hbWV8fHRoaXMuaG9zdG5hbWUscG9ydDpyLnBvcnR8fHRoaXMucG9ydCxzZWN1cmU6ci5zZWN1cmV8fHRoaXMuc2VjdXJlLHBhdGg6ci5wYXRofHx0aGlzLnBhdGgsZm9yY2VKU09OUDpyLmZvcmNlSlNPTlB8fHRoaXMuZm9yY2VKU09OUCxqc29ucDpyLmpzb25wfHx0aGlzLmpzb25wLGZvcmNlQmFzZTY0OnIuZm9yY2VCYXNlNjR8fHRoaXMuZm9yY2VCYXNlNjQsZW5hYmxlc1hEUjpyLmVuYWJsZXNYRFJ8fHRoaXMuZW5hYmxlc1hEUix0aW1lc3RhbXBSZXF1ZXN0czpyLnRpbWVzdGFtcFJlcXVlc3RzfHx0aGlzLnRpbWVzdGFtcFJlcXVlc3RzLHRpbWVzdGFtcFBhcmFtOnIudGltZXN0YW1wUGFyYW18fHRoaXMudGltZXN0YW1wUGFyYW0scG9saWN5UG9ydDpyLnBvbGljeVBvcnR8fHRoaXMucG9saWN5UG9ydCxwZng6ci5wZnh8fHRoaXMucGZ4LGtleTpyLmtleXx8dGhpcy5rZXkscGFzc3BocmFzZTpyLnBhc3NwaHJhc2V8fHRoaXMucGFzc3BocmFzZSxjZXJ0OnIuY2VydHx8dGhpcy5jZXJ0LGNhOnIuY2F8fHRoaXMuY2EsY2lwaGVyczpyLmNpcGhlcnN8fHRoaXMuY2lwaGVycyxyZWplY3RVbmF1dGhvcml6ZWQ6ci5yZWplY3RVbmF1dGhvcml6ZWR8fHRoaXMucmVqZWN0VW5hdXRob3JpemVkLHBlck1lc3NhZ2VEZWZsYXRlOnIucGVyTWVzc2FnZURlZmxhdGV8fHRoaXMucGVyTWVzc2FnZURlZmxhdGUsZXh0cmFIZWFkZXJzOnIuZXh0cmFIZWFkZXJzfHx0aGlzLmV4dHJhSGVhZGVycyxmb3JjZU5vZGU6ci5mb3JjZU5vZGV8fHRoaXMuZm9yY2VOb2RlLGxvY2FsQWRkcmVzczpyLmxvY2FsQWRkcmVzc3x8dGhpcy5sb2NhbEFkZHJlc3MscmVxdWVzdFRpbWVvdXQ6ci5yZXF1ZXN0VGltZW91dHx8dGhpcy5yZXF1ZXN0VGltZW91dCxwcm90b2NvbHM6ci5wcm90b2NvbHN8fHZvaWQgMCxpc1JlYWN0TmF0aXZlOnRoaXMuaXNSZWFjdE5hdGl2ZX0pO3JldHVybiBufSxuLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKCl7dmFyIHQ7aWYodGhpcy5yZW1lbWJlclVwZ3JhZGUmJm4ucHJpb3JXZWJzb2NrZXRTdWNjZXNzJiZ0aGlzLnRyYW5zcG9ydHMuaW5kZXhPZihcIndlYnNvY2tldFwiKSE9PS0xKXQ9XCJ3ZWJzb2NrZXRcIjtlbHNle2lmKDA9PT10aGlzLnRyYW5zcG9ydHMubGVuZ3RoKXt2YXIgZT10aGlzO3JldHVybiB2b2lkIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLmVtaXQoXCJlcnJvclwiLFwiTm8gdHJhbnNwb3J0cyBhdmFpbGFibGVcIil9LDApfXQ9dGhpcy50cmFuc3BvcnRzWzBdfXRoaXMucmVhZHlTdGF0ZT1cIm9wZW5pbmdcIjt0cnl7dD10aGlzLmNyZWF0ZVRyYW5zcG9ydCh0KX1jYXRjaCh0KXtyZXR1cm4gdGhpcy50cmFuc3BvcnRzLnNoaWZ0KCksdm9pZCB0aGlzLm9wZW4oKX10Lm9wZW4oKSx0aGlzLnNldFRyYW5zcG9ydCh0KX0sbi5wcm90b3R5cGUuc2V0VHJhbnNwb3J0PWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXM7dGhpcy50cmFuc3BvcnQmJnRoaXMudHJhbnNwb3J0LnJlbW92ZUFsbExpc3RlbmVycygpLHRoaXMudHJhbnNwb3J0PXQsdC5vbihcImRyYWluXCIsZnVuY3Rpb24oKXtlLm9uRHJhaW4oKX0pLm9uKFwicGFja2V0XCIsZnVuY3Rpb24odCl7ZS5vblBhY2tldCh0KX0pLm9uKFwiZXJyb3JcIixmdW5jdGlvbih0KXtlLm9uRXJyb3IodCl9KS5vbihcImNsb3NlXCIsZnVuY3Rpb24oKXtlLm9uQ2xvc2UoXCJ0cmFuc3BvcnQgY2xvc2VcIil9KX0sbi5wcm90b3R5cGUucHJvYmU9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSgpe2lmKHUub25seUJpbmFyeVVwZ3JhZGVzKXt2YXIgdD0hdGhpcy5zdXBwb3J0c0JpbmFyeSYmdS50cmFuc3BvcnQuc3VwcG9ydHNCaW5hcnk7aD1ofHx0fWh8fChwLnNlbmQoW3t0eXBlOlwicGluZ1wiLGRhdGE6XCJwcm9iZVwifV0pLHAub25jZShcInBhY2tldFwiLGZ1bmN0aW9uKHQpe2lmKCFoKWlmKFwicG9uZ1wiPT09dC50eXBlJiZcInByb2JlXCI9PT10LmRhdGEpe2lmKHUudXBncmFkaW5nPSEwLHUuZW1pdChcInVwZ3JhZGluZ1wiLHApLCFwKXJldHVybjtuLnByaW9yV2Vic29ja2V0U3VjY2Vzcz1cIndlYnNvY2tldFwiPT09cC5uYW1lLHUudHJhbnNwb3J0LnBhdXNlKGZ1bmN0aW9uKCl7aHx8XCJjbG9zZWRcIiE9PXUucmVhZHlTdGF0ZSYmKGMoKSx1LnNldFRyYW5zcG9ydChwKSxwLnNlbmQoW3t0eXBlOlwidXBncmFkZVwifV0pLHUuZW1pdChcInVwZ3JhZGVcIixwKSxwPW51bGwsdS51cGdyYWRpbmc9ITEsdS5mbHVzaCgpKX0pfWVsc2V7dmFyIGU9bmV3IEVycm9yKFwicHJvYmUgZXJyb3JcIik7ZS50cmFuc3BvcnQ9cC5uYW1lLHUuZW1pdChcInVwZ3JhZGVFcnJvclwiLGUpfX0pKX1mdW5jdGlvbiByKCl7aHx8KGg9ITAsYygpLHAuY2xvc2UoKSxwPW51bGwpfWZ1bmN0aW9uIG8odCl7dmFyIGU9bmV3IEVycm9yKFwicHJvYmUgZXJyb3I6IFwiK3QpO2UudHJhbnNwb3J0PXAubmFtZSxyKCksdS5lbWl0KFwidXBncmFkZUVycm9yXCIsZSl9ZnVuY3Rpb24gaSgpe28oXCJ0cmFuc3BvcnQgY2xvc2VkXCIpfWZ1bmN0aW9uIHMoKXtvKFwic29ja2V0IGNsb3NlZFwiKX1mdW5jdGlvbiBhKHQpe3AmJnQubmFtZSE9PXAubmFtZSYmcigpfWZ1bmN0aW9uIGMoKXtwLnJlbW92ZUxpc3RlbmVyKFwib3BlblwiLGUpLHAucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLG8pLHAucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLGkpLHUucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLHMpLHUucmVtb3ZlTGlzdGVuZXIoXCJ1cGdyYWRpbmdcIixhKX12YXIgcD10aGlzLmNyZWF0ZVRyYW5zcG9ydCh0LHtwcm9iZToxfSksaD0hMSx1PXRoaXM7bi5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9ITEscC5vbmNlKFwib3BlblwiLGUpLHAub25jZShcImVycm9yXCIsbykscC5vbmNlKFwiY2xvc2VcIixpKSx0aGlzLm9uY2UoXCJjbG9zZVwiLHMpLHRoaXMub25jZShcInVwZ3JhZGluZ1wiLGEpLHAub3BlbigpfSxuLnByb3RvdHlwZS5vbk9wZW49ZnVuY3Rpb24oKXtpZih0aGlzLnJlYWR5U3RhdGU9XCJvcGVuXCIsbi5wcmlvcldlYnNvY2tldFN1Y2Nlc3M9XCJ3ZWJzb2NrZXRcIj09PXRoaXMudHJhbnNwb3J0Lm5hbWUsdGhpcy5lbWl0KFwib3BlblwiKSx0aGlzLmZsdXNoKCksXCJvcGVuXCI9PT10aGlzLnJlYWR5U3RhdGUmJnRoaXMudXBncmFkZSYmdGhpcy50cmFuc3BvcnQucGF1c2UpZm9yKHZhciB0PTAsZT10aGlzLnVwZ3JhZGVzLmxlbmd0aDt0PGU7dCsrKXRoaXMucHJvYmUodGhpcy51cGdyYWRlc1t0XSl9LG4ucHJvdG90eXBlLm9uUGFja2V0PWZ1bmN0aW9uKHQpe2lmKFwib3BlbmluZ1wiPT09dGhpcy5yZWFkeVN0YXRlfHxcIm9wZW5cIj09PXRoaXMucmVhZHlTdGF0ZXx8XCJjbG9zaW5nXCI9PT10aGlzLnJlYWR5U3RhdGUpc3dpdGNoKHRoaXMuZW1pdChcInBhY2tldFwiLHQpLHRoaXMuZW1pdChcImhlYXJ0YmVhdFwiKSx0LnR5cGUpe2Nhc2VcIm9wZW5cIjp0aGlzLm9uSGFuZHNoYWtlKEpTT04ucGFyc2UodC5kYXRhKSk7YnJlYWs7Y2FzZVwicG9uZ1wiOnRoaXMuc2V0UGluZygpLHRoaXMuZW1pdChcInBvbmdcIik7YnJlYWs7Y2FzZVwiZXJyb3JcIjp2YXIgZT1uZXcgRXJyb3IoXCJzZXJ2ZXIgZXJyb3JcIik7ZS5jb2RlPXQuZGF0YSx0aGlzLm9uRXJyb3IoZSk7YnJlYWs7Y2FzZVwibWVzc2FnZVwiOnRoaXMuZW1pdChcImRhdGFcIix0LmRhdGEpLHRoaXMuZW1pdChcIm1lc3NhZ2VcIix0LmRhdGEpfX0sbi5wcm90b3R5cGUub25IYW5kc2hha2U9ZnVuY3Rpb24odCl7dGhpcy5lbWl0KFwiaGFuZHNoYWtlXCIsdCksdGhpcy5pZD10LnNpZCx0aGlzLnRyYW5zcG9ydC5xdWVyeS5zaWQ9dC5zaWQsdGhpcy51cGdyYWRlcz10aGlzLmZpbHRlclVwZ3JhZGVzKHQudXBncmFkZXMpLHRoaXMucGluZ0ludGVydmFsPXQucGluZ0ludGVydmFsLHRoaXMucGluZ1RpbWVvdXQ9dC5waW5nVGltZW91dCx0aGlzLm9uT3BlbigpLFwiY2xvc2VkXCIhPT10aGlzLnJlYWR5U3RhdGUmJih0aGlzLnNldFBpbmcoKSx0aGlzLnJlbW92ZUxpc3RlbmVyKFwiaGVhcnRiZWF0XCIsdGhpcy5vbkhlYXJ0YmVhdCksdGhpcy5vbihcImhlYXJ0YmVhdFwiLHRoaXMub25IZWFydGJlYXQpKX0sbi5wcm90b3R5cGUub25IZWFydGJlYXQ9ZnVuY3Rpb24odCl7Y2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXRUaW1lcik7dmFyIGU9dGhpcztlLnBpbmdUaW1lb3V0VGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe1wiY2xvc2VkXCIhPT1lLnJlYWR5U3RhdGUmJmUub25DbG9zZShcInBpbmcgdGltZW91dFwiKX0sdHx8ZS5waW5nSW50ZXJ2YWwrZS5waW5nVGltZW91dCl9LG4ucHJvdG90eXBlLnNldFBpbmc9ZnVuY3Rpb24oKXt2YXIgdD10aGlzO2NsZWFyVGltZW91dCh0LnBpbmdJbnRlcnZhbFRpbWVyKSx0LnBpbmdJbnRlcnZhbFRpbWVyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt0LnBpbmcoKSx0Lm9uSGVhcnRiZWF0KHQucGluZ1RpbWVvdXQpfSx0LnBpbmdJbnRlcnZhbCl9LG4ucHJvdG90eXBlLnBpbmc9ZnVuY3Rpb24oKXt2YXIgdD10aGlzO3RoaXMuc2VuZFBhY2tldChcInBpbmdcIixmdW5jdGlvbigpe3QuZW1pdChcInBpbmdcIil9KX0sbi5wcm90b3R5cGUub25EcmFpbj1mdW5jdGlvbigpe3RoaXMud3JpdGVCdWZmZXIuc3BsaWNlKDAsdGhpcy5wcmV2QnVmZmVyTGVuKSx0aGlzLnByZXZCdWZmZXJMZW49MCwwPT09dGhpcy53cml0ZUJ1ZmZlci5sZW5ndGg/dGhpcy5lbWl0KFwiZHJhaW5cIik6dGhpcy5mbHVzaCgpfSxuLnByb3RvdHlwZS5mbHVzaD1mdW5jdGlvbigpe1wiY2xvc2VkXCIhPT10aGlzLnJlYWR5U3RhdGUmJnRoaXMudHJhbnNwb3J0LndyaXRhYmxlJiYhdGhpcy51cGdyYWRpbmcmJnRoaXMud3JpdGVCdWZmZXIubGVuZ3RoJiYodGhpcy50cmFuc3BvcnQuc2VuZCh0aGlzLndyaXRlQnVmZmVyKSx0aGlzLnByZXZCdWZmZXJMZW49dGhpcy53cml0ZUJ1ZmZlci5sZW5ndGgsdGhpcy5lbWl0KFwiZmx1c2hcIikpfSxuLnByb3RvdHlwZS53cml0ZT1uLnByb3RvdHlwZS5zZW5kPWZ1bmN0aW9uKHQsZSxyKXtyZXR1cm4gdGhpcy5zZW5kUGFja2V0KFwibWVzc2FnZVwiLHQsZSxyKSx0aGlzfSxuLnByb3RvdHlwZS5zZW5kUGFja2V0PWZ1bmN0aW9uKHQsZSxyLG4pe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJihuPWUsZT12b2lkIDApLFwiZnVuY3Rpb25cIj09dHlwZW9mIHImJihuPXIscj1udWxsKSxcImNsb3NpbmdcIiE9PXRoaXMucmVhZHlTdGF0ZSYmXCJjbG9zZWRcIiE9PXRoaXMucmVhZHlTdGF0ZSl7cj1yfHx7fSxyLmNvbXByZXNzPSExIT09ci5jb21wcmVzczt2YXIgbz17dHlwZTp0LGRhdGE6ZSxvcHRpb25zOnJ9O3RoaXMuZW1pdChcInBhY2tldENyZWF0ZVwiLG8pLHRoaXMud3JpdGVCdWZmZXIucHVzaChvKSxuJiZ0aGlzLm9uY2UoXCJmbHVzaFwiLG4pLHRoaXMuZmx1c2goKX19LG4ucHJvdG90eXBlLmNsb3NlPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe24ub25DbG9zZShcImZvcmNlZCBjbG9zZVwiKSxuLnRyYW5zcG9ydC5jbG9zZSgpfWZ1bmN0aW9uIGUoKXtuLnJlbW92ZUxpc3RlbmVyKFwidXBncmFkZVwiLGUpLG4ucmVtb3ZlTGlzdGVuZXIoXCJ1cGdyYWRlRXJyb3JcIixlKSx0KCl9ZnVuY3Rpb24gcigpe24ub25jZShcInVwZ3JhZGVcIixlKSxuLm9uY2UoXCJ1cGdyYWRlRXJyb3JcIixlKX1pZihcIm9wZW5pbmdcIj09PXRoaXMucmVhZHlTdGF0ZXx8XCJvcGVuXCI9PT10aGlzLnJlYWR5U3RhdGUpe3RoaXMucmVhZHlTdGF0ZT1cImNsb3NpbmdcIjt2YXIgbj10aGlzO3RoaXMud3JpdGVCdWZmZXIubGVuZ3RoP3RoaXMub25jZShcImRyYWluXCIsZnVuY3Rpb24oKXt0aGlzLnVwZ3JhZGluZz9yKCk6dCgpfSk6dGhpcy51cGdyYWRpbmc/cigpOnQoKX1yZXR1cm4gdGhpc30sbi5wcm90b3R5cGUub25FcnJvcj1mdW5jdGlvbih0KXtuLnByaW9yV2Vic29ja2V0U3VjY2Vzcz0hMSx0aGlzLmVtaXQoXCJlcnJvclwiLHQpLHRoaXMub25DbG9zZShcInRyYW5zcG9ydCBlcnJvclwiLHQpfSxuLnByb3RvdHlwZS5vbkNsb3NlPWZ1bmN0aW9uKHQsZSl7aWYoXCJvcGVuaW5nXCI9PT10aGlzLnJlYWR5U3RhdGV8fFwib3BlblwiPT09dGhpcy5yZWFkeVN0YXRlfHxcImNsb3NpbmdcIj09PXRoaXMucmVhZHlTdGF0ZSl7dmFyIHI9dGhpcztjbGVhclRpbWVvdXQodGhpcy5waW5nSW50ZXJ2YWxUaW1lciksY2xlYXJUaW1lb3V0KHRoaXMucGluZ1RpbWVvdXRUaW1lciksdGhpcy50cmFuc3BvcnQucmVtb3ZlQWxsTGlzdGVuZXJzKFwiY2xvc2VcIiksdGhpcy50cmFuc3BvcnQuY2xvc2UoKSx0aGlzLnRyYW5zcG9ydC5yZW1vdmVBbGxMaXN0ZW5lcnMoKSx0aGlzLnJlYWR5U3RhdGU9XCJjbG9zZWRcIix0aGlzLmlkPW51bGwsdGhpcy5lbWl0KFwiY2xvc2VcIix0LGUpLHIud3JpdGVCdWZmZXI9W10sci5wcmV2QnVmZmVyTGVuPTB9fSxuLnByb3RvdHlwZS5maWx0ZXJVcGdyYWRlcz1mdW5jdGlvbih0KXtmb3IodmFyIGU9W10scj0wLG49dC5sZW5ndGg7cjxuO3IrKyl+YSh0aGlzLnRyYW5zcG9ydHMsdFtyXSkmJmUucHVzaCh0W3JdKTtyZXR1cm4gZX19LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3ZhciBlLHI9ITEsbj0hMSxhPSExIT09dC5qc29ucDtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgbG9jYXRpb24pe3ZhciBjPVwiaHR0cHM6XCI9PT1sb2NhdGlvbi5wcm90b2NvbCxwPWxvY2F0aW9uLnBvcnQ7cHx8KHA9Yz80NDM6ODApLHI9dC5ob3N0bmFtZSE9PWxvY2F0aW9uLmhvc3RuYW1lfHxwIT09dC5wb3J0LG49dC5zZWN1cmUhPT1jfWlmKHQueGRvbWFpbj1yLHQueHNjaGVtZT1uLGU9bmV3IG8odCksXCJvcGVuXCJpbiBlJiYhdC5mb3JjZUpTT05QKXJldHVybiBuZXcgaSh0KTtpZighYSl0aHJvdyBuZXcgRXJyb3IoXCJKU09OUCBkaXNhYmxlZFwiKTtyZXR1cm4gbmV3IHModCl9dmFyIG89cigxMyksaT1yKDE1KSxzPXIoMjkpLGE9cigzMCk7ZS5wb2xsaW5nPW4sZS53ZWJzb2NrZXQ9YX0sZnVuY3Rpb24odCxlLHIpe3ZhciBuPXIoMTQpO3QuZXhwb3J0cz1mdW5jdGlvbih0KXt2YXIgZT10Lnhkb21haW4scj10LnhzY2hlbWUsbz10LmVuYWJsZXNYRFI7dHJ5e2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBYTUxIdHRwUmVxdWVzdCYmKCFlfHxuKSlyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0fWNhdGNoKHQpe310cnl7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFhEb21haW5SZXF1ZXN0JiYhciYmbylyZXR1cm4gbmV3IFhEb21haW5SZXF1ZXN0fWNhdGNoKHQpe31pZighZSl0cnl7cmV0dXJuIG5ldyhzZWxmW1tcIkFjdGl2ZVwiXS5jb25jYXQoXCJPYmplY3RcIikuam9pbihcIlhcIildKShcIk1pY3Jvc29mdC5YTUxIVFRQXCIpfWNhdGNoKHQpe319fSxmdW5jdGlvbih0LGUpe3RyeXt0LmV4cG9ydHM9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFhNTEh0dHBSZXF1ZXN0JiZcIndpdGhDcmVkZW50aWFsc1wiaW4gbmV3IFhNTEh0dHBSZXF1ZXN0fWNhdGNoKGUpe3QuZXhwb3J0cz0hMX19LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKCl7fWZ1bmN0aW9uIG8odCl7aWYoYy5jYWxsKHRoaXMsdCksdGhpcy5yZXF1ZXN0VGltZW91dD10LnJlcXVlc3RUaW1lb3V0LHRoaXMuZXh0cmFIZWFkZXJzPXQuZXh0cmFIZWFkZXJzLFwidW5kZWZpbmVkXCIhPXR5cGVvZiBsb2NhdGlvbil7dmFyIGU9XCJodHRwczpcIj09PWxvY2F0aW9uLnByb3RvY29sLHI9bG9jYXRpb24ucG9ydDtyfHwocj1lPzQ0Mzo4MCksdGhpcy54ZD1cInVuZGVmaW5lZFwiIT10eXBlb2YgbG9jYXRpb24mJnQuaG9zdG5hbWUhPT1sb2NhdGlvbi5ob3N0bmFtZXx8ciE9PXQucG9ydCx0aGlzLnhzPXQuc2VjdXJlIT09ZX19ZnVuY3Rpb24gaSh0KXt0aGlzLm1ldGhvZD10Lm1ldGhvZHx8XCJHRVRcIix0aGlzLnVyaT10LnVyaSx0aGlzLnhkPSEhdC54ZCx0aGlzLnhzPSEhdC54cyx0aGlzLmFzeW5jPSExIT09dC5hc3luYyx0aGlzLmRhdGE9dm9pZCAwIT09dC5kYXRhP3QuZGF0YTpudWxsLHRoaXMuYWdlbnQ9dC5hZ2VudCx0aGlzLmlzQmluYXJ5PXQuaXNCaW5hcnksdGhpcy5zdXBwb3J0c0JpbmFyeT10LnN1cHBvcnRzQmluYXJ5LHRoaXMuZW5hYmxlc1hEUj10LmVuYWJsZXNYRFIsdGhpcy5yZXF1ZXN0VGltZW91dD10LnJlcXVlc3RUaW1lb3V0LHRoaXMucGZ4PXQucGZ4LHRoaXMua2V5PXQua2V5LHRoaXMucGFzc3BocmFzZT10LnBhc3NwaHJhc2UsdGhpcy5jZXJ0PXQuY2VydCx0aGlzLmNhPXQuY2EsdGhpcy5jaXBoZXJzPXQuY2lwaGVycyx0aGlzLnJlamVjdFVuYXV0aG9yaXplZD10LnJlamVjdFVuYXV0aG9yaXplZCx0aGlzLmV4dHJhSGVhZGVycz10LmV4dHJhSGVhZGVycyx0aGlzLmNyZWF0ZSgpfWZ1bmN0aW9uIHMoKXtmb3IodmFyIHQgaW4gaS5yZXF1ZXN0cylpLnJlcXVlc3RzLmhhc093blByb3BlcnR5KHQpJiZpLnJlcXVlc3RzW3RdLmFib3J0KCl9dmFyIGE9cigxMyksYz1yKDE2KSxwPXIoNSksaD1yKDI3KTtyKDMpKFwiZW5naW5lLmlvLWNsaWVudDpwb2xsaW5nLXhoclwiKTtpZih0LmV4cG9ydHM9byx0LmV4cG9ydHMuUmVxdWVzdD1pLGgobyxjKSxvLnByb3RvdHlwZS5zdXBwb3J0c0JpbmFyeT0hMCxvLnByb3RvdHlwZS5yZXF1ZXN0PWZ1bmN0aW9uKHQpe3JldHVybiB0PXR8fHt9LHQudXJpPXRoaXMudXJpKCksdC54ZD10aGlzLnhkLHQueHM9dGhpcy54cyx0LmFnZW50PXRoaXMuYWdlbnR8fCExLHQuc3VwcG9ydHNCaW5hcnk9dGhpcy5zdXBwb3J0c0JpbmFyeSx0LmVuYWJsZXNYRFI9dGhpcy5lbmFibGVzWERSLHQucGZ4PXRoaXMucGZ4LHQua2V5PXRoaXMua2V5LHQucGFzc3BocmFzZT10aGlzLnBhc3NwaHJhc2UsdC5jZXJ0PXRoaXMuY2VydCx0LmNhPXRoaXMuY2EsdC5jaXBoZXJzPXRoaXMuY2lwaGVycyx0LnJlamVjdFVuYXV0aG9yaXplZD10aGlzLnJlamVjdFVuYXV0aG9yaXplZCx0LnJlcXVlc3RUaW1lb3V0PXRoaXMucmVxdWVzdFRpbWVvdXQsdC5leHRyYUhlYWRlcnM9dGhpcy5leHRyYUhlYWRlcnMsbmV3IGkodCl9LG8ucHJvdG90eXBlLmRvV3JpdGU9ZnVuY3Rpb24odCxlKXt2YXIgcj1cInN0cmluZ1wiIT10eXBlb2YgdCYmdm9pZCAwIT09dCxuPXRoaXMucmVxdWVzdCh7bWV0aG9kOlwiUE9TVFwiLGRhdGE6dCxpc0JpbmFyeTpyfSksbz10aGlzO24ub24oXCJzdWNjZXNzXCIsZSksbi5vbihcImVycm9yXCIsZnVuY3Rpb24odCl7by5vbkVycm9yKFwieGhyIHBvc3QgZXJyb3JcIix0KX0pLHRoaXMuc2VuZFhocj1ufSxvLnByb3RvdHlwZS5kb1BvbGw9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnJlcXVlc3QoKSxlPXRoaXM7dC5vbihcImRhdGFcIixmdW5jdGlvbih0KXtlLm9uRGF0YSh0KX0pLHQub24oXCJlcnJvclwiLGZ1bmN0aW9uKHQpe2Uub25FcnJvcihcInhociBwb2xsIGVycm9yXCIsdCl9KSx0aGlzLnBvbGxYaHI9dH0scChpLnByb3RvdHlwZSksaS5wcm90b3R5cGUuY3JlYXRlPWZ1bmN0aW9uKCl7dmFyIHQ9e2FnZW50OnRoaXMuYWdlbnQseGRvbWFpbjp0aGlzLnhkLHhzY2hlbWU6dGhpcy54cyxlbmFibGVzWERSOnRoaXMuZW5hYmxlc1hEUn07dC5wZng9dGhpcy5wZngsdC5rZXk9dGhpcy5rZXksdC5wYXNzcGhyYXNlPXRoaXMucGFzc3BocmFzZSx0LmNlcnQ9dGhpcy5jZXJ0LHQuY2E9dGhpcy5jYSx0LmNpcGhlcnM9dGhpcy5jaXBoZXJzLHQucmVqZWN0VW5hdXRob3JpemVkPXRoaXMucmVqZWN0VW5hdXRob3JpemVkO3ZhciBlPXRoaXMueGhyPW5ldyBhKHQpLHI9dGhpczt0cnl7ZS5vcGVuKHRoaXMubWV0aG9kLHRoaXMudXJpLHRoaXMuYXN5bmMpO3RyeXtpZih0aGlzLmV4dHJhSGVhZGVycyl7ZS5zZXREaXNhYmxlSGVhZGVyQ2hlY2smJmUuc2V0RGlzYWJsZUhlYWRlckNoZWNrKCEwKTtmb3IodmFyIG4gaW4gdGhpcy5leHRyYUhlYWRlcnMpdGhpcy5leHRyYUhlYWRlcnMuaGFzT3duUHJvcGVydHkobikmJmUuc2V0UmVxdWVzdEhlYWRlcihuLHRoaXMuZXh0cmFIZWFkZXJzW25dKX19Y2F0Y2godCl7fWlmKFwiUE9TVFwiPT09dGhpcy5tZXRob2QpdHJ5e3RoaXMuaXNCaW5hcnk/ZS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIik6ZS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC10eXBlXCIsXCJ0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLThcIil9Y2F0Y2godCl7fXRyeXtlLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIixcIiovKlwiKX1jYXRjaCh0KXt9XCJ3aXRoQ3JlZGVudGlhbHNcImluIGUmJihlLndpdGhDcmVkZW50aWFscz0hMCksdGhpcy5yZXF1ZXN0VGltZW91dCYmKGUudGltZW91dD10aGlzLnJlcXVlc3RUaW1lb3V0KSx0aGlzLmhhc1hEUigpPyhlLm9ubG9hZD1mdW5jdGlvbigpe3Iub25Mb2FkKCl9LGUub25lcnJvcj1mdW5jdGlvbigpe3Iub25FcnJvcihlLnJlc3BvbnNlVGV4dCl9KTplLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2lmKDI9PT1lLnJlYWR5U3RhdGUpdHJ5e3ZhciB0PWUuZ2V0UmVzcG9uc2VIZWFkZXIoXCJDb250ZW50LVR5cGVcIik7ci5zdXBwb3J0c0JpbmFyeSYmXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIj09PXQmJihlLnJlc3BvbnNlVHlwZT1cImFycmF5YnVmZmVyXCIpfWNhdGNoKHQpe300PT09ZS5yZWFkeVN0YXRlJiYoMjAwPT09ZS5zdGF0dXN8fDEyMjM9PT1lLnN0YXR1cz9yLm9uTG9hZCgpOnNldFRpbWVvdXQoZnVuY3Rpb24oKXtyLm9uRXJyb3IoZS5zdGF0dXMpfSwwKSl9LGUuc2VuZCh0aGlzLmRhdGEpfWNhdGNoKHQpe3JldHVybiB2b2lkIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtyLm9uRXJyb3IodCl9LDApfVwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCYmKHRoaXMuaW5kZXg9aS5yZXF1ZXN0c0NvdW50KyssaS5yZXF1ZXN0c1t0aGlzLmluZGV4XT10aGlzKX0saS5wcm90b3R5cGUub25TdWNjZXNzPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwic3VjY2Vzc1wiKSx0aGlzLmNsZWFudXAoKX0saS5wcm90b3R5cGUub25EYXRhPWZ1bmN0aW9uKHQpe3RoaXMuZW1pdChcImRhdGFcIix0KSx0aGlzLm9uU3VjY2VzcygpfSxpLnByb3RvdHlwZS5vbkVycm9yPWZ1bmN0aW9uKHQpe3RoaXMuZW1pdChcImVycm9yXCIsdCksdGhpcy5jbGVhbnVwKCEwKX0saS5wcm90b3R5cGUuY2xlYW51cD1mdW5jdGlvbih0KXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgdGhpcy54aHImJm51bGwhPT10aGlzLnhocil7aWYodGhpcy5oYXNYRFIoKT90aGlzLnhoci5vbmxvYWQ9dGhpcy54aHIub25lcnJvcj1uOnRoaXMueGhyLm9ucmVhZHlzdGF0ZWNoYW5nZT1uLHQpdHJ5e3RoaXMueGhyLmFib3J0KCl9Y2F0Y2godCl7fVwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCYmZGVsZXRlIGkucmVxdWVzdHNbdGhpcy5pbmRleF0sdGhpcy54aHI9bnVsbH19LGkucHJvdG90eXBlLm9uTG9hZD1mdW5jdGlvbigpe3ZhciB0O3RyeXt2YXIgZTt0cnl7ZT10aGlzLnhoci5nZXRSZXNwb25zZUhlYWRlcihcIkNvbnRlbnQtVHlwZVwiKX1jYXRjaCh0KXt9dD1cImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiPT09ZT90aGlzLnhoci5yZXNwb25zZXx8dGhpcy54aHIucmVzcG9uc2VUZXh0OnRoaXMueGhyLnJlc3BvbnNlVGV4dH1jYXRjaCh0KXt0aGlzLm9uRXJyb3IodCl9bnVsbCE9dCYmdGhpcy5vbkRhdGEodCl9LGkucHJvdG90eXBlLmhhc1hEUj1mdW5jdGlvbigpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBYRG9tYWluUmVxdWVzdCYmIXRoaXMueHMmJnRoaXMuZW5hYmxlc1hEUn0saS5wcm90b3R5cGUuYWJvcnQ9ZnVuY3Rpb24oKXt0aGlzLmNsZWFudXAoKX0saS5yZXF1ZXN0c0NvdW50PTAsaS5yZXF1ZXN0cz17fSxcInVuZGVmaW5lZFwiIT10eXBlb2YgZG9jdW1lbnQpaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYXR0YWNoRXZlbnQpYXR0YWNoRXZlbnQoXCJvbnVubG9hZFwiLHMpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYWRkRXZlbnRMaXN0ZW5lcil7dmFyIHU9XCJvbnBhZ2VoaWRlXCJpbiBzZWxmP1wicGFnZWhpZGVcIjpcInVubG9hZFwiO2FkZEV2ZW50TGlzdGVuZXIodSxzLCExKX19LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe3ZhciBlPXQmJnQuZm9yY2VCYXNlNjQ7cCYmIWV8fCh0aGlzLnN1cHBvcnRzQmluYXJ5PSExKSxvLmNhbGwodGhpcyx0KX12YXIgbz1yKDE3KSxpPXIoMjYpLHM9cigxOCksYT1yKDI3KSxjPXIoMjgpO3IoMykoXCJlbmdpbmUuaW8tY2xpZW50OnBvbGxpbmdcIik7dC5leHBvcnRzPW47dmFyIHA9ZnVuY3Rpb24oKXt2YXIgdD1yKDEzKSxlPW5ldyB0KHt4ZG9tYWluOiExfSk7cmV0dXJuIG51bGwhPWUucmVzcG9uc2VUeXBlfSgpO2EobixvKSxuLnByb3RvdHlwZS5uYW1lPVwicG9sbGluZ1wiLG4ucHJvdG90eXBlLmRvT3Blbj1mdW5jdGlvbigpe3RoaXMucG9sbCgpfSxuLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbih0KXtmdW5jdGlvbiBlKCl7ci5yZWFkeVN0YXRlPVwicGF1c2VkXCIsdCgpfXZhciByPXRoaXM7aWYodGhpcy5yZWFkeVN0YXRlPVwicGF1c2luZ1wiLHRoaXMucG9sbGluZ3x8IXRoaXMud3JpdGFibGUpe3ZhciBuPTA7dGhpcy5wb2xsaW5nJiYobisrLHRoaXMub25jZShcInBvbGxDb21wbGV0ZVwiLGZ1bmN0aW9uKCl7LS1ufHxlKCl9KSksdGhpcy53cml0YWJsZXx8KG4rKyx0aGlzLm9uY2UoXCJkcmFpblwiLGZ1bmN0aW9uKCl7LS1ufHxlKCl9KSl9ZWxzZSBlKCl9LG4ucHJvdG90eXBlLnBvbGw9ZnVuY3Rpb24oKXt0aGlzLnBvbGxpbmc9ITAsdGhpcy5kb1BvbGwoKSx0aGlzLmVtaXQoXCJwb2xsXCIpfSxuLnByb3RvdHlwZS5vbkRhdGE9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcyxyPWZ1bmN0aW9uKHQscixuKXtyZXR1cm5cIm9wZW5pbmdcIj09PWUucmVhZHlTdGF0ZSYmZS5vbk9wZW4oKSxcImNsb3NlXCI9PT10LnR5cGU/KGUub25DbG9zZSgpLCExKTp2b2lkIGUub25QYWNrZXQodCl9O3MuZGVjb2RlUGF5bG9hZCh0LHRoaXMuc29ja2V0LmJpbmFyeVR5cGUsciksXCJjbG9zZWRcIiE9PXRoaXMucmVhZHlTdGF0ZSYmKHRoaXMucG9sbGluZz0hMSx0aGlzLmVtaXQoXCJwb2xsQ29tcGxldGVcIiksXCJvcGVuXCI9PT10aGlzLnJlYWR5U3RhdGUmJnRoaXMucG9sbCgpKX0sbi5wcm90b3R5cGUuZG9DbG9zZT1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXtlLndyaXRlKFt7dHlwZTpcImNsb3NlXCJ9XSl9dmFyIGU9dGhpcztcIm9wZW5cIj09PXRoaXMucmVhZHlTdGF0ZT90KCk6dGhpcy5vbmNlKFwib3BlblwiLHQpfSxuLnByb3RvdHlwZS53cml0ZT1mdW5jdGlvbih0KXt2YXIgZT10aGlzO3RoaXMud3JpdGFibGU9ITE7dmFyIHI9ZnVuY3Rpb24oKXtlLndyaXRhYmxlPSEwLGUuZW1pdChcImRyYWluXCIpfTtzLmVuY29kZVBheWxvYWQodCx0aGlzLnN1cHBvcnRzQmluYXJ5LGZ1bmN0aW9uKHQpe2UuZG9Xcml0ZSh0LHIpfSl9LG4ucHJvdG90eXBlLnVyaT1mdW5jdGlvbigpe3ZhciB0PXRoaXMucXVlcnl8fHt9LGU9dGhpcy5zZWN1cmU/XCJodHRwc1wiOlwiaHR0cFwiLHI9XCJcIjshMSE9PXRoaXMudGltZXN0YW1wUmVxdWVzdHMmJih0W3RoaXMudGltZXN0YW1wUGFyYW1dPWMoKSksdGhpcy5zdXBwb3J0c0JpbmFyeXx8dC5zaWR8fCh0LmI2ND0xKSx0PWkuZW5jb2RlKHQpLHRoaXMucG9ydCYmKFwiaHR0cHNcIj09PWUmJjQ0MyE9PU51bWJlcih0aGlzLnBvcnQpfHxcImh0dHBcIj09PWUmJjgwIT09TnVtYmVyKHRoaXMucG9ydCkpJiYocj1cIjpcIit0aGlzLnBvcnQpLHQubGVuZ3RoJiYodD1cIj9cIit0KTt2YXIgbj10aGlzLmhvc3RuYW1lLmluZGV4T2YoXCI6XCIpIT09LTE7cmV0dXJuIGUrXCI6Ly9cIisobj9cIltcIit0aGlzLmhvc3RuYW1lK1wiXVwiOnRoaXMuaG9zdG5hbWUpK3IrdGhpcy5wYXRoK3R9fSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt0aGlzLnBhdGg9dC5wYXRoLHRoaXMuaG9zdG5hbWU9dC5ob3N0bmFtZSx0aGlzLnBvcnQ9dC5wb3J0LHRoaXMuc2VjdXJlPXQuc2VjdXJlLHRoaXMucXVlcnk9dC5xdWVyeSx0aGlzLnRpbWVzdGFtcFBhcmFtPXQudGltZXN0YW1wUGFyYW0sdGhpcy50aW1lc3RhbXBSZXF1ZXN0cz10LnRpbWVzdGFtcFJlcXVlc3RzLHRoaXMucmVhZHlTdGF0ZT1cIlwiLHRoaXMuYWdlbnQ9dC5hZ2VudHx8ITEsdGhpcy5zb2NrZXQ9dC5zb2NrZXQsdGhpcy5lbmFibGVzWERSPXQuZW5hYmxlc1hEUix0aGlzLnBmeD10LnBmeCx0aGlzLmtleT10LmtleSx0aGlzLnBhc3NwaHJhc2U9dC5wYXNzcGhyYXNlLHRoaXMuY2VydD10LmNlcnQsdGhpcy5jYT10LmNhLHRoaXMuY2lwaGVycz10LmNpcGhlcnMsdGhpcy5yZWplY3RVbmF1dGhvcml6ZWQ9dC5yZWplY3RVbmF1dGhvcml6ZWQsdGhpcy5mb3JjZU5vZGU9dC5mb3JjZU5vZGUsdGhpcy5pc1JlYWN0TmF0aXZlPXQuaXNSZWFjdE5hdGl2ZSx0aGlzLmV4dHJhSGVhZGVycz10LmV4dHJhSGVhZGVycyx0aGlzLmxvY2FsQWRkcmVzcz10LmxvY2FsQWRkcmVzc312YXIgbz1yKDE4KSxpPXIoNSk7dC5leHBvcnRzPW4saShuLnByb3RvdHlwZSksbi5wcm90b3R5cGUub25FcnJvcj1mdW5jdGlvbih0LGUpe3ZhciByPW5ldyBFcnJvcih0KTtyZXR1cm4gci50eXBlPVwiVHJhbnNwb3J0RXJyb3JcIixyLmRlc2NyaXB0aW9uPWUsdGhpcy5lbWl0KFwiZXJyb3JcIixyKSx0aGlzfSxuLnByb3RvdHlwZS5vcGVuPWZ1bmN0aW9uKCl7cmV0dXJuXCJjbG9zZWRcIiE9PXRoaXMucmVhZHlTdGF0ZSYmXCJcIiE9PXRoaXMucmVhZHlTdGF0ZXx8KHRoaXMucmVhZHlTdGF0ZT1cIm9wZW5pbmdcIix0aGlzLmRvT3BlbigpKSx0aGlzfSxuLnByb3RvdHlwZS5jbG9zZT1mdW5jdGlvbigpe3JldHVyblwib3BlbmluZ1wiIT09dGhpcy5yZWFkeVN0YXRlJiZcIm9wZW5cIiE9PXRoaXMucmVhZHlTdGF0ZXx8KHRoaXMuZG9DbG9zZSgpLHRoaXMub25DbG9zZSgpKSx0aGlzfSxuLnByb3RvdHlwZS5zZW5kPWZ1bmN0aW9uKHQpe2lmKFwib3BlblwiIT09dGhpcy5yZWFkeVN0YXRlKXRocm93IG5ldyBFcnJvcihcIlRyYW5zcG9ydCBub3Qgb3BlblwiKTt0aGlzLndyaXRlKHQpfSxuLnByb3RvdHlwZS5vbk9wZW49ZnVuY3Rpb24oKXt0aGlzLnJlYWR5U3RhdGU9XCJvcGVuXCIsdGhpcy53cml0YWJsZT0hMCx0aGlzLmVtaXQoXCJvcGVuXCIpfSxuLnByb3RvdHlwZS5vbkRhdGE9ZnVuY3Rpb24odCl7dmFyIGU9by5kZWNvZGVQYWNrZXQodCx0aGlzLnNvY2tldC5iaW5hcnlUeXBlKTt0aGlzLm9uUGFja2V0KGUpfSxuLnByb3RvdHlwZS5vblBhY2tldD1mdW5jdGlvbih0KXt0aGlzLmVtaXQoXCJwYWNrZXRcIix0KX0sbi5wcm90b3R5cGUub25DbG9zZT1mdW5jdGlvbigpe3RoaXMucmVhZHlTdGF0ZT1cImNsb3NlZFwiLHRoaXMuZW1pdChcImNsb3NlXCIpO1xufX0sZnVuY3Rpb24odCxlLHIpe2Z1bmN0aW9uIG4odCxyKXt2YXIgbj1cImJcIitlLnBhY2tldHNbdC50eXBlXSt0LmRhdGEuZGF0YTtyZXR1cm4gcihuKX1mdW5jdGlvbiBvKHQscixuKXtpZighcilyZXR1cm4gZS5lbmNvZGVCYXNlNjRQYWNrZXQodCxuKTt2YXIgbz10LmRhdGEsaT1uZXcgVWludDhBcnJheShvKSxzPW5ldyBVaW50OEFycmF5KDErby5ieXRlTGVuZ3RoKTtzWzBdPXZbdC50eXBlXTtmb3IodmFyIGE9MDthPGkubGVuZ3RoO2ErKylzW2ErMV09aVthXTtyZXR1cm4gbihzLmJ1ZmZlcil9ZnVuY3Rpb24gaSh0LHIsbil7aWYoIXIpcmV0dXJuIGUuZW5jb2RlQmFzZTY0UGFja2V0KHQsbik7dmFyIG89bmV3IEZpbGVSZWFkZXI7cmV0dXJuIG8ub25sb2FkPWZ1bmN0aW9uKCl7ZS5lbmNvZGVQYWNrZXQoe3R5cGU6dC50eXBlLGRhdGE6by5yZXN1bHR9LHIsITAsbil9LG8ucmVhZEFzQXJyYXlCdWZmZXIodC5kYXRhKX1mdW5jdGlvbiBzKHQscixuKXtpZighcilyZXR1cm4gZS5lbmNvZGVCYXNlNjRQYWNrZXQodCxuKTtpZihnKXJldHVybiBpKHQscixuKTt2YXIgbz1uZXcgVWludDhBcnJheSgxKTtvWzBdPXZbdC50eXBlXTt2YXIgcz1uZXcgdyhbby5idWZmZXIsdC5kYXRhXSk7cmV0dXJuIG4ocyl9ZnVuY3Rpb24gYSh0KXt0cnl7dD1kLmRlY29kZSh0LHtzdHJpY3Q6ITF9KX1jYXRjaCh0KXtyZXR1cm4hMX1yZXR1cm4gdH1mdW5jdGlvbiBjKHQsZSxyKXtmb3IodmFyIG49bmV3IEFycmF5KHQubGVuZ3RoKSxvPWwodC5sZW5ndGgsciksaT1mdW5jdGlvbih0LHIsbyl7ZShyLGZ1bmN0aW9uKGUscil7blt0XT1yLG8oZSxuKX0pfSxzPTA7czx0Lmxlbmd0aDtzKyspaShzLHRbc10sbyl9dmFyIHAsaD1yKDE5KSx1PXIoMjApLGY9cigyMSksbD1yKDIyKSxkPXIoMjMpO1widW5kZWZpbmVkXCIhPXR5cGVvZiBBcnJheUJ1ZmZlciYmKHA9cigyNCkpO3ZhciB5PVwidW5kZWZpbmVkXCIhPXR5cGVvZiBuYXZpZ2F0b3ImJi9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxtPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBuYXZpZ2F0b3ImJi9QaGFudG9tSlMvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLGc9eXx8bTtlLnByb3RvY29sPTM7dmFyIHY9ZS5wYWNrZXRzPXtvcGVuOjAsY2xvc2U6MSxwaW5nOjIscG9uZzozLG1lc3NhZ2U6NCx1cGdyYWRlOjUsbm9vcDo2fSxiPWgodiksaz17dHlwZTpcImVycm9yXCIsZGF0YTpcInBhcnNlciBlcnJvclwifSx3PXIoMjUpO2UuZW5jb2RlUGFja2V0PWZ1bmN0aW9uKHQsZSxyLGkpe1wiZnVuY3Rpb25cIj09dHlwZW9mIGUmJihpPWUsZT0hMSksXCJmdW5jdGlvblwiPT10eXBlb2YgciYmKGk9cixyPW51bGwpO3ZhciBhPXZvaWQgMD09PXQuZGF0YT92b2lkIDA6dC5kYXRhLmJ1ZmZlcnx8dC5kYXRhO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBBcnJheUJ1ZmZlciYmYSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKXJldHVybiBvKHQsZSxpKTtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgdyYmYSBpbnN0YW5jZW9mIHcpcmV0dXJuIHModCxlLGkpO2lmKGEmJmEuYmFzZTY0KXJldHVybiBuKHQsaSk7dmFyIGM9dlt0LnR5cGVdO3JldHVybiB2b2lkIDAhPT10LmRhdGEmJihjKz1yP2QuZW5jb2RlKFN0cmluZyh0LmRhdGEpLHtzdHJpY3Q6ITF9KTpTdHJpbmcodC5kYXRhKSksaShcIlwiK2MpfSxlLmVuY29kZUJhc2U2NFBhY2tldD1mdW5jdGlvbih0LHIpe3ZhciBuPVwiYlwiK2UucGFja2V0c1t0LnR5cGVdO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3JiZ0LmRhdGEgaW5zdGFuY2VvZiB3KXt2YXIgbz1uZXcgRmlsZVJlYWRlcjtyZXR1cm4gby5vbmxvYWQ9ZnVuY3Rpb24oKXt2YXIgdD1vLnJlc3VsdC5zcGxpdChcIixcIilbMV07cihuK3QpfSxvLnJlYWRBc0RhdGFVUkwodC5kYXRhKX12YXIgaTt0cnl7aT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsbmV3IFVpbnQ4QXJyYXkodC5kYXRhKSl9Y2F0Y2goZSl7Zm9yKHZhciBzPW5ldyBVaW50OEFycmF5KHQuZGF0YSksYT1uZXcgQXJyYXkocy5sZW5ndGgpLGM9MDtjPHMubGVuZ3RoO2MrKylhW2NdPXNbY107aT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsYSl9cmV0dXJuIG4rPWJ0b2EoaSkscihuKX0sZS5kZWNvZGVQYWNrZXQ9ZnVuY3Rpb24odCxyLG4pe2lmKHZvaWQgMD09PXQpcmV0dXJuIGs7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQpe2lmKFwiYlwiPT09dC5jaGFyQXQoMCkpcmV0dXJuIGUuZGVjb2RlQmFzZTY0UGFja2V0KHQuc3Vic3RyKDEpLHIpO2lmKG4mJih0PWEodCksdD09PSExKSlyZXR1cm4gazt2YXIgbz10LmNoYXJBdCgwKTtyZXR1cm4gTnVtYmVyKG8pPT1vJiZiW29dP3QubGVuZ3RoPjE/e3R5cGU6YltvXSxkYXRhOnQuc3Vic3RyaW5nKDEpfTp7dHlwZTpiW29dfTprfXZhciBpPW5ldyBVaW50OEFycmF5KHQpLG89aVswXSxzPWYodCwxKTtyZXR1cm4gdyYmXCJibG9iXCI9PT1yJiYocz1uZXcgdyhbc10pKSx7dHlwZTpiW29dLGRhdGE6c319LGUuZGVjb2RlQmFzZTY0UGFja2V0PWZ1bmN0aW9uKHQsZSl7dmFyIHI9Ylt0LmNoYXJBdCgwKV07aWYoIXApcmV0dXJue3R5cGU6cixkYXRhOntiYXNlNjQ6ITAsZGF0YTp0LnN1YnN0cigxKX19O3ZhciBuPXAuZGVjb2RlKHQuc3Vic3RyKDEpKTtyZXR1cm5cImJsb2JcIj09PWUmJncmJihuPW5ldyB3KFtuXSkpLHt0eXBlOnIsZGF0YTpufX0sZS5lbmNvZGVQYXlsb2FkPWZ1bmN0aW9uKHQscixuKXtmdW5jdGlvbiBvKHQpe3JldHVybiB0Lmxlbmd0aCtcIjpcIit0fWZ1bmN0aW9uIGkodCxuKXtlLmVuY29kZVBhY2tldCh0LCEhcyYmciwhMSxmdW5jdGlvbih0KXtuKG51bGwsbyh0KSl9KX1cImZ1bmN0aW9uXCI9PXR5cGVvZiByJiYobj1yLHI9bnVsbCk7dmFyIHM9dSh0KTtyZXR1cm4gciYmcz93JiYhZz9lLmVuY29kZVBheWxvYWRBc0Jsb2IodCxuKTplLmVuY29kZVBheWxvYWRBc0FycmF5QnVmZmVyKHQsbik6dC5sZW5ndGg/dm9pZCBjKHQsaSxmdW5jdGlvbih0LGUpe3JldHVybiBuKGUuam9pbihcIlwiKSl9KTpuKFwiMDpcIil9LGUuZGVjb2RlUGF5bG9hZD1mdW5jdGlvbih0LHIsbil7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIHQpcmV0dXJuIGUuZGVjb2RlUGF5bG9hZEFzQmluYXJ5KHQscixuKTtcImZ1bmN0aW9uXCI9PXR5cGVvZiByJiYobj1yLHI9bnVsbCk7dmFyIG87aWYoXCJcIj09PXQpcmV0dXJuIG4oaywwLDEpO2Zvcih2YXIgaSxzLGE9XCJcIixjPTAscD10Lmxlbmd0aDtjPHA7YysrKXt2YXIgaD10LmNoYXJBdChjKTtpZihcIjpcIj09PWgpe2lmKFwiXCI9PT1hfHxhIT0oaT1OdW1iZXIoYSkpKXJldHVybiBuKGssMCwxKTtpZihzPXQuc3Vic3RyKGMrMSxpKSxhIT1zLmxlbmd0aClyZXR1cm4gbihrLDAsMSk7aWYocy5sZW5ndGgpe2lmKG89ZS5kZWNvZGVQYWNrZXQocyxyLCExKSxrLnR5cGU9PT1vLnR5cGUmJmsuZGF0YT09PW8uZGF0YSlyZXR1cm4gbihrLDAsMSk7dmFyIHU9bihvLGMraSxwKTtpZighMT09PXUpcmV0dXJufWMrPWksYT1cIlwifWVsc2UgYSs9aH1yZXR1cm5cIlwiIT09YT9uKGssMCwxKTp2b2lkIDB9LGUuZW5jb2RlUGF5bG9hZEFzQXJyYXlCdWZmZXI9ZnVuY3Rpb24odCxyKXtmdW5jdGlvbiBuKHQscil7ZS5lbmNvZGVQYWNrZXQodCwhMCwhMCxmdW5jdGlvbih0KXtyZXR1cm4gcihudWxsLHQpfSl9cmV0dXJuIHQubGVuZ3RoP3ZvaWQgYyh0LG4sZnVuY3Rpb24odCxlKXt2YXIgbj1lLnJlZHVjZShmdW5jdGlvbih0LGUpe3ZhciByO3JldHVybiByPVwic3RyaW5nXCI9PXR5cGVvZiBlP2UubGVuZ3RoOmUuYnl0ZUxlbmd0aCx0K3IudG9TdHJpbmcoKS5sZW5ndGgrcisyfSwwKSxvPW5ldyBVaW50OEFycmF5KG4pLGk9MDtyZXR1cm4gZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3ZhciBlPVwic3RyaW5nXCI9PXR5cGVvZiB0LHI9dDtpZihlKXtmb3IodmFyIG49bmV3IFVpbnQ4QXJyYXkodC5sZW5ndGgpLHM9MDtzPHQubGVuZ3RoO3MrKyluW3NdPXQuY2hhckNvZGVBdChzKTtyPW4uYnVmZmVyfWU/b1tpKytdPTA6b1tpKytdPTE7Zm9yKHZhciBhPXIuYnl0ZUxlbmd0aC50b1N0cmluZygpLHM9MDtzPGEubGVuZ3RoO3MrKylvW2krK109cGFyc2VJbnQoYVtzXSk7b1tpKytdPTI1NTtmb3IodmFyIG49bmV3IFVpbnQ4QXJyYXkocikscz0wO3M8bi5sZW5ndGg7cysrKW9baSsrXT1uW3NdfSkscihvLmJ1ZmZlcil9KTpyKG5ldyBBcnJheUJ1ZmZlcigwKSl9LGUuZW5jb2RlUGF5bG9hZEFzQmxvYj1mdW5jdGlvbih0LHIpe2Z1bmN0aW9uIG4odCxyKXtlLmVuY29kZVBhY2tldCh0LCEwLCEwLGZ1bmN0aW9uKHQpe3ZhciBlPW5ldyBVaW50OEFycmF5KDEpO2lmKGVbMF09MSxcInN0cmluZ1wiPT10eXBlb2YgdCl7Zm9yKHZhciBuPW5ldyBVaW50OEFycmF5KHQubGVuZ3RoKSxvPTA7bzx0Lmxlbmd0aDtvKyspbltvXT10LmNoYXJDb2RlQXQobyk7dD1uLmJ1ZmZlcixlWzBdPTB9Zm9yKHZhciBpPXQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcj90LmJ5dGVMZW5ndGg6dC5zaXplLHM9aS50b1N0cmluZygpLGE9bmV3IFVpbnQ4QXJyYXkocy5sZW5ndGgrMSksbz0wO288cy5sZW5ndGg7bysrKWFbb109cGFyc2VJbnQoc1tvXSk7aWYoYVtzLmxlbmd0aF09MjU1LHcpe3ZhciBjPW5ldyB3KFtlLmJ1ZmZlcixhLmJ1ZmZlcix0XSk7cihudWxsLGMpfX0pfWModCxuLGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHIobmV3IHcoZSkpfSl9LGUuZGVjb2RlUGF5bG9hZEFzQmluYXJ5PWZ1bmN0aW9uKHQscixuKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiByJiYobj1yLHI9bnVsbCk7Zm9yKHZhciBvPXQsaT1bXTtvLmJ5dGVMZW5ndGg+MDspe2Zvcih2YXIgcz1uZXcgVWludDhBcnJheShvKSxhPTA9PT1zWzBdLGM9XCJcIixwPTE7MjU1IT09c1twXTtwKyspe2lmKGMubGVuZ3RoPjMxMClyZXR1cm4gbihrLDAsMSk7Yys9c1twXX1vPWYobywyK2MubGVuZ3RoKSxjPXBhcnNlSW50KGMpO3ZhciBoPWYobywwLGMpO2lmKGEpdHJ5e2g9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLG5ldyBVaW50OEFycmF5KGgpKX1jYXRjaCh0KXt2YXIgdT1uZXcgVWludDhBcnJheShoKTtoPVwiXCI7Zm9yKHZhciBwPTA7cDx1Lmxlbmd0aDtwKyspaCs9U3RyaW5nLmZyb21DaGFyQ29kZSh1W3BdKX1pLnB1c2goaCksbz1mKG8sYyl9dmFyIGw9aS5sZW5ndGg7aS5mb3JFYWNoKGZ1bmN0aW9uKHQsbyl7bihlLmRlY29kZVBhY2tldCh0LHIsITApLG8sbCl9KX19LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPU9iamVjdC5rZXlzfHxmdW5jdGlvbih0KXt2YXIgZT1bXSxyPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7Zm9yKHZhciBuIGluIHQpci5jYWxsKHQsbikmJmUucHVzaChuKTtyZXR1cm4gZX19LGZ1bmN0aW9uKHQsZSxyKXtmdW5jdGlvbiBuKHQpe2lmKCF0fHxcIm9iamVjdFwiIT10eXBlb2YgdClyZXR1cm4hMTtpZihvKHQpKXtmb3IodmFyIGU9MCxyPXQubGVuZ3RoO2U8cjtlKyspaWYobih0W2VdKSlyZXR1cm4hMDtyZXR1cm4hMX1pZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBCdWZmZXImJkJ1ZmZlci5pc0J1ZmZlciYmQnVmZmVyLmlzQnVmZmVyKHQpfHxcImZ1bmN0aW9uXCI9PXR5cGVvZiBBcnJheUJ1ZmZlciYmdCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHxzJiZ0IGluc3RhbmNlb2YgQmxvYnx8YSYmdCBpbnN0YW5jZW9mIEZpbGUpcmV0dXJuITA7aWYodC50b0pTT04mJlwiZnVuY3Rpb25cIj09dHlwZW9mIHQudG9KU09OJiYxPT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gbih0LnRvSlNPTigpLCEwKTtmb3IodmFyIGkgaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxpKSYmbih0W2ldKSlyZXR1cm4hMDtyZXR1cm4hMX12YXIgbz1yKDcpLGk9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxzPVwiZnVuY3Rpb25cIj09dHlwZW9mIEJsb2J8fFwidW5kZWZpbmVkXCIhPXR5cGVvZiBCbG9iJiZcIltvYmplY3QgQmxvYkNvbnN0cnVjdG9yXVwiPT09aS5jYWxsKEJsb2IpLGE9XCJmdW5jdGlvblwiPT10eXBlb2YgRmlsZXx8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEZpbGUmJlwiW29iamVjdCBGaWxlQ29uc3RydWN0b3JdXCI9PT1pLmNhbGwoRmlsZSk7dC5leHBvcnRzPW59LGZ1bmN0aW9uKHQsZSl7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSxyKXt2YXIgbj10LmJ5dGVMZW5ndGg7aWYoZT1lfHwwLHI9cnx8bix0LnNsaWNlKXJldHVybiB0LnNsaWNlKGUscik7aWYoZTwwJiYoZSs9bikscjwwJiYocis9bikscj5uJiYocj1uKSxlPj1ufHxlPj1yfHwwPT09bilyZXR1cm4gbmV3IEFycmF5QnVmZmVyKDApO2Zvcih2YXIgbz1uZXcgVWludDhBcnJheSh0KSxpPW5ldyBVaW50OEFycmF5KHItZSkscz1lLGE9MDtzPHI7cysrLGErKylpW2FdPW9bc107cmV0dXJuIGkuYnVmZmVyfX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQsZSxyKXtmdW5jdGlvbiBvKHQsbil7aWYoby5jb3VudDw9MCl0aHJvdyBuZXcgRXJyb3IoXCJhZnRlciBjYWxsZWQgdG9vIG1hbnkgdGltZXNcIik7LS1vLmNvdW50LHQ/KGk9ITAsZSh0KSxlPXIpOjAhPT1vLmNvdW50fHxpfHxlKG51bGwsbil9dmFyIGk9ITE7cmV0dXJuIHI9cnx8bixvLmNvdW50PXQsMD09PXQ/ZSgpOm99ZnVuY3Rpb24gbigpe310LmV4cG9ydHM9cn0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQpe2Zvcih2YXIgZSxyLG49W10sbz0wLGk9dC5sZW5ndGg7bzxpOyllPXQuY2hhckNvZGVBdChvKyspLGU+PTU1Mjk2JiZlPD01NjMxOSYmbzxpPyhyPXQuY2hhckNvZGVBdChvKyspLDU2MzIwPT0oNjQ1MTImcik/bi5wdXNoKCgoMTAyMyZlKTw8MTApKygxMDIzJnIpKzY1NTM2KToobi5wdXNoKGUpLG8tLSkpOm4ucHVzaChlKTtyZXR1cm4gbn1mdW5jdGlvbiBuKHQpe2Zvcih2YXIgZSxyPXQubGVuZ3RoLG49LTEsbz1cIlwiOysrbjxyOyllPXRbbl0sZT42NTUzNSYmKGUtPTY1NTM2LG8rPWQoZT4+PjEwJjEwMjN8NTUyOTYpLGU9NTYzMjB8MTAyMyZlKSxvKz1kKGUpO3JldHVybiBvfWZ1bmN0aW9uIG8odCxlKXtpZih0Pj01NTI5NiYmdDw9NTczNDMpe2lmKGUpdGhyb3cgRXJyb3IoXCJMb25lIHN1cnJvZ2F0ZSBVK1wiK3QudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCkrXCIgaXMgbm90IGEgc2NhbGFyIHZhbHVlXCIpO3JldHVybiExfXJldHVybiEwfWZ1bmN0aW9uIGkodCxlKXtyZXR1cm4gZCh0Pj5lJjYzfDEyOCl9ZnVuY3Rpb24gcyh0LGUpe2lmKDA9PSg0Mjk0OTY3MTY4JnQpKXJldHVybiBkKHQpO3ZhciByPVwiXCI7cmV0dXJuIDA9PSg0Mjk0OTY1MjQ4JnQpP3I9ZCh0Pj42JjMxfDE5Mik6MD09KDQyOTQ5MDE3NjAmdCk/KG8odCxlKXx8KHQ9NjU1MzMpLHI9ZCh0Pj4xMiYxNXwyMjQpLHIrPWkodCw2KSk6MD09KDQyOTI4NzAxNDQmdCkmJihyPWQodD4+MTgmN3wyNDApLHIrPWkodCwxMikscis9aSh0LDYpKSxyKz1kKDYzJnR8MTI4KX1mdW5jdGlvbiBhKHQsZSl7ZT1lfHx7fTtmb3IodmFyIG4sbz0hMSE9PWUuc3RyaWN0LGk9cih0KSxhPWkubGVuZ3RoLGM9LTEscD1cIlwiOysrYzxhOyluPWlbY10scCs9cyhuLG8pO3JldHVybiBwfWZ1bmN0aW9uIGMoKXtpZihsPj1mKXRocm93IEVycm9yKFwiSW52YWxpZCBieXRlIGluZGV4XCIpO3ZhciB0PTI1NSZ1W2xdO2lmKGwrKywxMjg9PSgxOTImdCkpcmV0dXJuIDYzJnQ7dGhyb3cgRXJyb3IoXCJJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlXCIpfWZ1bmN0aW9uIHAodCl7dmFyIGUscixuLGkscztpZihsPmYpdGhyb3cgRXJyb3IoXCJJbnZhbGlkIGJ5dGUgaW5kZXhcIik7aWYobD09ZilyZXR1cm4hMTtpZihlPTI1NSZ1W2xdLGwrKywwPT0oMTI4JmUpKXJldHVybiBlO2lmKDE5Mj09KDIyNCZlKSl7aWYocj1jKCkscz0oMzEmZSk8PDZ8cixzPj0xMjgpcmV0dXJuIHM7dGhyb3cgRXJyb3IoXCJJbnZhbGlkIGNvbnRpbnVhdGlvbiBieXRlXCIpfWlmKDIyND09KDI0MCZlKSl7aWYocj1jKCksbj1jKCkscz0oMTUmZSk8PDEyfHI8PDZ8bixzPj0yMDQ4KXJldHVybiBvKHMsdCk/czo2NTUzMzt0aHJvdyBFcnJvcihcIkludmFsaWQgY29udGludWF0aW9uIGJ5dGVcIil9aWYoMjQwPT0oMjQ4JmUpJiYocj1jKCksbj1jKCksaT1jKCkscz0oNyZlKTw8MTh8cjw8MTJ8bjw8NnxpLHM+PTY1NTM2JiZzPD0xMTE0MTExKSlyZXR1cm4gczt0aHJvdyBFcnJvcihcIkludmFsaWQgVVRGLTggZGV0ZWN0ZWRcIil9ZnVuY3Rpb24gaCh0LGUpe2U9ZXx8e307dmFyIG89ITEhPT1lLnN0cmljdDt1PXIodCksZj11Lmxlbmd0aCxsPTA7Zm9yKHZhciBpLHM9W107KGk9cChvKSkhPT0hMTspcy5wdXNoKGkpO3JldHVybiBuKHMpfS8qISBodHRwczovL210aHMuYmUvdXRmOGpzIHYyLjEuMiBieSBAbWF0aGlhcyAqL1xudmFyIHUsZixsLGQ9U3RyaW5nLmZyb21DaGFyQ29kZTt0LmV4cG9ydHM9e3ZlcnNpb246XCIyLjEuMlwiLGVuY29kZTphLGRlY29kZTpofX0sZnVuY3Rpb24odCxlKXshZnVuY3Rpb24oKXtcInVzZSBzdHJpY3RcIjtmb3IodmFyIHQ9XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIscj1uZXcgVWludDhBcnJheSgyNTYpLG49MDtuPHQubGVuZ3RoO24rKylyW3QuY2hhckNvZGVBdChuKV09bjtlLmVuY29kZT1mdW5jdGlvbihlKXt2YXIgcixuPW5ldyBVaW50OEFycmF5KGUpLG89bi5sZW5ndGgsaT1cIlwiO2ZvcihyPTA7cjxvO3IrPTMpaSs9dFtuW3JdPj4yXSxpKz10WygzJm5bcl0pPDw0fG5bcisxXT4+NF0saSs9dFsoMTUmbltyKzFdKTw8MnxuW3IrMl0+PjZdLGkrPXRbNjMmbltyKzJdXTtyZXR1cm4gbyUzPT09Mj9pPWkuc3Vic3RyaW5nKDAsaS5sZW5ndGgtMSkrXCI9XCI6byUzPT09MSYmKGk9aS5zdWJzdHJpbmcoMCxpLmxlbmd0aC0yKStcIj09XCIpLGl9LGUuZGVjb2RlPWZ1bmN0aW9uKHQpe3ZhciBlLG4sbyxpLHMsYT0uNzUqdC5sZW5ndGgsYz10Lmxlbmd0aCxwPTA7XCI9XCI9PT10W3QubGVuZ3RoLTFdJiYoYS0tLFwiPVwiPT09dFt0Lmxlbmd0aC0yXSYmYS0tKTt2YXIgaD1uZXcgQXJyYXlCdWZmZXIoYSksdT1uZXcgVWludDhBcnJheShoKTtmb3IoZT0wO2U8YztlKz00KW49clt0LmNoYXJDb2RlQXQoZSldLG89clt0LmNoYXJDb2RlQXQoZSsxKV0saT1yW3QuY2hhckNvZGVBdChlKzIpXSxzPXJbdC5jaGFyQ29kZUF0KGUrMyldLHVbcCsrXT1uPDwyfG8+PjQsdVtwKytdPSgxNSZvKTw8NHxpPj4yLHVbcCsrXT0oMyZpKTw8Nnw2MyZzO3JldHVybiBofX0oKX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQpe3JldHVybiB0Lm1hcChmdW5jdGlvbih0KXtpZih0LmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKXt2YXIgZT10LmJ1ZmZlcjtpZih0LmJ5dGVMZW5ndGghPT1lLmJ5dGVMZW5ndGgpe3ZhciByPW5ldyBVaW50OEFycmF5KHQuYnl0ZUxlbmd0aCk7ci5zZXQobmV3IFVpbnQ4QXJyYXkoZSx0LmJ5dGVPZmZzZXQsdC5ieXRlTGVuZ3RoKSksZT1yLmJ1ZmZlcn1yZXR1cm4gZX1yZXR1cm4gdH0pfWZ1bmN0aW9uIG4odCxlKXtlPWV8fHt9O3ZhciBuPW5ldyBpO3JldHVybiByKHQpLmZvckVhY2goZnVuY3Rpb24odCl7bi5hcHBlbmQodCl9KSxlLnR5cGU/bi5nZXRCbG9iKGUudHlwZSk6bi5nZXRCbG9iKCl9ZnVuY3Rpb24gbyh0LGUpe3JldHVybiBuZXcgQmxvYihyKHQpLGV8fHt9KX12YXIgaT1cInVuZGVmaW5lZFwiIT10eXBlb2YgaT9pOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBXZWJLaXRCbG9iQnVpbGRlcj9XZWJLaXRCbG9iQnVpbGRlcjpcInVuZGVmaW5lZFwiIT10eXBlb2YgTVNCbG9iQnVpbGRlcj9NU0Jsb2JCdWlsZGVyOlwidW5kZWZpbmVkXCIhPXR5cGVvZiBNb3pCbG9iQnVpbGRlciYmTW96QmxvYkJ1aWxkZXIscz1mdW5jdGlvbigpe3RyeXt2YXIgdD1uZXcgQmxvYihbXCJoaVwiXSk7cmV0dXJuIDI9PT10LnNpemV9Y2F0Y2godCl7cmV0dXJuITF9fSgpLGE9cyYmZnVuY3Rpb24oKXt0cnl7dmFyIHQ9bmV3IEJsb2IoW25ldyBVaW50OEFycmF5KFsxLDJdKV0pO3JldHVybiAyPT09dC5zaXplfWNhdGNoKHQpe3JldHVybiExfX0oKSxjPWkmJmkucHJvdG90eXBlLmFwcGVuZCYmaS5wcm90b3R5cGUuZ2V0QmxvYjtcInVuZGVmaW5lZFwiIT10eXBlb2YgQmxvYiYmKG4ucHJvdG90eXBlPUJsb2IucHJvdG90eXBlLG8ucHJvdG90eXBlPUJsb2IucHJvdG90eXBlKSx0LmV4cG9ydHM9ZnVuY3Rpb24oKXtyZXR1cm4gcz9hP0Jsb2I6bzpjP246dm9pZCAwfSgpfSxmdW5jdGlvbih0LGUpe2UuZW5jb2RlPWZ1bmN0aW9uKHQpe3ZhciBlPVwiXCI7Zm9yKHZhciByIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShyKSYmKGUubGVuZ3RoJiYoZSs9XCImXCIpLGUrPWVuY29kZVVSSUNvbXBvbmVudChyKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQodFtyXSkpO3JldHVybiBlfSxlLmRlY29kZT1mdW5jdGlvbih0KXtmb3IodmFyIGU9e30scj10LnNwbGl0KFwiJlwiKSxuPTAsbz1yLmxlbmd0aDtuPG87bisrKXt2YXIgaT1yW25dLnNwbGl0KFwiPVwiKTtlW2RlY29kZVVSSUNvbXBvbmVudChpWzBdKV09ZGVjb2RlVVJJQ29tcG9uZW50KGlbMV0pfXJldHVybiBlfX0sZnVuY3Rpb24odCxlKXt0LmV4cG9ydHM9ZnVuY3Rpb24odCxlKXt2YXIgcj1mdW5jdGlvbigpe307ci5wcm90b3R5cGU9ZS5wcm90b3R5cGUsdC5wcm90b3R5cGU9bmV3IHIsdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dH19LGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcih0KXt2YXIgZT1cIlwiO2RvIGU9c1t0JWFdK2UsdD1NYXRoLmZsb29yKHQvYSk7d2hpbGUodD4wKTtyZXR1cm4gZX1mdW5jdGlvbiBuKHQpe3ZhciBlPTA7Zm9yKGg9MDtoPHQubGVuZ3RoO2grKyllPWUqYStjW3QuY2hhckF0KGgpXTtyZXR1cm4gZX1mdW5jdGlvbiBvKCl7dmFyIHQ9cigrbmV3IERhdGUpO3JldHVybiB0IT09aT8ocD0wLGk9dCk6dCtcIi5cIityKHArKyl9Zm9yKHZhciBpLHM9XCIwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ei1fXCIuc3BsaXQoXCJcIiksYT02NCxjPXt9LHA9MCxoPTA7aDxhO2grKyljW3NbaF1dPWg7by5lbmNvZGU9cixvLmRlY29kZT1uLHQuZXhwb3J0cz1vfSxmdW5jdGlvbih0LGUscil7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXt9ZnVuY3Rpb24gbygpe3JldHVyblwidW5kZWZpbmVkXCIhPXR5cGVvZiBzZWxmP3NlbGY6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGU/ZTp7fX1mdW5jdGlvbiBpKHQpe2lmKHMuY2FsbCh0aGlzLHQpLHRoaXMucXVlcnk9dGhpcy5xdWVyeXx8e30sIWMpe3ZhciBlPW8oKTtjPWUuX19fZWlvPWUuX19fZWlvfHxbXX10aGlzLmluZGV4PWMubGVuZ3RoO3ZhciByPXRoaXM7Yy5wdXNoKGZ1bmN0aW9uKHQpe3Iub25EYXRhKHQpfSksdGhpcy5xdWVyeS5qPXRoaXMuaW5kZXgsXCJmdW5jdGlvblwiPT10eXBlb2YgYWRkRXZlbnRMaXN0ZW5lciYmYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLGZ1bmN0aW9uKCl7ci5zY3JpcHQmJihyLnNjcmlwdC5vbmVycm9yPW4pfSwhMSl9dmFyIHM9cigxNiksYT1yKDI3KTt0LmV4cG9ydHM9aTt2YXIgYyxwPS9cXG4vZyxoPS9cXFxcbi9nO2EoaSxzKSxpLnByb3RvdHlwZS5zdXBwb3J0c0JpbmFyeT0hMSxpLnByb3RvdHlwZS5kb0Nsb3NlPWZ1bmN0aW9uKCl7dGhpcy5zY3JpcHQmJih0aGlzLnNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuc2NyaXB0KSx0aGlzLnNjcmlwdD1udWxsKSx0aGlzLmZvcm0mJih0aGlzLmZvcm0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmZvcm0pLHRoaXMuZm9ybT1udWxsLHRoaXMuaWZyYW1lPW51bGwpLHMucHJvdG90eXBlLmRvQ2xvc2UuY2FsbCh0aGlzKX0saS5wcm90b3R5cGUuZG9Qb2xsPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcyxlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7dGhpcy5zY3JpcHQmJih0aGlzLnNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuc2NyaXB0KSx0aGlzLnNjcmlwdD1udWxsKSxlLmFzeW5jPSEwLGUuc3JjPXRoaXMudXJpKCksZS5vbmVycm9yPWZ1bmN0aW9uKGUpe3Qub25FcnJvcihcImpzb25wIHBvbGwgZXJyb3JcIixlKX07dmFyIHI9ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIilbMF07cj9yLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUscik6KGRvY3VtZW50LmhlYWR8fGRvY3VtZW50LmJvZHkpLmFwcGVuZENoaWxkKGUpLHRoaXMuc2NyaXB0PWU7dmFyIG49XCJ1bmRlZmluZWRcIiE9dHlwZW9mIG5hdmlnYXRvciYmL2dlY2tvL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtuJiZzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dmFyIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHQpLGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodCl9LDEwMCl9LGkucHJvdG90eXBlLmRvV3JpdGU9ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKCl7bigpLGUoKX1mdW5jdGlvbiBuKCl7aWYoby5pZnJhbWUpdHJ5e28uZm9ybS5yZW1vdmVDaGlsZChvLmlmcmFtZSl9Y2F0Y2godCl7by5vbkVycm9yKFwianNvbnAgcG9sbGluZyBpZnJhbWUgcmVtb3ZhbCBlcnJvclwiLHQpfXRyeXt2YXIgdD0nPGlmcmFtZSBzcmM9XCJqYXZhc2NyaXB0OjBcIiBuYW1lPVwiJytvLmlmcmFtZUlkKydcIj4nO2k9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0KX1jYXRjaCh0KXtpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpZnJhbWVcIiksaS5uYW1lPW8uaWZyYW1lSWQsaS5zcmM9XCJqYXZhc2NyaXB0OjBcIn1pLmlkPW8uaWZyYW1lSWQsby5mb3JtLmFwcGVuZENoaWxkKGkpLG8uaWZyYW1lPWl9dmFyIG89dGhpcztpZighdGhpcy5mb3JtKXt2YXIgaSxzPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpLGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRleHRhcmVhXCIpLGM9dGhpcy5pZnJhbWVJZD1cImVpb19pZnJhbWVfXCIrdGhpcy5pbmRleDtzLmNsYXNzTmFtZT1cInNvY2tldGlvXCIscy5zdHlsZS5wb3NpdGlvbj1cImFic29sdXRlXCIscy5zdHlsZS50b3A9XCItMTAwMHB4XCIscy5zdHlsZS5sZWZ0PVwiLTEwMDBweFwiLHMudGFyZ2V0PWMscy5tZXRob2Q9XCJQT1NUXCIscy5zZXRBdHRyaWJ1dGUoXCJhY2NlcHQtY2hhcnNldFwiLFwidXRmLThcIiksYS5uYW1lPVwiZFwiLHMuYXBwZW5kQ2hpbGQoYSksZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzKSx0aGlzLmZvcm09cyx0aGlzLmFyZWE9YX10aGlzLmZvcm0uYWN0aW9uPXRoaXMudXJpKCksbigpLHQ9dC5yZXBsYWNlKGgsXCJcXFxcXFxuXCIpLHRoaXMuYXJlYS52YWx1ZT10LnJlcGxhY2UocCxcIlxcXFxuXCIpO3RyeXt0aGlzLmZvcm0uc3VibWl0KCl9Y2F0Y2godCl7fXRoaXMuaWZyYW1lLmF0dGFjaEV2ZW50P3RoaXMuaWZyYW1lLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe1wiY29tcGxldGVcIj09PW8uaWZyYW1lLnJlYWR5U3RhdGUmJnIoKX06dGhpcy5pZnJhbWUub25sb2FkPXJ9fSkuY2FsbChlLGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXN9KCkpfSxmdW5jdGlvbih0LGUscil7ZnVuY3Rpb24gbih0KXt2YXIgZT10JiZ0LmZvcmNlQmFzZTY0O2UmJih0aGlzLnN1cHBvcnRzQmluYXJ5PSExKSx0aGlzLnBlck1lc3NhZ2VEZWZsYXRlPXQucGVyTWVzc2FnZURlZmxhdGUsdGhpcy51c2luZ0Jyb3dzZXJXZWJTb2NrZXQ9byYmIXQuZm9yY2VOb2RlLHRoaXMucHJvdG9jb2xzPXQucHJvdG9jb2xzLHRoaXMudXNpbmdCcm93c2VyV2ViU29ja2V0fHwodT1pKSxzLmNhbGwodGhpcyx0KX12YXIgbyxpLHM9cigxNyksYT1yKDE4KSxjPXIoMjYpLHA9cigyNyksaD1yKDI4KTtyKDMpKFwiZW5naW5lLmlvLWNsaWVudDp3ZWJzb2NrZXRcIik7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHNlbGYpdHJ5e2k9cigzMSl9Y2F0Y2godCl7fWVsc2Ugbz1zZWxmLldlYlNvY2tldHx8c2VsZi5Nb3pXZWJTb2NrZXQ7dmFyIHU9b3x8aTt0LmV4cG9ydHM9bixwKG4scyksbi5wcm90b3R5cGUubmFtZT1cIndlYnNvY2tldFwiLG4ucHJvdG90eXBlLnN1cHBvcnRzQmluYXJ5PSEwLG4ucHJvdG90eXBlLmRvT3Blbj1mdW5jdGlvbigpe2lmKHRoaXMuY2hlY2soKSl7dmFyIHQ9dGhpcy51cmkoKSxlPXRoaXMucHJvdG9jb2xzLHI9e2FnZW50OnRoaXMuYWdlbnQscGVyTWVzc2FnZURlZmxhdGU6dGhpcy5wZXJNZXNzYWdlRGVmbGF0ZX07ci5wZng9dGhpcy5wZngsci5rZXk9dGhpcy5rZXksci5wYXNzcGhyYXNlPXRoaXMucGFzc3BocmFzZSxyLmNlcnQ9dGhpcy5jZXJ0LHIuY2E9dGhpcy5jYSxyLmNpcGhlcnM9dGhpcy5jaXBoZXJzLHIucmVqZWN0VW5hdXRob3JpemVkPXRoaXMucmVqZWN0VW5hdXRob3JpemVkLHRoaXMuZXh0cmFIZWFkZXJzJiYoci5oZWFkZXJzPXRoaXMuZXh0cmFIZWFkZXJzKSx0aGlzLmxvY2FsQWRkcmVzcyYmKHIubG9jYWxBZGRyZXNzPXRoaXMubG9jYWxBZGRyZXNzKTt0cnl7dGhpcy53cz10aGlzLnVzaW5nQnJvd3NlcldlYlNvY2tldCYmIXRoaXMuaXNSZWFjdE5hdGl2ZT9lP25ldyB1KHQsZSk6bmV3IHUodCk6bmV3IHUodCxlLHIpfWNhdGNoKHQpe3JldHVybiB0aGlzLmVtaXQoXCJlcnJvclwiLHQpfXZvaWQgMD09PXRoaXMud3MuYmluYXJ5VHlwZSYmKHRoaXMuc3VwcG9ydHNCaW5hcnk9ITEpLHRoaXMud3Muc3VwcG9ydHMmJnRoaXMud3Muc3VwcG9ydHMuYmluYXJ5Pyh0aGlzLnN1cHBvcnRzQmluYXJ5PSEwLHRoaXMud3MuYmluYXJ5VHlwZT1cIm5vZGVidWZmZXJcIik6dGhpcy53cy5iaW5hcnlUeXBlPVwiYXJyYXlidWZmZXJcIix0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCl9fSxuLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVycz1mdW5jdGlvbigpe3ZhciB0PXRoaXM7dGhpcy53cy5vbm9wZW49ZnVuY3Rpb24oKXt0Lm9uT3BlbigpfSx0aGlzLndzLm9uY2xvc2U9ZnVuY3Rpb24oKXt0Lm9uQ2xvc2UoKX0sdGhpcy53cy5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7dC5vbkRhdGEoZS5kYXRhKX0sdGhpcy53cy5vbmVycm9yPWZ1bmN0aW9uKGUpe3Qub25FcnJvcihcIndlYnNvY2tldCBlcnJvclwiLGUpfX0sbi5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gZSgpe3IuZW1pdChcImZsdXNoXCIpLHNldFRpbWVvdXQoZnVuY3Rpb24oKXtyLndyaXRhYmxlPSEwLHIuZW1pdChcImRyYWluXCIpfSwwKX12YXIgcj10aGlzO3RoaXMud3JpdGFibGU9ITE7Zm9yKHZhciBuPXQubGVuZ3RoLG89MCxpPW47bzxpO28rKykhZnVuY3Rpb24odCl7YS5lbmNvZGVQYWNrZXQodCxyLnN1cHBvcnRzQmluYXJ5LGZ1bmN0aW9uKG8pe2lmKCFyLnVzaW5nQnJvd3NlcldlYlNvY2tldCl7dmFyIGk9e307aWYodC5vcHRpb25zJiYoaS5jb21wcmVzcz10Lm9wdGlvbnMuY29tcHJlc3MpLHIucGVyTWVzc2FnZURlZmxhdGUpe3ZhciBzPVwic3RyaW5nXCI9PXR5cGVvZiBvP0J1ZmZlci5ieXRlTGVuZ3RoKG8pOm8ubGVuZ3RoO3M8ci5wZXJNZXNzYWdlRGVmbGF0ZS50aHJlc2hvbGQmJihpLmNvbXByZXNzPSExKX19dHJ5e3IudXNpbmdCcm93c2VyV2ViU29ja2V0P3Iud3Muc2VuZChvKTpyLndzLnNlbmQobyxpKX1jYXRjaCh0KXt9LS1ufHxlKCl9KX0odFtvXSl9LG4ucHJvdG90eXBlLm9uQ2xvc2U9ZnVuY3Rpb24oKXtzLnByb3RvdHlwZS5vbkNsb3NlLmNhbGwodGhpcyl9LG4ucHJvdG90eXBlLmRvQ2xvc2U9ZnVuY3Rpb24oKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgdGhpcy53cyYmdGhpcy53cy5jbG9zZSgpfSxuLnByb3RvdHlwZS51cmk9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLnF1ZXJ5fHx7fSxlPXRoaXMuc2VjdXJlP1wid3NzXCI6XCJ3c1wiLHI9XCJcIjt0aGlzLnBvcnQmJihcIndzc1wiPT09ZSYmNDQzIT09TnVtYmVyKHRoaXMucG9ydCl8fFwid3NcIj09PWUmJjgwIT09TnVtYmVyKHRoaXMucG9ydCkpJiYocj1cIjpcIit0aGlzLnBvcnQpLHRoaXMudGltZXN0YW1wUmVxdWVzdHMmJih0W3RoaXMudGltZXN0YW1wUGFyYW1dPWgoKSksdGhpcy5zdXBwb3J0c0JpbmFyeXx8KHQuYjY0PTEpLHQ9Yy5lbmNvZGUodCksdC5sZW5ndGgmJih0PVwiP1wiK3QpO3ZhciBuPXRoaXMuaG9zdG5hbWUuaW5kZXhPZihcIjpcIikhPT0tMTtyZXR1cm4gZStcIjovL1wiKyhuP1wiW1wiK3RoaXMuaG9zdG5hbWUrXCJdXCI6dGhpcy5ob3N0bmFtZSkrcit0aGlzLnBhdGgrdH0sbi5wcm90b3R5cGUuY2hlY2s9ZnVuY3Rpb24oKXtyZXR1cm4hKCF1fHxcIl9faW5pdGlhbGl6ZVwiaW4gdSYmdGhpcy5uYW1lPT09bi5wcm90b3R5cGUubmFtZSl9fSxmdW5jdGlvbih0LGUpe30sZnVuY3Rpb24odCxlKXt2YXIgcj1bXS5pbmRleE9mO3QuZXhwb3J0cz1mdW5jdGlvbih0LGUpe2lmKHIpcmV0dXJuIHQuaW5kZXhPZihlKTtmb3IodmFyIG49MDtuPHQubGVuZ3RoOysrbilpZih0W25dPT09ZSlyZXR1cm4gbjtyZXR1cm4tMX19LGZ1bmN0aW9uKHQsZSxyKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsZSxyKXt0aGlzLmlvPXQsdGhpcy5uc3A9ZSx0aGlzLmpzb249dGhpcyx0aGlzLmlkcz0wLHRoaXMuYWNrcz17fSx0aGlzLnJlY2VpdmVCdWZmZXI9W10sdGhpcy5zZW5kQnVmZmVyPVtdLHRoaXMuY29ubmVjdGVkPSExLHRoaXMuZGlzY29ubmVjdGVkPSEwLHRoaXMuZmxhZ3M9e30sciYmci5xdWVyeSYmKHRoaXMucXVlcnk9ci5xdWVyeSksdGhpcy5pby5hdXRvQ29ubmVjdCYmdGhpcy5vcGVuKCl9dmFyIG89XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0saT1yKDQpLHM9cig1KSxhPXIoMzQpLGM9cigzNSkscD1yKDM2KSxoPShyKDMpKFwic29ja2V0LmlvLWNsaWVudDpzb2NrZXRcIikscigyNikpLHU9cigyMCk7dC5leHBvcnRzPWU9bjt2YXIgZj17Y29ubmVjdDoxLGNvbm5lY3RfZXJyb3I6MSxjb25uZWN0X3RpbWVvdXQ6MSxjb25uZWN0aW5nOjEsZGlzY29ubmVjdDoxLGVycm9yOjEscmVjb25uZWN0OjEscmVjb25uZWN0X2F0dGVtcHQ6MSxyZWNvbm5lY3RfZmFpbGVkOjEscmVjb25uZWN0X2Vycm9yOjEscmVjb25uZWN0aW5nOjEscGluZzoxLHBvbmc6MX0sbD1zLnByb3RvdHlwZS5lbWl0O3Mobi5wcm90b3R5cGUpLG4ucHJvdG90eXBlLnN1YkV2ZW50cz1mdW5jdGlvbigpe2lmKCF0aGlzLnN1YnMpe3ZhciB0PXRoaXMuaW87dGhpcy5zdWJzPVtjKHQsXCJvcGVuXCIscCh0aGlzLFwib25vcGVuXCIpKSxjKHQsXCJwYWNrZXRcIixwKHRoaXMsXCJvbnBhY2tldFwiKSksYyh0LFwiY2xvc2VcIixwKHRoaXMsXCJvbmNsb3NlXCIpKV19fSxuLnByb3RvdHlwZS5vcGVuPW4ucHJvdG90eXBlLmNvbm5lY3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jb25uZWN0ZWQ/dGhpczoodGhpcy5zdWJFdmVudHMoKSx0aGlzLmlvLm9wZW4oKSxcIm9wZW5cIj09PXRoaXMuaW8ucmVhZHlTdGF0ZSYmdGhpcy5vbm9wZW4oKSx0aGlzLmVtaXQoXCJjb25uZWN0aW5nXCIpLHRoaXMpfSxuLnByb3RvdHlwZS5zZW5kPWZ1bmN0aW9uKCl7dmFyIHQ9YShhcmd1bWVudHMpO3JldHVybiB0LnVuc2hpZnQoXCJtZXNzYWdlXCIpLHRoaXMuZW1pdC5hcHBseSh0aGlzLHQpLHRoaXN9LG4ucHJvdG90eXBlLmVtaXQ9ZnVuY3Rpb24odCl7aWYoZi5oYXNPd25Qcm9wZXJ0eSh0KSlyZXR1cm4gbC5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpczt2YXIgZT1hKGFyZ3VtZW50cykscj17dHlwZToodm9pZCAwIT09dGhpcy5mbGFncy5iaW5hcnk/dGhpcy5mbGFncy5iaW5hcnk6dShlKSk/aS5CSU5BUllfRVZFTlQ6aS5FVkVOVCxkYXRhOmV9O3JldHVybiByLm9wdGlvbnM9e30sci5vcHRpb25zLmNvbXByZXNzPSF0aGlzLmZsYWdzfHwhMSE9PXRoaXMuZmxhZ3MuY29tcHJlc3MsXCJmdW5jdGlvblwiPT10eXBlb2YgZVtlLmxlbmd0aC0xXSYmKHRoaXMuYWNrc1t0aGlzLmlkc109ZS5wb3AoKSxyLmlkPXRoaXMuaWRzKyspLHRoaXMuY29ubmVjdGVkP3RoaXMucGFja2V0KHIpOnRoaXMuc2VuZEJ1ZmZlci5wdXNoKHIpLHRoaXMuZmxhZ3M9e30sdGhpc30sbi5wcm90b3R5cGUucGFja2V0PWZ1bmN0aW9uKHQpe3QubnNwPXRoaXMubnNwLHRoaXMuaW8ucGFja2V0KHQpfSxuLnByb3RvdHlwZS5vbm9wZW49ZnVuY3Rpb24oKXtpZihcIi9cIiE9PXRoaXMubnNwKWlmKHRoaXMucXVlcnkpe3ZhciB0PVwib2JqZWN0XCI9PT1vKHRoaXMucXVlcnkpP2guZW5jb2RlKHRoaXMucXVlcnkpOnRoaXMucXVlcnk7dGhpcy5wYWNrZXQoe3R5cGU6aS5DT05ORUNULHF1ZXJ5OnR9KX1lbHNlIHRoaXMucGFja2V0KHt0eXBlOmkuQ09OTkVDVH0pfSxuLnByb3RvdHlwZS5vbmNsb3NlPWZ1bmN0aW9uKHQpe3RoaXMuY29ubmVjdGVkPSExLHRoaXMuZGlzY29ubmVjdGVkPSEwLGRlbGV0ZSB0aGlzLmlkLHRoaXMuZW1pdChcImRpc2Nvbm5lY3RcIix0KX0sbi5wcm90b3R5cGUub25wYWNrZXQ9ZnVuY3Rpb24odCl7dmFyIGU9dC5uc3A9PT10aGlzLm5zcCxyPXQudHlwZT09PWkuRVJST1ImJlwiL1wiPT09dC5uc3A7aWYoZXx8cilzd2l0Y2godC50eXBlKXtjYXNlIGkuQ09OTkVDVDp0aGlzLm9uY29ubmVjdCgpO2JyZWFrO2Nhc2UgaS5FVkVOVDp0aGlzLm9uZXZlbnQodCk7YnJlYWs7Y2FzZSBpLkJJTkFSWV9FVkVOVDp0aGlzLm9uZXZlbnQodCk7YnJlYWs7Y2FzZSBpLkFDSzp0aGlzLm9uYWNrKHQpO2JyZWFrO2Nhc2UgaS5CSU5BUllfQUNLOnRoaXMub25hY2sodCk7YnJlYWs7Y2FzZSBpLkRJU0NPTk5FQ1Q6dGhpcy5vbmRpc2Nvbm5lY3QoKTticmVhaztjYXNlIGkuRVJST1I6dGhpcy5lbWl0KFwiZXJyb3JcIix0LmRhdGEpfX0sbi5wcm90b3R5cGUub25ldmVudD1mdW5jdGlvbih0KXt2YXIgZT10LmRhdGF8fFtdO251bGwhPXQuaWQmJmUucHVzaCh0aGlzLmFjayh0LmlkKSksdGhpcy5jb25uZWN0ZWQ/bC5hcHBseSh0aGlzLGUpOnRoaXMucmVjZWl2ZUJ1ZmZlci5wdXNoKGUpfSxuLnByb3RvdHlwZS5hY2s9ZnVuY3Rpb24odCl7dmFyIGU9dGhpcyxyPSExO3JldHVybiBmdW5jdGlvbigpe2lmKCFyKXtyPSEwO3ZhciBuPWEoYXJndW1lbnRzKTtlLnBhY2tldCh7dHlwZTp1KG4pP2kuQklOQVJZX0FDSzppLkFDSyxpZDp0LGRhdGE6bn0pfX19LG4ucHJvdG90eXBlLm9uYWNrPWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuYWNrc1t0LmlkXTtcImZ1bmN0aW9uXCI9PXR5cGVvZiBlJiYoZS5hcHBseSh0aGlzLHQuZGF0YSksZGVsZXRlIHRoaXMuYWNrc1t0LmlkXSl9LG4ucHJvdG90eXBlLm9uY29ubmVjdD1mdW5jdGlvbigpe3RoaXMuY29ubmVjdGVkPSEwLHRoaXMuZGlzY29ubmVjdGVkPSExLHRoaXMuZW1pdChcImNvbm5lY3RcIiksdGhpcy5lbWl0QnVmZmVyZWQoKX0sbi5wcm90b3R5cGUuZW1pdEJ1ZmZlcmVkPWZ1bmN0aW9uKCl7dmFyIHQ7Zm9yKHQ9MDt0PHRoaXMucmVjZWl2ZUJ1ZmZlci5sZW5ndGg7dCsrKWwuYXBwbHkodGhpcyx0aGlzLnJlY2VpdmVCdWZmZXJbdF0pO2Zvcih0aGlzLnJlY2VpdmVCdWZmZXI9W10sdD0wO3Q8dGhpcy5zZW5kQnVmZmVyLmxlbmd0aDt0KyspdGhpcy5wYWNrZXQodGhpcy5zZW5kQnVmZmVyW3RdKTt0aGlzLnNlbmRCdWZmZXI9W119LG4ucHJvdG90eXBlLm9uZGlzY29ubmVjdD1mdW5jdGlvbigpe3RoaXMuZGVzdHJveSgpLHRoaXMub25jbG9zZShcImlvIHNlcnZlciBkaXNjb25uZWN0XCIpfSxuLnByb3RvdHlwZS5kZXN0cm95PWZ1bmN0aW9uKCl7aWYodGhpcy5zdWJzKXtmb3IodmFyIHQ9MDt0PHRoaXMuc3Vicy5sZW5ndGg7dCsrKXRoaXMuc3Vic1t0XS5kZXN0cm95KCk7dGhpcy5zdWJzPW51bGx9dGhpcy5pby5kZXN0cm95KHRoaXMpfSxuLnByb3RvdHlwZS5jbG9zZT1uLnByb3RvdHlwZS5kaXNjb25uZWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29ubmVjdGVkJiZ0aGlzLnBhY2tldCh7dHlwZTppLkRJU0NPTk5FQ1R9KSx0aGlzLmRlc3Ryb3koKSx0aGlzLmNvbm5lY3RlZCYmdGhpcy5vbmNsb3NlKFwiaW8gY2xpZW50IGRpc2Nvbm5lY3RcIiksdGhpc30sbi5wcm90b3R5cGUuY29tcHJlc3M9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZmxhZ3MuY29tcHJlc3M9dCx0aGlzfSxuLnByb3RvdHlwZS5iaW5hcnk9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZmxhZ3MuYmluYXJ5PXQsdGhpc319LGZ1bmN0aW9uKHQsZSl7ZnVuY3Rpb24gcih0LGUpe3ZhciByPVtdO2U9ZXx8MDtmb3IodmFyIG49ZXx8MDtuPHQubGVuZ3RoO24rKylyW24tZV09dFtuXTtyZXR1cm4gcn10LmV4cG9ydHM9cn0sZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKHQsZSxyKXtyZXR1cm4gdC5vbihlLHIpLHtkZXN0cm95OmZ1bmN0aW9uKCl7dC5yZW1vdmVMaXN0ZW5lcihlLHIpfX19dC5leHBvcnRzPXJ9LGZ1bmN0aW9uKHQsZSl7dmFyIHI9W10uc2xpY2U7dC5leHBvcnRzPWZ1bmN0aW9uKHQsZSl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGUmJihlPXRbZV0pLFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUpdGhyb3cgbmV3IEVycm9yKFwiYmluZCgpIHJlcXVpcmVzIGEgZnVuY3Rpb25cIik7dmFyIG49ci5jYWxsKGFyZ3VtZW50cywyKTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZS5hcHBseSh0LG4uY29uY2F0KHIuY2FsbChhcmd1bWVudHMpKSl9fX0sZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKHQpe3Q9dHx8e30sdGhpcy5tcz10Lm1pbnx8MTAwLHRoaXMubWF4PXQubWF4fHwxZTQsdGhpcy5mYWN0b3I9dC5mYWN0b3J8fDIsdGhpcy5qaXR0ZXI9dC5qaXR0ZXI+MCYmdC5qaXR0ZXI8PTE/dC5qaXR0ZXI6MCx0aGlzLmF0dGVtcHRzPTB9dC5leHBvcnRzPXIsci5wcm90b3R5cGUuZHVyYXRpb249ZnVuY3Rpb24oKXt2YXIgdD10aGlzLm1zKk1hdGgucG93KHRoaXMuZmFjdG9yLHRoaXMuYXR0ZW1wdHMrKyk7aWYodGhpcy5qaXR0ZXIpe3ZhciBlPU1hdGgucmFuZG9tKCkscj1NYXRoLmZsb29yKGUqdGhpcy5qaXR0ZXIqdCk7dD0wPT0oMSZNYXRoLmZsb29yKDEwKmUpKT90LXI6dCtyfXJldHVybiAwfE1hdGgubWluKHQsdGhpcy5tYXgpfSxyLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuYXR0ZW1wdHM9MH0sci5wcm90b3R5cGUuc2V0TWluPWZ1bmN0aW9uKHQpe3RoaXMubXM9dH0sci5wcm90b3R5cGUuc2V0TWF4PWZ1bmN0aW9uKHQpe3RoaXMubWF4PXR9LHIucHJvdG90eXBlLnNldEppdHRlcj1mdW5jdGlvbih0KXt0aGlzLmppdHRlcj10fX1dKX0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c29ja2V0LmlvLnNsaW0uanMubWFwIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwiLy9pbXBvcnQgY3NzIGZyb20gJy4vc3R5bGUuY3NzJztcbmltcG9ydCBzdHlsIGZyb20gJy4vc3R5bGUuc3R5bCc7XG5pbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudC9kaXN0L3NvY2tldC5pby5zbGltJ1xuLy9jb25zb2xlLmxvZyhjc3MsIHN0eWwudG9TdHJpbmcoKSk7XG5cbihmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIlxuXHRjb25zdCBzb2NrZXRVcmwgPSAnaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvc29ja2V0LmlvLzEuNy40L3NvY2tldC5pby5taW4uanMnXG5cblx0Y29uc3QgQXBwID0ge1xuXHRcdGlzQ29ubmVjdGVkOiBmYWxzZSxcblx0XHRtZXRyaWNzOiB7fSxcblx0XHRhY2Nlc3NUb2tlbjogJycsXG5cdFx0cGVuZGluZ1NlYXJjaDogW10sXG5cdFx0c29ja2V0OiB7fSxcblx0XHRzZWFyY2hSZXN1bHQ6IHt9LFxuXHRcdG5vUmVzdWx0OiBbXSxcblx0XHRyZXF1ZXN0ZWRTb25nczogW10sXG5cdFx0YXBwTmFtZTogJzEwMzAnLFxuXHRcdHZpcE1vZGU6IHtcblx0XHRcdGxpbWl0OiAwLFxuXHRcdFx0dXVpZDogMCxcblx0XHRcdGluc3RhOiAnJyxcblx0XHRcdGNsdWI6ICcnXG5cdFx0fSxcblx0XHRhZGRTY3JpcHRzOiAgYXN5bmMgZnVuY3Rpb24oYXJyYXkpe1xuXHRcdFx0dmFyIHByb21pc2VzID0gW107XG5cdFx0XHR2YXIgaG9va1NjcmlwdHMgPSBmdW5jdGlvbih1cmwsIHNyYykge1xuXHRcdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3Qpe1xuXHRcdFx0XHRcdHZhciBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcblx0XHRcdFx0XHRzLnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xuXHRcdFx0XHRcdHMuc2V0QXR0cmlidXRlKCdhc3luYycsJ2ZhbHNlJylcblx0XHRcdFx0XHRzLm9ubG9hZCA9ICgpPT57cmVzb2x2ZSh1cmwpfTtcblx0XHRcdFx0XHRzLm9uZXJyb3IgPSAoKT0+e3JlamVjdChgJHt1cmx9IGRpZCBub3QgbG9hZGApfTtcblx0XHRcdFx0XHRzLnNyYyA9IHVybCB8fCBudWxsO1xuXHRcdFx0XHRcdHMuaW5uZXJIVE1MID0gc3JjIHx8IG51bGw7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdLmFwcGVuZENoaWxkKHMpO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0XG5cdFx0XHR9O1xuXHRcdFx0YXJyYXkuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dmFyIGV4aXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihgc2NyaXB0W3NyYz1cIiR7aXRlbX1cIl1gKTtcblx0XHRcdFx0aWYoIWV4aXN0KXtcblx0XHRcdFx0XHRwcm9taXNlcy5wdXNoKGhvb2tTY3JpcHRzKGl0ZW0pKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzKVxuXHRcdH0sXG5cdFx0aXNPbmxpbmU6IGFzeW5jIGZ1bmN0aW9uKCl7XG5cdFx0XHRjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luXG5cdFx0XHR0cnl7XG5cdFx0XHRcdGNvbnN0IHJlcXVlc3QgPSBhd2FpdCBmZXRjaCgnaHR0cHM6Ly9zdHlsZW1pbmlvbnMuY28vYXBpL3JhZGlvJyx7XG5cdFx0XHRcdG1vZGU6ICduby1jb3JzJyxcdFxuXHRcdFx0XHRwYXJhbXM6e3VybH1cblx0XHRcdFx0fSlcblx0XHRcdH1jYXRjaChlKXtcblx0XHRcdFx0Y29uc29sZS5sb2cobmV3IEVycm9yKGUpKVxuXHRcdFx0fWZpbmFsbHkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZVxuXHRcdFx0fVxuXHRcdFx0Ly9yZXR1cm4gdHJ1ZVxuXHRcdFx0XG5cdFx0fSxcblx0XHRsYXVuY2hBcHA6IGFzeW5jIGZ1bmN0aW9uKCl7XG5cdFx0XHRjb25zdCBpc09ubGluZSA9IGF3YWl0IHRoaXMuaXNPbmxpbmUoKVxuXHRcdFx0aWYgKGlzT25saW5lKSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly9jb25zdCBib29tID0gYXdhaXQgdGhpcy5hZGRTY3JpcHRzKFtzb2NrZXRVcmxdKVxuXHRcdFx0XHRcdGlmKHRydWUpe1xuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3NvY2tldC5pbyBpbiBpbiB0aGUgRE9NJylcblx0XHRcdFx0XHRcdHRoaXMuc29ja2V0ID0gaW8oJ2h0dHBzOi8vYmxlc3NteXJlcXVlc3QuY29tJylcblx0XHRcdFx0XHRcdC8vIHRoaXMuc29ja2V0ID0gaW8oJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMCcpXG5cdFx0XHRcdFx0XHR0aGlzLnNldFVwU29ja2V0KClcblxuXHRcdFx0XHRcdFx0Ly8gbGV0IGhtbSA9ICcnO1xuXHRcdFx0XHRcdFx0Ly8gZm9yKGxldCB4ID0gMDsgeDw3OyB4Kyspe1xuXHRcdFx0XHRcdFx0Ly8gXHRjb25zdCBwYXlsb2FkID0ge3Nvbmc6YGlkYSBzb25nJHt4fWAsYXJ0aXN0OmBpZGEke3h9YCxpbWFnZTonaHR0cHM6Ly9hdmF0YXJzMC5naXRodWJ1c2VyY29udGVudC5jb20vdS8yODYyOTQxND9zPTQ2MCZ2PTQnLGluZGV4Onh9XG5cdFx0XHRcdFx0XHQvLyBcdGhtbSArPSB0aGlzLnJlc3VsdEh0bWwocGF5bG9hZClcblx0XHRcdFx0XHRcdC8vIH1cblx0XHRcdFx0XHRcdGNvbnN0IGhlYWRFbGVtZW50ID0gZG9jdW1lbnQuaGVhZFxuXHRcdFx0XHRcdFx0Y29uc3QgYm9keUVsZW1lbnQgPSBkb2N1bWVudC5ib2R5XG5cdFx0XHRcdFx0XHRjb25zdCBlbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jylcblx0XHRcdFx0XHRcdGNvbnN0IHN0eWxlRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcblx0XHRcdFx0XHRcdGVsZW0uY2xhc3NMaXN0LmFkZCgnYm1yLWNvbnRhaW5lcicpXG5cdFx0XHRcdFx0XHR0aGlzLnJlbmRlcihzdHlsLnRvU3RyaW5nKCksc3R5bGVFbGVtKVxuXHRcdFx0XHRcdFx0dGhpcy5yZW5kZXIodGhpcy5hcHBIdG1sKCksZWxlbSlcblx0XHRcdFx0XHRcdGhlYWRFbGVtZW50LmFwcGVuZENoaWxkKHN0eWxlRWxlbSlcblx0XHRcdFx0XHRcdGJvZHlFbGVtZW50LmFwcGVuZENoaWxkKGVsZW0pXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGVycm9yKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW5kZXI6IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgbm9kZSkge1xuXHRcdFx0aWYgKCFub2RlKSByZXR1cm5cblx0XHRcdG5vZGUuaW5uZXJIVE1MID0gdGVtcGxhdGVcblx0XHR9LFx0XG5cdFx0c2V0VXBTb2NrZXQ6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5zb2NrZXQub24oJ2Nvbm5lY3QnLCAoZGF0YSk9Pntcblx0XHRcdFx0dGhpcy5pc0Nvbm5lY3RlZCA9IHRydWVcblx0XHRcdFx0dGhpcy5zb2NrZXQuZW1pdCgnYXVkaWVuY2UnLHthcHBOYW1lOnRoaXMuYXBwTmFtZSxpZDp0aGlzLnNvY2tldC5pZCx0YXNrOidwb3B1bGF0aW9uJ30pO1xuXHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhLCAnY29ubmVjdGVkIHRvIHNlcnZlcicpO1xuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnNvY2tldC5vbignZGlzY29ubmVjdCcsIChkYXRhKT0+e1xuXHRcdFx0XHRcdHRoaXMuaXNDb25uZWN0ZWQgPSBmYWxzZVxuXHRcdFx0fSk7XG5cdFx0XHR0aGlzLnNvY2tldC5vbigncmVjb25uZWN0JywgKGRhdGEpPT57XG5cdFx0XHRcdFx0dGhpcy5pc0Nvbm5lY3RlZCA9IHRydWVcblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5zb2NrZXQub24oJ3NlbmRNZXRyaWNzJywoZGF0YSk9Pntcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKGRhdGEsJ21ldHJpYyBkYXRhJyk7XG5cdFx0XHRcdFx0aWYoZGF0YS5hcHBOYW1lID09PSB0aGlzLmFwcE5hbWUgJiYgJ3Rhc2snIGluIGRhdGEgJiYgZGF0YS50YXNrID09PSAncmVxdWVzdCcpe1xuXHRcdFx0XHRcdFx0XHR0aGlzLm1ldHJpY3MgPSBkYXRhO1xuXHRcdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0dGhpcy5zb2NrZXQub24oJ25ld1Rva2VuJywoZGF0YSk9Pntcblx0XHRcdFx0XHR0aGlzLmFjY2Vzc1Rva2VuID0gZGF0YVxuXHRcdFx0XHRcdGlmKHRoaXMucGVuZGluZ1NlYXJjaC5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHRcdFx0dGhpcy5zZWFyY2hUcmFjaygpXG5cdFx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHR0b2dnbGVBcHBEaXNwbGF5OiBmdW5jdGlvbigpe1xuXHRcdFx0Y29uc3QgZG9jID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXHRcdFx0Y29uc3QgY2lyY2xlID0gZG9jLnN0eWxlLmdldFByb3BlcnR5VmFsdWUoJy0tY2lyY2xlLWJtcicpXG5cdFx0XHQvL2NvbnN0IHJlcXVlc3RDb250YWluZXIgPSBkb2Muc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS1yZXF1ZXN0LWNvbnRhaW5lcicpXG5cdFx0XHRpZihjaXJjbGUgPT09ICdmbGV4JyB8fCBjaXJjbGUgPT09ICcnKXtcblx0XHRcdFx0ZG9jLnN0eWxlLnNldFByb3BlcnR5KCctLWNpcmNsZS1ibXInLCdub25lJylcblx0XHRcdFx0ZG9jLnN0eWxlLnNldFByb3BlcnR5KCctLXJlcXVlc3QtY29udGFpbmVyJywnZmxleCcpXG5cdFx0XHR9ZWxzZXtcblx0XHRcdFx0ZG9jLnN0eWxlLnNldFByb3BlcnR5KCctLWNpcmNsZS1ibXInLCdmbGV4Jylcblx0XHRcdFx0ZG9jLnN0eWxlLnNldFByb3BlcnR5KCctLXJlcXVlc3QtY29udGFpbmVyJywnbm9uZScpXG5cdFx0XHR9XG5cblx0XHR9LFxuXHRcdGFwcEh0bWwoKXtcblx0XHRcdHJldHVybiBgXG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJjaXJjbGUtYm1yXCIgb25jbGljaz1cImJtci50b2dnbGVBcHBEaXNwbGF5KClcIj5cblx0XHRcdFx0XHQ8c3Bhbj5zb25nPC9zcGFuPlxuXHRcdFx0XHRcdDxzcGFuPnJlcXVlc3Q8L3NwYW4+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVxdWVzdC1jb250YWluZXJcIj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2VhcmNoLWNvbnRhaW5lclwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImNsb3NlXCIgb25jbGljaz1cImJtci50b2dnbGVBcHBEaXNwbGF5KClcIj5cblx0XHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJibXItaWNvbnMgdGFibGV0LWRlc2t0b3BcIj5rZXlib2FyZF9hcnJvd19kb3duPC9pPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwic2VhcmNoLWNvbXBvbmVudFwiPlxuXHRcdFx0XHRcdFx0XHQ8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwic2VhcmNoXCIgb25rZXl1cD1cImJtci5zZWFyY2hFbnRlcihldmVudClcIiBcblx0XHRcdFx0XHRcdFx0XHRwbGFjZWhvbGRlcj1cIlNlYXJjaCB0cmFja3NcIiBhdXRvY29tcGxldGU9XCJvZmZcIj5cblx0XHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImJ0bi1ibXJcIiBvbmNsaWNrPVwiYm1yLnNlYXJjaFRyYWNrKClcIj48aSBjbGFzcz1cImJtci1pY29uc1wiPnNlYXJjaDwvaT48L2Rpdj5cblx0XHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRcdDxkaXYgY2xhc3M9XCJyZXN1bHQtY29udGFpbmVyXCI+PC9kaXY+XG5cdFx0XHRcdDwvZGl2PiAgICAgICAgICAgIFxuXHRcdFx0YFxuXHRcdH0sXG5cdFx0cmVzdWx0SHRtbDogKGRhdGEpID0+IHtcblx0XHRcdGNvbnN0IGFscmVhZHlSZXF1ZXN0ZWQgPSBkYXRhLmFscmVhZHlSZXF1ZXN0ZWQgPyAncmVxdWVzdGVkJyA6ICcnXG5cdFx0XHRyZXR1cm4gYFxuXHRcdFx0XHQ8ZGl2IGNsYXNzPVwicmVzdWx0IHotZGVwdGgtMyByZXN1bHQtJHtkYXRhLmlkfSAke2FscmVhZHlSZXF1ZXN0ZWR9XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cImltYWdlXCI+XG5cdFx0XHRcdFx0XHQ8aW1nIHNyYz1cIiR7ZGF0YS5pbWFnZX1cIiBhbHQ9XCJpbWFnZVwiPlxuXHRcdFx0XHRcdFx0PHNwYW4gY2xhc3M9XCJidG4tYm1yIGJ0bi1zbWFsbC1ibXIgbGVhZC1mYWJcIj48aSBjbGFzcz1cImJtci1pY29uc1wiPmNoZWNrPC9pPjwvc3Bhbj5cblx0XHRcdFx0XHQ8L2Rpdj5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInJlc3VsdC1kZXRhaWxzXCI+XG5cdFx0XHRcdFx0XHQ8c3Bhbj4ke2RhdGEuc29uZ308L3NwYW4+XG5cdFx0XHRcdFx0XHQ8c3Bhbj4ke2RhdGEuYXJ0aXN0fTwvc3Bhbj5cblx0XHRcdFx0XHQ8L2Rpdj5cblx0XHRcdFx0XHQ8ZGl2IGNsYXNzPVwiYnV0dG9uLWJtclwiIG9uY2xpY2s9XCJibXIuc2VuZFJlcXVlc3QoJyR7ZGF0YS5pZH0nKVwiPlxuXHRcdFx0XHRcdFx0PGRpdiBjbGFzcz1cImJ0bi1ibXJcIj5cblx0XHRcdFx0XHRcdFx0PGkgY2xhc3M9XCJibXItaWNvbnNcIj5zZW5kPC9pPlxuXHRcdFx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdFx0PC9kaXY+XHRcdFx0XHRcdFx0ICAgICBcblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRgXG5cdFx0fSxcblx0XHRub1Jlc3VsdEh0bWw6ICgpID0+IHtcblx0XHRcdHJldHVybiBgXG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInotZGVwdGgtMyByZXN1bHQgcmVzdWx0LW5vbmVcIj5cblx0XHRcdFx0XHRcdDxzcGFuPlNvcnJ5ISEgQ2FuJ3QgZmluZCB0aGF0IHNvbmcuPC9zcGFuPlxuXHRcdFx0XHRcdFx0PHNwYW4+U2VhcmNoIGZvciBhbm90aGVyIHNvbmcuPC9zcGFuPlxuXHRcdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHRgXG5cdFx0fSxcblx0XHRyZW5kZXJEYXRhKG9iaiwgdGVtcGxhdGUsIG5vZGUpe1xuXHRcdFx0bGV0IGh0bWwgPSAnJ1xuXHRcdFx0b2JqLmZvckVhY2goaXRlbSA9PiBodG1sICs9IHRlbXBsYXRlKGl0ZW0pKVxuXHRcdFx0dGhpcy5yZW5kZXIoaHRtbCwgbm9kZSlcblx0XHR9LFxuXHRcdHNhZmUodmFsdWUpe1xuXHRcdFx0aWYgKHZhbHVlID09PSAnJyB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBmYWxzZSl7XG5cdFx0XHRcdHJldHVybiBmYWxzZVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWVcblx0XHR9LFxuXHRcdGFzeW5jIHNlYXJjaFRyYWNrKCl7XG5cdFx0XHR0aGlzLnNlYXJjaElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJtci1jb250YWluZXIgaW5wdXQnKS52YWx1ZVxuXHRcdFx0aWYodGhpcy5zYWZlKHRoaXMuc2VhcmNoSW5wdXQpKXtcblx0XHRcdFx0XHR0aGlzLmxvYWRlciA9IHRydWVcblx0XHRcdFx0XHRsZXQgdG9rZW4gPSB0aGlzLmFjY2Vzc1Rva2VuXG5cdFx0XHRcdFx0bGV0IHF1ZXJ5ID0gZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuc2VhcmNoSW5wdXQpXG5cdFx0XHRcdFx0bGV0IHR5cGUgPSAndHJhY2snXG5cdFx0XHRcdFx0Y29uc3QgcmVzdWx0Q29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3VsdC1jb250YWluZXInKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKHRoaXMuc2VhcmNoSW5wdXQpXG5cblx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgaHR0cHM6Ly9hcGkuc3BvdGlmeS5jb20vdjEvc2VhcmNoP3E9JHtxdWVyeX0mdHlwZT0ke3R5cGV9JmFjY2Vzc190b2tlbj0ke3Rva2VufWApXG5cdFx0XHRcdFx0XHRjb25zdCBkYXRhID0gcmVzcG9uc2Uuc3RhdHVzID09PSAyMDAgPyBhd2FpdCByZXNwb25zZS5qc29uKCkgOiAnZmFpbCdcblx0XHRcdFx0XHRcdGlmKGRhdGEgIT09ICdmYWlsJyl7XG5cdFx0XHRcdFx0XHRcdHRoaXMuc2VhcmNoUmVzdWx0ID0gZGF0YS50cmFja3MuaXRlbXMubWFwKChpdGVtKT0+e1xuXHRcdFx0XHRcdFx0XHRcdFx0bGV0IG9iaiA9IHt9XG5cdFx0XHRcdFx0XHRcdFx0XHRvYmouaW1hZ2UgPSBpdGVtLmFsYnVtLmltYWdlc1sxXS51cmxcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5zb25nID0gaXRlbS5uYW1lXG5cdFx0XHRcdFx0XHRcdFx0XHRvYmouYXJ0aXN0ID0gaXRlbS5hcnRpc3RzLm1hcCgoaXRlbSk9PiBpdGVtLm5hbWUpLmpvaW4oJywgJylcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5pZCA9IGl0ZW0uaWRcblx0XHRcdFx0XHRcdFx0XHRcdG9iai5hbHJlYWR5UmVxdWVzdGVkID0gIFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnJlcXVlc3RlZFNvbmdzLmZpbmQoKGkpID0+IGkgPT09IGl0ZW0uaWQpICE9PSB1bmRlZmluZWRcblxuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIG9ialxuXHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHR0aGlzLm5vUmVzdWx0ID0gKHRoaXMuc2VhcmNoUmVzdWx0Lmxlbmd0aCA9PT0gMCkgPyB0cnVlIDogZmFsc2Vcblx0XHRcdFx0XHRcdFx0dGhpcy5wZW5kaW5nU2VhcmNoID0gW11cblx0XHRcdFx0XHRcdFx0aWYodGhpcy5ub1Jlc3VsdCl7XG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5yZW5kZXIodGhpcy5ub1Jlc3VsdEh0bWwoKSxyZXN1bHRDb250YWluZXIpXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFx0XHRcdHRoaXMucmVuZGVyRGF0YSh0aGlzLnNlYXJjaFJlc3VsdCx0aGlzLnJlc3VsdEh0bWwscmVzdWx0Q29udGFpbmVyKVxuXHRcdFx0XHRcdFx0XHR9XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0dGhpcy5sb2FkZXIgPSBmYWxzZTtcblx0XHRcdFx0XHRcdH1lbHNlIGlmKGRhdGEgPT09ICdmYWlsJyl7XG5cdFx0XHRcdFx0XHRcdHRoaXMucGVuZGluZ1NlYXJjaC5wdXNoKHRoaXMuc2VhcmNoSW5wdXQpXG5cdFx0XHRcdFx0XHRcdHRoaXMuc29ja2V0LmVtaXQoJ25ld1Rva2VuUGxlYXNlJylcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKG5ldyBFcnJvcihlcnJvcikpXG5cdFx0XHRcdFx0fSBmaW5hbGx5IHtcblx0XHRcdFx0XHRcdFx0Ly9sZXQgcGF5bG9hZCA9IHt0cmFja1Rhc2s6J3NlYXJjaCcsc2VhcmNoOnRoaXMuc2VhcmNoSW5wdXQsIHRpbWVzdGFtcDptb21lbnQoKS50b0lTT1N0cmluZygpLGRvbWFpbjpsb2NhdGlvbi5ob3N0fVxuXHRcdFx0XHRcdFx0XHQvL3RoaXMudHJhY2tBY3Rpb24ocGF5bG9hZClcblx0XHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRzZWFyY2hFbnRlcihldmVudCl7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBrZXlDb2RlID0gIGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XG5cdFx0XHRcdGlmKGtleUNvZGUgPT09IDEzKXtcblx0XHRcdFx0XHR0aGlzLnNlYXJjaFRyYWNrKClcblx0XHRcdFx0XHRldmVudC50YXJnZXQuYmx1cigpXG5cdFx0XHRcdH1cblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihlcnJvcilcblx0XHRcdH1cdFx0XHRcblx0XHR9LFxuXHRcdHNlbmRSZXF1ZXN0KGlkKXtcblx0XHRcdGlmKHRoaXMuc2FmZShpZCkgJiYgdGhpcy5pc0Nvbm5lY3RlZCA9PT0gdHJ1ZSl7XG5cdFx0XHRcdFx0Y29uc3QgcGF5bG9hZCA9IHRoaXMuc2VhcmNoUmVzdWx0LmZpbmQoKGl0ZW0pID0+IGl0ZW0uaWQgPT09IGlkKVxuXHRcdFx0XHRcdGNvbnN0IG5vdFJlcXVlc3RlZCA9IHRoaXMucmVxdWVzdGVkU29uZ3MuZmluZCgoaXRlbSkgPT4gaXRlbSA9PT0gaWQpID09PSB1bmRlZmluZWRcblx0XHRcdFx0XHRpZih0aGlzLnNhZmUocGF5bG9hZCkgJiYgbm90UmVxdWVzdGVkKXtcblx0XHRcdFx0XHRcdHBheWxvYWQudGltZXN0YW1wID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG5cdFx0XHRcdFx0XHRjb25zb2xlLmxvZyhwYXlsb2FkKVxuXHRcdFx0XHRcdFx0dGhpcy5zb2NrZXQuZW1pdCgnYXVkaWVuY2UnLHtcblx0XHRcdFx0XHRcdFx0YXBwTmFtZTp0aGlzLmFwcE5hbWUsXG5cdFx0XHRcdFx0XHRcdGlkOnRoaXMuc29ja2V0LmlkLFxuXHRcdFx0XHRcdFx0XHR0YXNrOidyZXF1ZXN0Jyxcblx0XHRcdFx0XHRcdFx0c29uZzpwYXlsb2FkLFxuXHRcdFx0XHRcdFx0XHR2aXA6IHRoaXMudmlwTW9kZSxcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAucmVzdWx0LSR7aWR9YCkuY2xhc3NMaXN0LmFkZCgncmVxdWVzdGVkJylcblx0XHRcdFx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybihlcnJvcilcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHRoaXMucmVxdWVzdGVkU29uZ3MucHVzaChwYXlsb2FkLmlkKVxuXHRcdFx0XHRcdFx0cGF5bG9hZC50cmFja1Rhc2sgPSAncmVxdWVzdCdcblx0XHRcdFx0XHRcdHBheWxvYWQuZG9tYWluID0gbG9jYXRpb24uaG9zdFxuXHRcdFx0XHRcdFx0Ly90aGlzLnRyYWNrQWN0aW9uKHBheWxvYWQpXG5cdFx0XHRcdFx0fVx0XHRcdFx0XHRcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cblx0Ly9Mb2NrIEFwcCBtZXRob2RzIHRvIGJlIGltbXV0YWJsZVxuXHRPYmplY3Qua2V5cyhBcHApLm1hcCgoaXRlbSkgPT4gdHlwZW9mIEFwcFtpdGVtXSA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcHAsIGl0ZW0sIHsgY29uZmlndXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IGZhbHNlIH0pIDogbnVsbClcblx0d2luZG93LmJtciA9IEFwcFxuXHRBcHAubGF1bmNoQXBwKClcbn0pKCk7IiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIikoZmFsc2UpO1xuLy8gTW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCI6cm9vdCB7XFxuICAtLWNpcmNsZS1ibXI6IGZsZXg7XFxuICAtLXJlcXVlc3QtY29udGFpbmVyOiBub25lO1xcbiAgLS1tYWluLWJtcjogbGluZWFyLWdyYWRpZW50KDEyMGRlZywgIzkyZmU5ZCAwJSwgIzAwYzlmZiAxMDclKTtcXG4gIC0tZGFyay10aGVtZS1ibXI6ICMyNTI1MjU7XFxufVxcbi5ibXItY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIGJvdHRvbTogMDtcXG4gIHJpZ2h0OiAwO1xcbiAgd2lkdGg6IGF1dG87XFxuICBoZWlnaHQ6IGF1dG87XFxuICB6LWluZGV4OiAxMDAwMDA7XFxuLyogTW9iaWxlIFJlc3BvbnNpdmUgc3R5bGUgKi9cXG4vKiBUYWJsZXQgUmVzcG9uc2l2ZSBzdHlsZSAqL1xcbi8qIERlc2t0b3AgUmVzcG9uc2l2ZSBzdHlsZSAqL1xcbi8qIGZhbGxiYWNrICovXFxufVxcbi5ibXItY29udGFpbmVyIC5jaXJjbGUtYm1yIHtcXG4gIHdpZHRoOiAxMDBweDtcXG4gIGhlaWdodDogMTAwcHg7XFxuICBiYWNrZ3JvdW5kOiB2YXIoLS1tYWluLWJtcik7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDIwcHg7XFxuICByaWdodDogNSU7XFxuICBkaXNwbGF5OiB2YXIoLS1jaXJjbGUtYm1yKTtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBjb2xvcjogI2ZmZjtcXG4gIG1hcmdpbjogMCAxMHB4O1xcbn1cXG4uYm1yLWNvbnRhaW5lciAucmVxdWVzdC1jb250YWluZXIge1xcbiAgd2lkdGg6IDEwMHZ3O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIGRpc3BsYXk6IHZhcigtLXJlcXVlc3QtY29udGFpbmVyKTtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbmltYXRpb246IHNsaWRlVXAgMC4ycyBlYXNlLWluO1xcbn1cXG4uYm1yLWNvbnRhaW5lciAuc2VhcmNoLWNvbnRhaW5lciB7XFxuICBvcmRlcjogMTtcXG4gIGZsZXgtYmFzaXM6IDQwJTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLDAsMCwwLjYzOSk7XFxufVxcbi5ibXItY29udGFpbmVyIC5yZXN1bHQtY29udGFpbmVyIHtcXG4gIG9yZGVyOiAyO1xcbiAgZmxleC1iYXNpczogNjAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tZGFyay10aGVtZS1ibXIpO1xcbiAgb3ZlcmZsb3cteTogc2Nyb2xsO1xcbiAgc2Nyb2xsLWJlaGF2aW9yOiBzbW9vdGg7XFxuICAtd2Via2l0LW92ZXJmbG93LXNjcm9sbGluZzogdG91Y2g7XFxufVxcbi5ibXItY29udGFpbmVyIC5yZXN1bHQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIG1hcmdpbjogMTBweCAwO1xcbiAgaGVpZ2h0OiA3NXB4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGJhY2tncm91bmQ6IHZhcigtLWRhcmstdGhlbWUtYm1yKTtcXG4gIGFuaW1hdGlvbjogc2xpZGVVcCAwLjVzIGxpbmVhcjtcXG59XFxuLmJtci1jb250YWluZXIgLnJlc3VsdC5yZXN1bHQtbm9uZSB7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcbi5ibXItY29udGFpbmVyIGltZyB7XFxuICB3aWR0aDogNzBweDtcXG59XFxuLmJtci1jb250YWluZXIgLmltYWdlLFxcbi5ibXItY29udGFpbmVyIC5idXR0b24tYm1yLFxcbi5ibXItY29udGFpbmVyIC5yZXN1bHQtZGV0YWlscyB7XFxuICBwYWRkaW5nOiAwIDAuNzVyZW07XFxufVxcbi5ibXItY29udGFpbmVyIC5yZXN1bHQgLmltYWdlIHtcXG4gIGZsZXgtYmFzaXM6IDMwJTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuLmJtci1jb250YWluZXIgLnJlc3VsdCAuYnV0dG9uLWJtciB7XFxuICBmbGV4LWJhc2lzOiAzMCU7XFxuICBhbGlnbi1zZWxmOiBjZW50ZXI7XFxufVxcbi5ibXItY29udGFpbmVyIC5yZXN1bHQgLmJ1dHRvbi1ibXIgLmJ0bi1ibXIge1xcbiAgbWFyZ2luOiAwIGF1dG87XFxufVxcbi5ibXItY29udGFpbmVyIC5yZXN1bHQtZGV0YWlscyB7XFxuICBmbGV4LWJhc2lzOiA2MCU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG59XFxuLmJtci1jb250YWluZXIgLnJlc3VsdC1kZXRhaWxzIHNwYW4sXFxuLmJtci1jb250YWluZXIgLmJ1dHRvbi1ibXIgLmJ0bi1ibXIge1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG4uYm1yLWNvbnRhaW5lciAucmVzdWx0LWRldGFpbHMgc3BhbjpudGgtY2hpbGQoMSksXFxuLmJtci1jb250YWluZXIgLnJlc3VsdC1ub25lIHNwYW4sXFxuLmJtci1jb250YWluZXIgLmJ0bi1ibXIge1xcbiAgY29sb3I6ICNmZmY7XFxufVxcbi5ibXItY29udGFpbmVyIC5yZXN1bHQtZGV0YWlscyBzcGFuOm50aC1jaGlsZCgyKSB7XFxuICBjb2xvcjogIzllOWU5ZTtcXG59XFxuLmJtci1jb250YWluZXIgLmJ0bi1ibXIge1xcbiAgd2lkdGg6IDQwcHg7XFxuICBoZWlnaHQ6IDQwcHg7XFxuICBib3JkZXItcmFkaXVzOiA1MCU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgYmFja2dyb3VuZDogdmFyKC0tbWFpbi1ibXIpO1xcbn1cXG4uYm1yLWNvbnRhaW5lciBpbnB1dFt0eXBlPXRleHRdIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICM5ZTllOWU7XFxuICBib3JkZXItcmFkaXVzOiAwO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGhlaWdodDogM3JlbTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgZm9udC1zaXplOiAxNnB4O1xcbiAgbWFyZ2luOiAwIDAgOHB4IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZmxleC1iYXNpczogNzAlO1xcbn1cXG4uYm1yLWNvbnRhaW5lciBpbnB1dFt0eXBlPXRleHRdOjpwbGFjZWhvbGRlciB7XFxuICBjb2xvcjogIzk1OTU5NTtcXG59XFxuLmJtci1jb250YWluZXIgaW5wdXRbdHlwZT10ZXh0XTpmb2N1cyB7XFxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgIzEzZDBmMjtcXG4gIGJveC1zaGFkb3c6IDAgMXB4IDAgMCAjMTNkMGYyO1xcbn1cXG4uYm1yLWNvbnRhaW5lciAuei1kZXB0aC0zIHtcXG4gIGJveC1zaGFkb3c6IDAgOHB4IDE3cHggMnB4IHJnYmEoMCwwLDAsMC4xNCksIDAgM3B4IDE0cHggMnB4IHJnYmEoMCwwLDAsMC4xMiksIDAgNXB4IDVweCAtM3B4IHJnYmEoMCwwLDAsMC4yKTtcXG59XFxuLmJtci1jb250YWluZXIgLnNlYXJjaC1jb21wb25lbnQge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtYmFzaXM6IDUwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBwYWRkaW5nOiAwJSA1JTtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG59XFxuLmJtci1jb250YWluZXIgLmNsb3NlIHtcXG4gIGZsZXgtYmFzaXM6IDUwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbn1cXG4uYm1yLWNvbnRhaW5lciAuY2xvc2UgaSB7XFxuICBmb250LXNpemU6IDY2cHg7XFxuICBjb2xvcjogI2ZmZjtcXG59XFxuLmJtci1jb250YWluZXIgLmxlYWQtZmFiIHtcXG4gIGJvdHRvbTogLTNweDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHJpZ2h0OiA3cHg7XFxufVxcbi5ibXItY29udGFpbmVyIC5idG4tYm1yLmJ0bi1zbWFsbC1ibXIge1xcbiAgd2lkdGg6IDI3cHg7XFxuICBoZWlnaHQ6IDI3cHg7XFxufVxcbi5ibXItY29udGFpbmVyIC5pbWFnZSAuYnRuLWJtciB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG4uYm1yLWNvbnRhaW5lciAucmVxdWVzdGVkIC5pbWFnZSAuYnRuLWJtciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuLmJtci1jb250YWluZXIgLnJlcXVlc3RlZCAuYnV0dG9uLWJtciAuYnRuLWJtciB7XFxuICBvcGFjaXR5OiAwLjI7XFxufVxcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNzQ5cHgpIHtcXG4gIC5ibXItY29udGFpbmVyIC50YWJsZXQtZGVza3RvcCB7XFxuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG4gIH1cXG59XFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiA3NTBweCkge1xcbiAgLmJtci1jb250YWluZXIgLnJlcXVlc3QtY29udGFpbmVyIHtcXG4gICAgd2lkdGg6IDU2dnc7XFxuICAgIGhlaWdodDogNjB2aDtcXG4gIH1cXG4gIC5ibXItY29udGFpbmVyIC5tb2JpbGUsXFxuICAuYm1yLWNvbnRhaW5lciAuZGVza3RvcCB7XFxuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG4gIH1cXG59XFxuQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMjgwcHgpIHtcXG4gIC5ibXItY29udGFpbmVyIC5yZXF1ZXN0LWNvbnRhaW5lciB7XFxuICAgIHdpZHRoOiAzNXZ3O1xcbiAgICBoZWlnaHQ6IDY1dmg7XFxuICB9XFxuICAuYm1yLWNvbnRhaW5lciAubW9iaWxlLFxcbiAgLmJtci1jb250YWluZXIgLnRhYmxldCB7XFxuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG4gIH1cXG59XFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogJ01hdGVyaWFsIEljb25zJztcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XFxuICBzcmM6IHVybChcXFwiaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbS9zL21hdGVyaWFsaWNvbnMvdjQzL2ZsVWhScTZ0elpjbFFFSi1WZGctSXVpYURzTmMud29mZjJcXFwiKSBmb3JtYXQoJ3dvZmYyJyk7XFxufVxcbi5ibXItY29udGFpbmVyIC5ibXItaWNvbnMge1xcbiAgZm9udC1mYW1pbHk6ICdNYXRlcmlhbCBJY29ucyc7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcbiAgZm9udC1zaXplOiAyNHB4O1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgd29yZC13cmFwOiBub3JtYWw7XFxuICBkaXJlY3Rpb246IGx0cjtcXG4gIC13ZWJraXQtZm9udC1mZWF0dXJlLXNldHRpbmdzOiAnbGlnYSc7XFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG59XFxuQC1tb3ota2V5ZnJhbWVzIHNsaWRlVXAge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDEwMCUsIDApO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogbm9uZTtcXG4gIH1cXG59XFxuQC13ZWJraXQta2V5ZnJhbWVzIHNsaWRlVXAge1xcbiAgMCUge1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDAsIDEwMCUsIDApO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIHRyYW5zZm9ybTogbm9uZTtcXG4gIH1cXG59XFxuQC1vLWtleWZyYW1lcyBzbGlkZVVwIHtcXG4gIDAlIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAxMDAlLCAwKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IG5vbmU7XFxuICB9XFxufVxcbkBrZXlmcmFtZXMgc2xpZGVVcCB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMTAwJSwgMCk7XFxuICB9XFxuICAxMDAlIHtcXG4gICAgdHJhbnNmb3JtOiBub25lO1xcbiAgfVxcbn1cXG5cIiwgXCJcIl0pO1xuXG4iXSwic291cmNlUm9vdCI6IiJ9