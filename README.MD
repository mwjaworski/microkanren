# Micro Kanren

[![Coverage Status](https://coveralls.io/repos/github/simple-ui/di/badge.svg?branch=master)](https://coveralls.io/github/simple-ui/di?branch=master)
[![Build Status](https://travis-ci.org/simple-ui/microkanren.svg?branch=master)](https://travis-ci.org/simple-ui/microkanren)
[![Dependency Status](https://david-dm.org/simple-ui/microkanren.svg)](https://david-dm.org/simple-ui/microkanren.svg?style=flat-square)
[![npm version](https://badge.fury.io/js/simple-ui_microkanren.svg)](https://badge.fury.io/js/simple-ui_microkanren)

A dependency injection library using TypeScript decorators.

## Install

Install with npm.

```sh
npm install --save simple-ui_microkanren
```

Install with bower.

```sh
bower install --save simple-ui_microkanren
```

## Setup

The library uses ES6 exports for all decorators and the main DI object. To import the full library into a file you can destructure the export object.

```TypeScript
import {  } from 'simple-ui_microkanren';
```

## Terminology

| Term             | Meaning                                                                                                                                 |
|:-----------------|:----------------------------------------------------------------------------------------------------------------------------------------|
| Logical Variable | The identifier of a logic variable; used to track the results of logic operations.                                                      |
| Substitution     | A dictionary of variable-term bindings.                                                                                                 |
| State            | A state encapsulates the substitution s, which encompasses current variable-term bindings                                               |
| Stream           | A potentially infinite sequence of states.                                                                                              |
| Goal             | A goal to be pursued within the received state. A successful goal returns a non-empty stream, containing the states which satisfied it. |

### Stream

A stream may be:

1. _empty_
2. _mature or answer-bearing_ when the head is a state that has already been computed
3. _immature_ when the head is a thunk containing a delayed computation

## Future Enhancements

A list of future enhancements.

-
