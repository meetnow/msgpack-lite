#!/usr/bin/env bash -c make

SRC=./lib/browser.js
LIB=./index.js ./lib/*.js
TESTS=./test/*.js
TESTS_BROWSER=./test/[12]?.*.js
HINTS=$(LIB) $(TESTS) ./*.json ./test/*.json
CLASS=longmsgpack
DIST=./dist
JSTEMP=./dist/longmsgpack.browserify.js
JSDEST=./dist/longmsgpack.min.js

all: test $(JSDEST)

clean:
	rm -fr $(JSDEST) $(JSTEMP)

$(DIST):
	mkdir -p $(DIST)

$(JSTEMP): $(LIB) $(DIST)
	./node_modules/.bin/browserify -s $(CLASS) $(SRC) -o $(JSTEMP) --debug

$(JSDEST): $(JSTEMP)
	./node_modules/.bin/uglifyjs $(JSTEMP) -c -m -r Buffer -o $(JSDEST)
	ls -lh $(JSDEST)

test:
	@if [ "x$(BROWSER)" = "x" ]; then make test-node; else make test-browser; fi

mocha:
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint $(HINTS)

test-node: jshint mocha

bench:
	node lib/benchmark.js 1

.PHONY: all clean test jshint mocha bench test-node test-browser test-browser-local
