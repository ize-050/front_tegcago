import _ from "lodash";

export interface Country {
  name: string;
  image: string;
}

const imageAssets = "";

const fakers = {
  fakeCountries() {
    const countries: Array<Country> = [
      {
        name: "French Polynesia",
        image: "",
      },
    
    ];

    return _.shuffle(countries);
  },
};

export default fakers;
