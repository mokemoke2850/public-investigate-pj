import { useState } from 'react';
import { testData } from '../data/testData';
import SelectBox from './SelectBox';

const countries = Array.from(new Set(testData.map((item) => item.country)));
const cities = Array.from(new Set(testData.map((item) => item.city)));
const attractions = Array.from(
  new Set(testData.map((item) => item.attraction))
);

function ProgressiveSelectBoxList() {
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [attraction, setAttraction] = useState('');

  const [countryOptions, setCountryOptions] = useState(countries);
  const [cityOptions, setCityOptions] = useState(cities);
  const [attractionOptions, setAttractionOptions] = useState(attractions);

  const updateCountry = (country: string) => {
    setCountry(country);

    // 国が入力されていないときはすべての都市と観光地を選択肢にする
    if (country === '') {
      setCityOptions(cities);
      setAttractionOptions(attractions);
      return;
    }

    const newCountries = testData;

    // 都市の選択肢を作成
    let newCities = cities;
    if (attraction !== '') {
      newCities = Array.from(
        new Set(
          newCountries
            .filter((item) => item.attraction === attraction)
            .map((item) => item.city)
        )
      );
    }

    let newAttractions = attractions;
    // 観光地の選択肢を作成
    if (city !== '') {
      newAttractions = Array.from(
        new Set(
          newCountries
            .filter((item) => item.city === city)
            .map((item) => item.attraction)
        )
      );
    }

    setCityOptions(newCities);
    setAttractionOptions(newAttractions);
  };

  const updateCity = (city: string) => {
    setCity(city);

    // 都市が入力されていないときはすべての都市を選択肢にする
    if (city === '') {
      setCityOptions(cities);
      return;
    }

    let newCities = testData;

    // 国で絞り込み
    if (country !== '') {
      newCities = newCities.filter((item) => item.country === country);
    }

    // 観光地で絞り込み
    if (attraction !== '') {
      newCities = newCities.filter((item) => item.attraction === attraction);
    }

    // 重複排除
    const newCityOptions = Array.from(
      new Set(newCities.map((item) => item.city))
    );

    setCityOptions(newCityOptions);
    setAttractionOptions(newAttractionOptions);
  };

  const upadateAttraction = (attraction: string) => {
    setAttraction(attraction);

    // 観光地が入力されていないときはすべての観光地を選択肢にする
    if (attraction === '') {
      setAttractionOptions(attractions);
      return;
    }

    let newAttractions = testData;

    // 国で絞り込み
    if (country !== '') {
      newAttractions = newAttractions.filter(
        (item) => item.country === country
      );
    }

    // 都市で絞り込み
    if (city !== '') {
      newAttractions = newAttractions.filter((item) => item.city === city);
    }

    // 重複排除
    const newAttractionOptions = Array.from(
      new Set(newAttractions.map((item) => item.attraction))
    );

    setAttractionOptions(newAttractionOptions);
  };
  return (
    <div>
      <SelectBox
        selectProps={{
          value: country,
          onChange: (e) => {
            updateCountry(e.target.value);
          },
        }}
        options={countryOptions.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      />
      <SelectBox
        selectProps={{
          value: city,
          onChange: (e) => {
            updateCity(e.target.value);
          },
        }}
        options={cityOptions.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      />
      <SelectBox
        selectProps={{
          value: attraction,
          onChange: (e) => {
            upadateAttraction(e.target.value);
          },
        }}
        options={attractionOptions.map((attraction) => (
          <option key={attraction} value={attraction}>
            {attraction}
          </option>
        ))}
      />
    </div>
  );
}
export default ProgressiveSelectBoxList;
