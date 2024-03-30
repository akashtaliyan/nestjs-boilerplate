import { Transformer } from '@libs/core';
import { ICountry } from '../interfaces';

export class CountryTransformer extends Transformer {
  async transform(country: ICountry): Promise<Record<string, any>> {
    return {
      id: country.uuid,
      name: country.name,
      iso3: country.iso3,
      iso2: country.iso2,
      numericCode: country.numericCode,
      phoneCode: country.phoneCode,
      capital: country.capital,
      currency: country.currency,
      currencyName: country.currencyName,
      currencySymbol: country.currencySymbol,
      region: country.region,
      subregion: country.subregion,
      flag: country.emoji,
    };
  }
}
