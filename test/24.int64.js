#!/usr/bin/env mocha -R spec

/*jshint -W053 */

var Long = require("long");

var assert = require("assert");
var msgpackJS = "../index";
var isBrowser = ("undefined" !== typeof window);
var msgpack = isBrowser && window.msgpack || require(msgpackJS);
var TITLE = __filename.replace(/^.*\//, "");

describe(TITLE, function() {
  var options = {};

  it("createCodec({int64: true})", function() {
    var codec = msgpack.createCodec({int64: true});
    assert.ok(codec);
    options.codec = codec;
  });

  it("Long unsigned", function() {
    [
      0, 1, Math.pow(2, 16), Math.pow(2, 32), Math.pow(2, 48)
    ].forEach(function(value) {
      var source = Long.fromNumber(value, true);
      assert.equal(+source, value);
      var encoded = msgpack.encode(source, options);
      assert.equal(encoded[0], 0xcf);
      assert.equal(encoded.length, 9);
      var decoded = msgpack.decode(encoded, options);
      assert.equal(+decoded, value);
    });

    [
      "0", "1", "123456789abcdef0", "fedcba9876543210"
    ].forEach(function(value) {
      var source = Long.fromString(value, true, 16);
      assert.equal(source.toString(16), value);
      var encoded = msgpack.encode(source, options);
      assert.equal(encoded[0], 0xcf);
      assert.equal(encoded.length, 9);
      var decoded = msgpack.decode(encoded, options);
      assert.equal(decoded.toString(16), value);
    });
  });

  it("Long signed", function() {
    [
      0, 1, Math.pow(2, 16), Math.pow(2, 32), Math.pow(2, 48),
      -1, -Math.pow(2, 16), -Math.pow(2, 32), -Math.pow(2, 48)
    ].forEach(function(value) {
      var source = Long.fromNumber(value);
      assert.equal(+source, value);
      var encoded = msgpack.encode(source, options);
      assert.equal(encoded[0], 0xd3);
      assert.equal(encoded.length, 9);
      var decoded = msgpack.decode(encoded, options);
      assert.equal(+decoded, value);
    });

    [
      "0", "1", "-1", "123456789abcdef0", "-123456789abcdef0"
    ].forEach(function(value) {
      var source = Long.fromString(value, false, 16);
      assert.equal(source.toString(16), value);
      var encoded = msgpack.encode(source, options);
      assert.equal(encoded[0], 0xd3);
      assert.equal(encoded.length, 9);
      var decoded = msgpack.decode(encoded, options);
      assert.equal(decoded.toString(16), value);
    });
  });
});
