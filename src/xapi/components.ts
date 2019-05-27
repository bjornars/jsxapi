import XAPI from '.';
import {
  Gettable,
  GettableImpl,
  Listenable,
  ListenableImpl,
  Settable,
  SettableImpl,
} from './mixins';
import normalizePath from './normalizePath';
import { Path } from './types';

/**
 * Common base class for XAPI section types (commands, configs, events, statuses).
 *
 * @interface
 */
class Component {
  /**
   * @param {XAPI} xapi - XAPI instance.
   * @param {prefix} string - Prefix to add to all paths for the component.
   */
  constructor(
    protected readonly xapi: XAPI,
    protected readonly prefix: string,
  ) {}
  /**
   * @type {XAPI}
   */

  /**
   * Normalizes a path including the component prefix.
   *
   * @param path - Normalize an XAPI path.
   * @return - Normalized path.
   */
  protected normalizePath = (path: Path) => {
    const normalized = normalizePath(path);
    const { prefix } = this;
    return !prefix
      ? normalized
      : ([prefix] as Array<string | number>).concat(normalized);
  }
}

/**
 * Interface to XAPI configurations.
 *
 * @extends {Component}
 * @implements {Listenable}
 * @implements {Gettable}
 * @implements {Settable}
 */
export class Config extends Component
  implements Listenable, Gettable, Settable {

  public get: Gettable['get'];
  public set: Settable['set'];
  public on: Listenable['on'];
  public once: Listenable['once'];
  public off: Listenable['off'];
  private listenable: Listenable;
  private gettable: Gettable;
  private settable: Settable;

  constructor(xapi: XAPI) {
    super(xapi, 'Configuration');
    this.listenable = new ListenableImpl(xapi, this.normalizePath);
    this.gettable = new GettableImpl(xapi, this.normalizePath);
    this.settable = new SettableImpl(xapi, this.normalizePath);
    this.get = this.gettable.get;
    this.set = this.settable.set;
    this.on = this.listenable.on;
    this.once = this.listenable.once;
    this.off = this.listenable.off;
  }
}

/**
 * Interface to XAPI events.
 *
 * @extends {Component}
 * @implements {Listenable}
 */
export class Event extends Component implements Listenable {

  public on: Listenable['on'];
  public once: Listenable['once'];
  public off: Listenable['off'];
  private listenable: Listenable;

  constructor(xapi: XAPI) {
    super(xapi, 'Event');
    this.listenable = new ListenableImpl(xapi, this.normalizePath);
    this.on = this.listenable.on;
    this.once = this.listenable.once;
    this.off = this.listenable.off;
  }
}

/**
 * Interface to XAPI statuses.
 *
 * @extends {Component}
 * @implements {Listenable}
 * @implements {Gettable}
 */
export class Status extends Component implements Listenable, Gettable {

  public get: Gettable['get'];
  public on: Listenable['on'];
  public once: Listenable['once'];
  public off: Listenable['off'];
  private listenable: Listenable;
  private gettable: Gettable;

  constructor(xapi: XAPI) {
    super(xapi, 'Status');
    this.listenable = new ListenableImpl(xapi, this.normalizePath);
    this.gettable = new GettableImpl(xapi, this.normalizePath);

    this.get = this.gettable.get;
    this.on = this.listenable.on;
    this.once = this.listenable.once;
    this.off = this.listenable.off;
  }
}
