import { Transformer } from '@libs/core';
import { ICity } from '../interfaces';

export class CityTransformer extends Transformer {
  async transform(city: ICity): Promise<Record<string, any>> {
    return {
      id: city.uuid,
      name: city.name,
      stateCode: city.stateCode,
      countryCode: city.countryCode,
    };
  }
}
