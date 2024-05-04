import { HttpException, Inject, Injectable } from '@nestjs/common';
import { IOptions, default as Sandbox } from '@nyariv/sandboxjs';
import { JsForgeConstants } from './constants';

/**
 * Custom service to execute javascript code in a secure environment and sandboxed environment
 * @example
 * const jsForgeService = new JsForgeService();
 * const result = jsForgeService.forgeSync('1 + 1');
 * console.log(result); // 2
 */
@Injectable()
export class JsForgeService {
  private sandbox: Sandbox;
  constructor(
    @Inject(JsForgeConstants.OPTIONS)
    private options: Partial<IOptions>, // throw an loop detected exception if the execution time exceeds 10000 ticks
  ) {
    const prototypeWhitelist = Sandbox.SAFE_PROTOTYPES;
    const globals = {
      ...Sandbox.SAFE_GLOBALS,
      ...this.options.globals,
    };

    for (const [prototype, methods] of this?.options?.prototypeWhitelist ||
      []) {
      prototypeWhitelist.set(prototype, methods);
      globals[prototype.name] = prototype;
    }

    const sandbox = new Sandbox({
      ...this.options,
      globals,
      prototypeWhitelist,
    });
    this.sandbox = sandbox;
  }

  /**
   * @description Execute javascript code in the sandbox asynchronously and return the result
   * @example execute<number>('1 + 1') // 2
   * @example execute<number>('1 + a',{a:5}) // 6
   * @example execute<number>('return a + b',{a:5, b: 10}) // 15
   * @example execute<boolean>('a === b',{a:5, b: 5}) // true
   */
  async executeAsync<TResponse = any>(
    code: string,
    scope: Record<any, any> = {},
  ): Promise<{ result: TResponse; error: null }> {
    const containsReturn = code.includes('return');
    const executor = this.sandbox.compileAsync(
      `${containsReturn ? '' : 'return '} ${code}`,
    );
    try {
      const result: any = await executor(scope).run();
      return { result, error: null };
    } catch (e) {
      console.log(`Code threw error while forging Async:`, e);
      return { result: null, error: e.message };
    }
  }

  /**
   * @description Execute javascript code in the sandbox synchronously and return the result
   * @example execute<number>('1 + 1') // 2
   * @example execute<number>('1 + a',{a:5}) // 6
   * @example execute<number>('return a + b',{a:5, b: 10}) // 15
   * @example execute<boolean>('a === b',{a:5, b: 5}) // true
   */
  execute<TResponse = any>(
    code: string,
    scope: Record<any, any> = {},
  ): { result: TResponse; error: null } {
    const containsReturn = code.includes('return');
    const executor = this.sandbox.compile(
      `${containsReturn ? '' : 'return '} ${code}`,
    );
    try {
      const result: any = executor(scope).run();
      return { result, error: null };
    } catch (e) {
      console.log(`Code threw error while forging:`, e);
      return { result: null, error: e.message };
    }
  }

  /**
   * Alias for execute
   */
  forge = this.execute;

  /**
   * Alias for executeAsync
   */
  forgeAsync = this.executeAsync;

  /**
   * @description Validate javascript code in the sandbox and return the error if any
   * @example checkErrors('await 1') //  null
   * @example checkErrors('let 1=5') // 'Unexpected token after prop: 1: let 1=5'
   */
  hasError(code: string) {
    try {
      this.sandbox.compileAsync(code, true); // throws an error if the code is invalid
      return null;
    } catch (e) {
      return e.message;
    }
  }
}
