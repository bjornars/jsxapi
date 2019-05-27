import XAPI from '.';
import normalize from './normalizePath';
import { Listener, Path } from './types';

/**
 * Mixin for XAPI sections that can trigger feedback.
 *
 * @interface
 */
export interface Listenable {
  /**
   * Register a new listener on the given path.
   *
   * @param {string} path - Path to XAPI entry.
   * @param {function(data: Object): null} listener - Callback handler called on changes.
   * @return {function()} - Handler to deregister the feedback registration.
   */
  on(path: Path, listener: Listener): any;
  /**
   * Register a new listener on the given path, de-register
   * after the first change happened.
   *
   * @param {string} path - Path to XAPI entry.
   * @param {function(data: Object): null} listener - Callback handler called on changes.
   * @return {Object} - Handler to deregister the feedback registration.
   */
  once(path: Path, listener: Listener): any;
  /**
   * De-register the given listener on the given path.
   *
   * @deprecated use deactivation handler from `.on()` and `.once()` instead.
   */
  off(): void;
}

/**
 * Mixin for XAPI sections that can hold a value that may be fetched.
 *
 * @interface
 */
export interface Gettable {
  /**
   * Gets the value of the given path.
   *
   * @example
   * xapi.status
   *   .get('Audio Volume')
   *   .then((volume) => { console.log(volume); });
   *
   * @example
   * xapi.config
   *   .get('Audio DefaultVolume')
   *   .then((volume) => { console.log(volume); });
   *
   * @param {string} path - Path to configuration node.
   * @return {Promise} - Resolved to the configuration value when ready.
   */
  get(path: Path): any;
}

/**
 * Mixin for XAPI sections that can hold a value that may be fetched.
 *
 * @interface
 */
export interface Settable {
  /**
   * Sets the path to the given value.
   *
   * @example
   * xapi
   *   .config.set('SystemUnit Name', 'My System');
   *
   * @param {string} path - Path to status node.
   * @param {number|string} value - Configuration value.
   * @return {Promise} - Resolved to the status value when ready.
   */
  set(path: Path, value: number | string): any;
}

/**
 * Mixin for XAPI sections that can trigger feedback.
 *
 */
export class ListenableImpl implements Listenable {
  constructor(
    private readonly xapi: XAPI,
    private readonly normalizePath: typeof normalize,
  ) {}

  /**
   * Register a new listener on the given path.
   *
   * @param {string} path - Path to XAPI entry.
   * @param {function(data: Object): null} listener - Callback handler called on changes.
   * @return {function()} - Handler to deregister the feedback registration.
   */
  public on = (path: Path, listener: Listener) => {
    return this.xapi.feedback.on(this.normalizePath(path) as any, listener);
  };

  /**
   * Register a new listener on the given path, de-register
   * after the first change happened.
   *
   * @param {string} path - Path to XAPI entry.
   * @param {function(data: Object): null} listener - Callback handler called on changes.
   * @return {Object} - Handler to deregister the feedback registration.
   */
  public once = (path: Path, listener: Listener) => {
    return this.xapi.feedback.once(this.normalizePath(path) as any, listener);
  };

  /**
   * De-register the given listener on the given path.
   *
   * @deprecated use deactivation handler from `.on()` and `.once()` instead.
   */
  public off = () => {
    this.xapi.feedback.off();
  };
}

/**
 * Mixin for XAPI sections that can hold a value that may be fetched.
 *
 */
export class GettableImpl implements Gettable {
  constructor(
    private readonly xapi: XAPI,
    private readonly normalizePath: typeof normalize,
  ) {}

  /**
   * Gets the value of the given path.
   *
   * @example
   * xapi.status
   *   .get('Audio Volume')
   *   .then((volume) => { console.log(volume); });
   *
   * @example
   * xapi.config
   *   .get('Audio DefaultVolume')
   *   .then((volume) => { console.log(volume); });
   *
   * @param {string} path - Path to configuration node.
   * @return {Promise} - Resolved to the configuration value when ready.
   */
  public get = (path: Path) => {
    return this.xapi.execute('xGet', {
      Path: this.normalizePath(path),
    });
  };
}

/**
 * Mixin for XAPI sections that can hold a value that may be fetched.
 *
 */
export class SettableImpl implements Settable {
  constructor(
    protected readonly xapi: XAPI,
    private readonly normalizePath: typeof normalize,
  ) {}
  /**
   * Sets the path to the given value.
   *
   * @example
   * xapi
   *   .config.set('SystemUnit Name', 'My System');
   *
   * @param {string} path - Path to status node.
   * @param {number|string} value - Configuration value.
   * @return {Promise} - Resolved to the status value when ready.
   */
  public set = (path: Path, value: number | string) => {
    return this.xapi.execute('xSet', {
      Path: this.normalizePath(path),
      Value: value,
    });
  };
}
