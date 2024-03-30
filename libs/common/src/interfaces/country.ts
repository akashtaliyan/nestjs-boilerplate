export interface ICountry {
  id?: number;
  uuid?: string;
  name?: string;
  iso3?: string;
  iso2?: string;
  numericCode?: number;
  phoneCode?: number;
  capital?: string;
  currency?: string;
  currencyName?: string;
  currencySymbol?: string;
  region?: string;
  subregion?: string;
  states?: IState[];
  longitude?: string;
  emoji?: string;
  emojiU?: string;
  latitude?: string;
}

export interface IState {
  id?: number;
  uuid?: string;
  name?: string;
  stateCode?: string;
  cities?: ICity[];
  countryCode?: string;
  type?: string;
  latitude?: string;
  longitude?: string;
}

export interface ICity {
  id?: number;
  uuid?: string;
  name?: string;
  countryCode?: string;
  stateCode?: string;
  latitude?: string;
  longitude?: string;
}

export interface ICountryStateCity {
  country: string;
  state: string;
  city: string;
}
