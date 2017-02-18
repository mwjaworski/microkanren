import 'mocha';
import { assert } from 'chai';
import { ILogicVariable, uKanren as u } from '../lib/index';
import * as _ from 'lodash';

describe('MicroKanren Data Types', () => {
    
  it(`a fresh variable`, () => {
    
    const variable = u.fresh();
    
    assert(typeof variable.id === 'string', `A logical variable identifies itself`);
    
  });

  it(`an empty stream will return failed lookup values`, () => {
    
    const stream = u.stream();
    const variable = u.fresh();

    assert(stream.lookup(1) === 1, `A stream will return values`);
    assert(stream.lookup(variable) === variable, `A stream will return variables`);
   
  });

  it(`a success and fail goal will produce a new substitution`, () => {
    
    const stream = u.stream();
    const substitutionSuccess = u.success(stream);
    const substitutionFailure = u.failure(stream);

    assert(substitutionSuccess[0] === stream, `A success will return a substitution with the value inside`);
    assert(substitutionSuccess.length === 1, `A success will return a single stream in the substitution`);
    assert(substitutionFailure.length === 0, `A failure will return an empty substitution`);
   
  });

  it(`a unification handles values, logical variables, and substitutions`, () => {
    
    const variable = u.fresh();
    const stream = u.stream();

    const substitutionA = u.unify(1, 2)(u.stream());
    const substitutionB = u.unify(variable, 2)(u.stream());
    const substitutionC = u.unify([], [])(u.stream());
    const substitutionD = u.unify([1, 2], [u.fresh('A'), u.fresh('B')])(u.stream());
    
    assert(_.isEqual(substitutionA, []), `a unification requires at least one logical variable`);
    assert(_.first(substitutionB).lookup(variable) === 2, `a unification will assign a value to a logical variable`);
    assert(_.isEqual(substitutionC, [u.stream()]), `a unification on empty lists returns substitution with an empty stream`);
    assert(_.first(substitutionD).lookup(u.fresh('A')) === 1, `a variable in an adjacent list will be unfied with a value in the first`);
    assert(_.first(substitutionD).lookup(u.fresh('B')) === 2, `a variable in an adjacent list will be unfied with a value in the first`);


  });

});