# msgpack-long-lite [![npm version](https://badge.fury.io/js/msgpack-long-lite.svg)](http://badge.fury.io/js/msgpack-long-lite) [![Build Status](https://travis-ci.org/meetnow/msgpack-long-lite.svg?branch=master)](https://travis-ci.org/meetnow/msgpack-long-lite)

Fast Pure JavaScript MessagePack Encoder and Decoder using long.js

### Features

- Pure JavaScript only (No node-gyp nor gcc required)
- Faster than any other pure JavaScript libraries on node.js v4
- Even faster than node-gyp C++ based [msgpack](https://www.npmjs.com/package/msgpack) library (**90% faster** on encoding)
- Streaming encoding and decoding interface is also available. It's more faster.
- Ready for Web browsers including Chrome, Firefox, Safari and even IE8
- [Tested](https://travis-ci.org/meetnow/msgpack-long-lite) on Node.js v0.10, v0.12, v4, v5, v6 and v7
- Uses [long.js](https://github.com/dcodeIO/long.js) to represent 64-bit integers instead of [int64-buffer](https://github.com/kawanet/int64-buffer)

### Encoding and Decoding MessagePack

```js
var msgpack = require("msgpack-long-lite");

// encode from JS Object to MessagePack (Buffer)
var buffer = msgpack.encode({"foo": "bar"});

// decode from MessagePack (Buffer) to JS Object
var data = msgpack.decode(buffer); // => {"foo": "bar"}

// if encode/decode receives an invalid argument an error is thrown
```

### Writing to MessagePack Stream

```js
var fs = require("fs");
var msgpack = require("msgpack-long-lite");

var writeStream = fs.createWriteStream("test.msp");
var encodeStream = msgpack.createEncodeStream();
encodeStream.pipe(writeStream);

// send multiple objects to stream
encodeStream.write({foo: "bar"});
encodeStream.write({baz: "qux"});

// call this once you're done writing to the stream.
encodeStream.end();
```

### Reading from MessagePack Stream

```js
var fs = require("fs");
var msgpack = require("msgpack-long-lite");

var readStream = fs.createReadStream("test.msp");
var decodeStream = msgpack.createDecodeStream();

// show multiple objects decoded from stream
readStream.pipe(decodeStream).on("data", console.warn);
```

### Decoding MessagePack Bytes Array

```js
var msgpack = require("msgpack-long-lite");

// decode() accepts Buffer instance per default
msgpack.decode(Buffer([0x81, 0xA3, 0x66, 0x6F, 0x6F, 0xA3, 0x62, 0x61, 0x72]));

// decode() also accepts Array instance
msgpack.decode([0x81, 0xA3, 0x66, 0x6F, 0x6F, 0xA3, 0x62, 0x61, 0x72]);

// decode() accepts raw Uint8Array instance as well
msgpack.decode(new Uint8Array([0x81, 0xA3, 0x66, 0x6F, 0x6F, 0xA3, 0x62, 0x61, 0x72]));
```

### Installation

```sh
$ npm install --save msgpack-long-lite
```

### Tests

Run tests on node.js:

```sh
$ make test
```

### Browser Build

Browser version [longmsgpack.min.js](https://rawgit.com/meetnow/msgpack-long-lite/master/dist/longmsgpack.min.js) is also available. 55KB minified, 16KB gziped.

```html
<!--[if lte IE 9]>
<script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.1.10/es5-shim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js"></script>
<![endif]-->
<script src="https://rawgit.com/meetnow/msgpack-long-lite/master/dist/longmsgpack.min.js"></script>
<script>
// encode from JS Object to MessagePack (Uint8Array)
var buffer = msgpack.encode({foo: "bar"});

// decode from MessagePack (Uint8Array) to JS Object
var array = new Uint8Array([0x81, 0xA3, 0x66, 0x6F, 0x6F, 0xA3, 0x62, 0x61, 0x72]);
var data = msgpack.decode(array);
</script>
```

### MessagePack With Browserify

Step #1: write some code at first.

```js
var msgpack = require("msgpack-long-lite");
var buffer = msgpack.encode({"foo": "bar"});
var data = msgpack.decode(buffer);
console.warn(data); // => {"foo": "bar"}
```

Proceed to the next steps if you prefer faster browserify compilation time.

Step #2: add `browser` property on `package.json` in your project. This refers the global `msgpack` object instead of including whole of `msgpack-long-lite` source code.

```json
{
  "dependencies": {
    "msgpack-long-lite": "*"
  },
  "browser": {
    "msgpack-long-lite": "msgpack-long-lite/global"
  }
}
```

Step #3: compile it with [browserify](https://www.npmjs.com/package/browserify) and [uglifyjs](https://www.npmjs.com/package/uglify-js).

```sh
browserify src/main.js -o tmp/main.browserify.js -s main
uglifyjs tmp/main.browserify.js -m -c -o js/main.min.js
cp node_modules/msgpack-long-lite/dist/longmsgpack.min.js js/longmsgpack.min.js
```

Step #4: load [longmsgpack.min.js](https://rawgit.com/meetnow/msgpack-long-lite/master/dist/longmsgpack.min.js) before your code.

```html
<script src="js/longmsgpack.min.js"></script>
<script src="js/main.min.js"></script>
```

### Interoperability

It is tested to have basic compatibility with other Node.js MessagePack modules below:

- [https://www.npmjs.com/package/msgpack](https://www.npmjs.com/package/msgpack) (1.0.2)
- [https://www.npmjs.com/package/msgpack-js](https://www.npmjs.com/package/msgpack-js) (0.3.0)
- [https://www.npmjs.com/package/msgpack-js-v5](https://www.npmjs.com/package/msgpack-js-v5) (0.3.0-v5)
- [https://www.npmjs.com/package/msgpack-unpack](https://www.npmjs.com/package/msgpack-unpack) (2.1.1)
- [https://github.com/msgpack/msgpack-javascript](https://github.com/msgpack/msgpack-javascript) (msgpack.codec)
- [https://www.npmjs.com/package/msgpack5](https://www.npmjs.com/package/msgpack5) (3.3.0)
- [https://www.npmjs.com/package/notepack](https://www.npmjs.com/package/notepack) (0.0.2)

### Benchmarks

A benchmark tool `lib/benchmark.js` is available to compare encoding/decoding speed
(operation per second) with other MessagePack modules.
It counts operations of [1KB JSON document](https://github.com/meetnow/msgpack-long-lite/blob/master/test/example.json) in 10 seconds.

```sh
$ npm install msgpack msgpack-js msgpack-js-v5 msgpack-unpack msgpack5 notepack
$ npm run benchmark 10
```

Streaming benchmark tool `lib/benchmark-stream.js` is also available.
It counts milliseconds for 1,000,000 operations of 30 bytes fluentd msgpack fragment.
This shows streaming encoding and decoding are super faster.

```sh
$ npm run benchmark-stream 2
```

### MessagePack Mapping Table

The following table shows how JavaScript objects (value) will be mapped to 
[MessagePack formats](https://github.com/msgpack/msgpack/blob/master/spec.md)
and vice versa.

Source Value|MessagePack Format|Value Decoded
----|----|----
null, undefined|nil format family|null
Boolean (true, false)|bool format family|Boolean (true, false)
Number (32bit int)|int format family|Number (int or double)
Number (64bit double)|float format family|Number (double)
String|str format family|String
Buffer|bin format family|Buffer
Array|array format family|Array
Map|map format family|Map (if `usemap=true`)
Object (plain object)|map format family|Object (or Map if `usemap=true`)
Object (see below)|ext format family|Object (see below)

Note that both `null` and `undefined` are mapped to nil `0xC1` type.
This means `undefined` value will be *upgraded* to `null` in other words.

### Extension Types

The MessagePack specification allows 128 application-specific extension types. 
The library uses the following types to make round-trip conversion possible
for JavaScript native objects.

Type|Object|Type|Object
----|----|----|----
0x00||0x10|
0x01|EvalError|0x11|Int8Array
0x02|RangeError|0x12|Uint8Array
0x03|ReferenceError|0x13|Int16Array
0x04|SyntaxError|0x14|Uint16Array
0x05|TypeError|0x15|Int32Array
0x06|URIError|0x16|Uint32Array
0x07||0x17|Float32Array
0x08||0x18|Float64Array
0x09||0x19|Uint8ClampedArray
0x0A|RegExp|0x1A|ArrayBuffer
0x0B|Boolean|0x1B|Buffer
0x0C|String|0x1C|
0x0D|Date|0x1D|DataView
0x0E|Error|0x1E|
0x0F|Number|0x1F|

Other extension types are mapped to built-in ExtBuffer object.

### Custom Extension Types (Codecs)

Register a custom extension type number to serialize/deserialize your own class instances.

```js
var msgpack = require("msgpack-long-lite");

var codec = msgpack.createCodec();
codec.addExtPacker(0x3F, MyVector, myVectorPacker);
codec.addExtUnpacker(0x3F, myVectorUnpacker);

var data = new MyVector(1, 2);
var encoded = msgpack.encode(data, {codec: codec});
var decoded = msgpack.decode(encoded, {codec: codec});

function MyVector(x, y) {
  this.x = x;
  this.y = y;
}

function myVectorPacker(vector) {
  var array = [vector.x, vector.y];
  return msgpack.encode(array); // return Buffer serialized
}

function myVectorUnpacker(buffer) {
  var array = msgpack.decode(buffer);
  return new MyVector(array[0], array[1]); // return Object deserialized
}
```

The first argument of `addExtPacker` and `addExtUnpacker` should be an integer within the range of 0 and 127 (0x0 and 0x7F). `myClassPacker` is a function that accepts an instance of `MyClass`, and should return a buffer representing that instance. `myClassUnpacker` is the opposite: it accepts a buffer and should return an instance of `MyClass`.

If you pass an array of functions to `addExtPacker` or `addExtUnpacker`, the value to be encoded/decoded will pass through each one in order. This allows you to do things like this:

```js
codec.addExtPacker(0x00, Date, [Number, msgpack.encode]);
```

You can also pass the `codec` option to `msgpack.Decoder(options)`, `msgpack.Encoder(options)`, `msgpack.createEncodeStream(options)`, and `msgpack.createDecodeStream(options)`.

If you wish to modify the default built-in codec, you can access it at `msgpack.codec.preset`.

### Custom Codec Options

`msgpack.createCodec()` function accepts some options.

It does NOT have the preset extension types defined when no options given.

```js
var codec = msgpack.createCodec();
```

`preset`: It has the preset extension types described above.

```js
var codec = msgpack.createCodec({preset: true});
```

`safe`: It runs a validation of the value before writing it into buffer. This is the default behavior for some old browsers which do not support `ArrayBuffer` object.

```js
var codec = msgpack.createCodec({safe: true});
```

`useraw`: It uses `raw` formats instead of `bin` and `str`.

```js
var codec = msgpack.createCodec({useraw: true});
```

`int64`: It decodes msgpack's `int64`/`uint64` formats with [long.js](https://github.com/dcodeIO/long.js) object.

```js
var codec = msgpack.createCodec({int64: true});
```

`binarraybuffer`: It ties msgpack's `bin` format with `ArrayBuffer` object, instead of `Buffer` object.

```js
var codec = msgpack.createCodec({binarraybuffer: true, preset: true});
```

`uint8array`: It returns Uint8Array object when encoding, instead of `Buffer` object.

```js
var codec = msgpack.createCodec({uint8array: true});
```

`usemap`: Uses the global JavaScript Map type, if available, to unpack
MessagePack map elements.

```js
var codec = msgpack.createCodec({usemap: true});
```

### Compatibility Mode

The compatibility mode respects for [msgpack's old spec](https://github.com/msgpack/msgpack/blob/master/spec-old.md). Set `true` to `useraw`.

```js
// default mode handles both str and bin formats individually
msgpack.encode("Aa"); // => <Buffer a2 41 61> (str format)
msgpack.encode(new Buffer([0x41, 0x61])); // => <Buffer c4 02 41 61> (bin format)

msgpack.decode(new Buffer([0xa2, 0x41, 0x61])); // => 'Aa' (String)
msgpack.decode(new Buffer([0xc4, 0x02, 0x41, 0x61])); // => <Buffer 41 61> (Buffer)

// compatibility mode handles only raw format both for String and Buffer
var options = {codec: msgpack.createCodec({useraw: true})};
msgpack.encode("Aa", options); // => <Buffer a2 41 61> (raw format)
msgpack.encode(new Buffer([0x41, 0x61]), options); // => <Buffer a2 41 61> (raw format)

msgpack.decode(new Buffer([0xa2, 0x41, 0x61]), options); // => <Buffer 41 61> (Buffer)
msgpack.decode(new Buffer([0xa2, 0x41, 0x61]), options).toString(); // => 'Aa' (String)
```

### Repository

- [https://github.com/meetnow/msgpack-long-lite](https://github.com/meetnow/msgpack-long-lite)

### See Also

- [http://msgpack.org/](http://msgpack.org/)

### License

The MIT License (MIT)

Original work Copyright (c) 2015 Yusuke Kawasaki
Modified work Copyright (c) 2017 Patrick Schneider

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
