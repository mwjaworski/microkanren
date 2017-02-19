import { uniqueId, size, head, tail } from 'lodash';

type Variable = any | LogicVariable;
type Substitution = Array<Variable>;
type Goal = (stream?: Stream) => Substitution;

const UNIFICATION_FAILED: undefined = undefined;
const RESOLUTION_NOT_FOUND: undefined = undefined;

export interface ILogicVariable {
  id: string;
}

class LogicVariable implements ILogicVariable {

  constructor(private _id: string = uniqueId()) { }

  get id(): string {
    return this._id;
  }
}

interface IState {
  [k: string]: Variable;
}

class Stream {

  private _set: IState;

  constructor() {
    this._set = {};
  }

  walk(value: Variable): any {

    if (!(value instanceof LogicVariable)) {
      return value;
    }

    const resolution: Variable = this._set[value.id];

    if (resolution === RESOLUTION_NOT_FOUND) {
      return value;
    }
    else if (resolution instanceof LogicVariable) {
      return this.walk(resolution);
    }
    else {
      return resolution;
    }
  }

  extend(logicalVariable: LogicVariable, value: any): this {
    this._set[logicalVariable.id] = value;
    return this;
  }
}

/**
 * 
 */
class MicroKanren {

  fresh(id?: string): LogicVariable {
    return new LogicVariable(id);
  }

  stream() {
    return new Stream();
  }

  success(stream: Stream): Substitution {
    return [stream];
  }

  failure(stream?: Stream): Substitution {
    return [];
  }

  walk(value: Variable, stream: Stream): any {
    return stream.walk(value);
  }

  // six operators: define-relation

  /**
   * 
   * 
   * @param {(variable: Variable) => Goal} lambda 
   * @returns {Goal} 
   * 
   * @memberOf MicroKanren
   */
  callFresh(lambda: (variable: Variable) => Goal): Goal {
    return (stream: Stream) => {
      return lambda(this.fresh())(stream);
    };
  }

  /**
   * 
   * 
   * @param {...Goal[]} goals 
   * @returns {Goal} 
   * 
   * @memberOf MicroKanren
   */
  disj(...goals: Goal[]): Goal {
    return (goals.length <= 0)
      ? this.failure
      : this._disjunction(head(goals), this.disj(...tail(goals)));
  }

  private _disjunction(goal1: Goal, goal2: Goal): Goal {
    return (stream: Stream): Substitution => {
      return goal1(stream).concat(goal2(stream));
    };
  }

  /**
   * 
   * 
   * @param {...Goal[]} goals 
   * @returns {Goal} 
   * 
   * @memberOf MicroKanren
   */
  conj(...goals: Goal[]): Goal {
    return (goals.length <= 0)
      ? this.success
      : this._conjunction(head(goals), this.conj(...tail(goals)));
  }

  private _conjunction(goal1: Goal, goal2: Goal): Goal {
    return (stream: Stream): Substitution => {
      return goal1(stream).reduce((substitution: Substitution, value: Variable) => {
        return substitution.concat(goal2(value));
      }, []);
    };
  }

  /**
   * 
   * 
   * @param {Variable} _v1 
   * @param {Variable} _v2 
   * @returns {Goal} 
   * 
   * @memberOf MicroKanren
   */
  equals(_v1: Variable, _v2: Variable): Goal {
    return (stream: Stream): Substitution => {
      const newStream = this.unify(stream, _v1, _v2);

      return (newStream === UNIFICATION_FAILED)
        ? this.failure()
        : this.success(newStream);
    };
  }

  /**
   * 
   * @param {Stream} stream 
   * @param {Variable} _v1 
   * @param {Variable} _v2 
   * @returns {Stream} 
   * 
   * @memberOf MicroKanren
   */
  unify(stream: Stream, _v1: Variable, _v2: Variable): Stream {

    const v1: Variable | Variable[] = stream.walk(_v1);
    const v2: Variable | Variable[] = stream.walk(_v2);

    if (v1 instanceof Array && v2 instanceof Array && v1.length === v2.length) {

      if (v1.length === 0) {
        return stream;
      }

      const [v1Head, ...v1Tail] = v1;
      const [v2Head, ...v2Tail] = v2;
      const newStream = this.unify(stream, v1Head, v2Head);

      if (newStream === UNIFICATION_FAILED) {
        return UNIFICATION_FAILED;
      }

      return this.unify(stream, v1Tail, v2Tail);
    }
    else if (v1 instanceof LogicVariable) {
      return stream.extend(v1, v2);
    }
    else if (v2 instanceof LogicVariable) {
      return stream.extend(v2, v1);
    }
    else if (v1 === v2) {
      return stream;
    }
    else {
      return UNIFICATION_FAILED;
    }
  }

  /**
   * 
   * @param {Goal} goal 
   * @returns {Substitution} 
   * 
   * @memberOf MicroKanren
   */
  run(goal: Goal): Substitution {
    return goal(this.stream());
  }

}

export const microKanren = new MicroKanren();
export const uKanren = microKanren;


