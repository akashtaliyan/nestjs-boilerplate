import { Transformer } from '@libs/core';
import { IState } from '../interfaces';

export class StateTransformer extends Transformer {
  async transform(state: IState): Promise<Record<string, any>> {
    return {
      id: state.uuid,
      name: state.name,
      stateCode: state.stateCode,
      countryCode: state.countryCode,
      type: state.type,
    };
  }
}
