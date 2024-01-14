import { useState } from 'react';
import { testData } from '../data/testData';
import SelectBox from './SelectBox';

function DeclarativeSelectBoxList() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [attraction, setAttraction] = useState('');

  // 国の選択肢を定義
  const countryOptions = Array.from(
    new Set(
      testData
        .filter((item) => {
          if (city === '' && attraction === '') return true;
          if (city === '') return item.attraction === attraction;
          if (attraction === '') return item.city === city;
          return item.city === city && item.attraction === attraction;
        })
        .map((item) => item.country)
    )
  ).map((country) => (
    <option key={`${country}`} value={country}>
      {country}
    </option>
  ));

  // 都市の選択肢を定義
  const cityOptions = Array.from(
    new Set(
      testData
        .filter((item) => {
          if (country === '' && attraction === '') return true;
          if (country === '') return item.attraction === attraction;
          if (attraction === '') return item.country === country;
          return item.country === country && item.attraction === attraction;
        })
        .map((item) => item.city)
    )
  ).map((city) => (
    <option key={city} value={city}>
      {city}
    </option>
  ));

  // 観光地の選択肢を定義
  const attractionOptions = Array.from(
    testData
      .filter((item) => {
        if (country === '' && city === '') return true;
        if (country === '') return item.city === city;
        if (city === '') return item.country === country;
        return item.country === country && item.city === city;
      })
      .map((item) => item.attraction)
  ).map((attraction) => (
    <option key={attraction} value={attraction}>
      {attraction}
    </option>
  ));

  return (
    <div>
      <SelectBox
        selectProps={{
          value: country,
          onChange: (e) => {
            setCountry(e.target.value);
          },
        }}
        options={countryOptions}
      />
      <SelectBox
        selectProps={{
          value: city,
          onChange: (e) => {
            setCity(e.target.value);
          },
        }}
        options={cityOptions}
      />
      <SelectBox
        selectProps={{
          value: attraction,
          onChange: (e) => {
            setAttraction(e.target.value);
          },
        }}
        options={attractionOptions}
      />
    </div>
  );
}
export default DeclarativeSelectBoxList;
