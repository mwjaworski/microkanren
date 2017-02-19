import 'mocha';
import { assert } from 'chai';
import { uKanren as u } from '../lib/index';

describe('MicroKanren Goals', () => {
    
  it(`a disjunction will OR two unifications`, () => {
    
    const stream = u.stream();
    const v1 = u.fresh();
    const v2 = u.fresh();
    
    const goal = u.disj(
      u.equals(v1, 1), 
      u.equals(2, v2)
    );

    const substitution = goal(stream);
    
    assert(stream.walk(v1) === 1, `v1 unified with 1`);
    assert(stream.walk(v2) === 2, `v2 unified with 2`);
    
  });

  it(`a conjunction will AND two unifications`, () => {
    
    const stream = u.stream();
    const v1 = u.fresh();
    const v2 = u.fresh();
    
    const goal = u.conj(
      u.equals(2, v2),
      u.equals(v1, v2)
    );

    const substitution = goal(stream);
    
    assert(stream.walk(v1) === 2, `v1 unified with 2`);
    assert(stream.walk(v2) === 2, `v2 unified with 2`);
    
  });

  it(`a combination of disjunction and conjunction`, () => {

    const stream = u.stream();
    const w = u.fresh();
    const x = u.fresh();
    const y = u.fresh();
    const z = u.fresh();
    
    const g1 = u.disj(
      u.equals(w, 1),
      u.equals(x, 2)
    );

    const g2 = u.disj(
      u.equals(y, 3),
      u.equals(z, 4)
    );

    const goal = u.conj(
      g1,
      g2
    );

    const resolution = goal(stream);

    assert(stream.walk(w) === 1, 'w resolved to 1');
    assert(stream.walk(x) === 2, 'x resolved to 2');
    assert(stream.walk(y) === 3, 'y resolved to 3');
    assert(stream.walk(z) === 4, 'z resolved to 4');

  });

  // it(`...`, () => {
    
  //   const stream = u.stream();
    
  //   // const goal = u.disj(
      
  //   // );

  //   const substitution = goal(stream);
    
  //   assert(stream.lookup(v1) === 1, `v1 unified with 1`);
  //   assert(stream.lookup(v2) === 2, `v2 unified with 2`);
    
  // });

  // it("disj/conj", function() {
  //     var f1 = function(x) { return k.succeed(x + "foo"); },
  //         f2 = function(x) { return k.succeed(x + "bar"); },
  //         f3 = function(x) { return k.succeed(x + "baz"); };
  //     assert.deepEqual(k.disj(f1, f2, f3)("a "), ["a foo", "a bar", "a baz"]);
  //     assert.deepEqual(k.conj(f1, f2, f3)("a "), ["a foobarbaz"]);
  //   });


});