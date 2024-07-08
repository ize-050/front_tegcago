import _ from "lodash";
import dayjs from "dayjs";
import categories, { type Category } from "./categories";
import users, { type User } from "./users";

export interface Product {
  images: Array<{
    path: string;
    uploadDate: string;
  }>;
  name: string;
  price: number;
  isActive: boolean;
  stock: number;
  category: Category;
  buyers: Array<User>;
  slug: string;
}

// const imageAssets :any = import.meta.glob<{
//   default: string;
// }>("/src/assets/images/products/*.{jpg,jpeg,png,svg}", { eager: true });



const fakers = {
  fakeProducts() {
    const products: Array<Product> = [
      {
        images: [
          {
            path: "1",
            uploadDate: dayjs
              .unix(_.random(1586584776897, 1672333200000) / 1000)
              .format("DD MMMM YYYY"),
          },
    
        ],
        name: "Wireless Noise-Cancelling Headphones",
        price: 149.99,
        isActive: true,
        stock: 50,
        category: categories.fakeCategories()[0],
        buyers: users.fakeUsers(),
        slug: "wireless-noise-cancelling-headphones",
      },
      {
        images: [
          {
            path: "1",
            uploadDate: dayjs
              .unix(_.random(1586584776897, 1672333200000) / 1000)
              .format("DD MMMM YYYY"),
          },

        ],
        name: "Smartphone Charging Dock",
        price: 19.99,
        isActive: false,
        stock: 25,
        category: categories.fakeCategories()[0],
        buyers: users.fakeUsers(),
        slug: "smartphone-charging-dock",
      },
     
      // Add more products here
    ];

    return _.shuffle(products);
  },
};

export default fakers;
