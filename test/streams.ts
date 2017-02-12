import 'mocha';
import { assert } from 'chai';
import { uKanren as u } from '../lib/index';

describe('MicroKanren Stream', () => {
    
  it(`a fresh variable unified in an empty stream against a single value, associated with that value`, () => {
    
    const stream = u.stream();
    const variable = u.fresh();
    const value = 2;

    const goal = u.unify(variable, value);
    const substitution = goal(stream);
    
    assert(substitution.length === 1, `Substitution holds one substitution`);
    assert(stream.lookup(variable) === value, `Stream unified variable with 2`);
    
  });

  it(`a stream unifies values across variable associations`, () => {
    
    const stream = u.stream();
    const v1 = u.fresh();
    const v2 = u.fresh();
    const value = 2;

    stream.extend(v1, v2);
    stream.extend(v2, value);

    assert(stream.lookup(v2) === value, `a variable keeps a value association`);
    assert(stream.lookup(v1) === value, `a variable traces back to a value`);

  });

  it(`a unification against a logical variable associates to an extended value`, () => {
    
    const stream = u.stream();
    const v1 = u.fresh();
    const v2 = u.fresh();
    const v3 = u.fresh();
    const v4 = u.fresh();
    const value = 2;

    stream.extend(v1, value);
    stream.extend(v2, v1);
    stream.extend(v3, v2);

    const goal = u.unify(v4, v3);

    assert(stream.lookup(v1) === 2, `v1 associated to 2`);
    assert(stream.lookup(v2) === 2, `v2 associated to 2`);
    assert(stream.lookup(v3) === 2, `v3 associated to 2`);
    
    assert(stream.lookup(v4) === v4, `v4 has not be unfied yet, so it is itself`);
    goal(stream);  
    assert(stream.lookup(v4) === 2, `v4 associated to 2`);
    
  });


});