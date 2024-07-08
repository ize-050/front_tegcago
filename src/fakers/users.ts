import _ from "lodash";

export interface User {
  name: string;
  position: string;
  photo: string;
  email: string;
  phone: string;
  department: string;
  location: string;
  joinedDate: string;
  manager: string;
  addressLine1: string;
  addressLine2: string;
  isActive: boolean;
}

const imageAssets = "";
const fakers = {
  fakeUsers() {
    const users: Array<User> = [
      {
        name: "Tom Hanks",
        position: "Sales Manager",
        photo: "",
        email: "tom.hanks@left4code.com",
        phone: "+1 (123) 456-7890",
        department: "Sales Department",
        location: "New York, USA",
        joinedDate: "January 15, 2010",
        manager: "John Smith",
        addressLine1: "123 Main Street",
        addressLine2: "Suite 456",
        isActive: true,
      },
      {
        name: "Meryl Streep",
        position: "Marketing Coordinator",
        photo: "",
        email: "meryl.streep@left4code.com",
        phone: "+1 (234) 567-8901",
        department: "Marketing Department",
        location: "Los Angeles, USA",
        joinedDate: "March 22, 2015",
        manager: "Alice Johnson",
        addressLine1: "456 Elm Avenue",
        addressLine2: "Floor 3B",
        isActive: false,
      },
      {
        name: "Leonardo DiCaprio",
        position: "Support Specialist",
        photo: "",
        email: "leonardo.dicaprio@left4code.com",
        phone: "+1 (345) 678-9012",
        department: "Support Team",
        location: "Chicago, USA",
        joinedDate: "May 5, 2018",
        manager: "Emily Davis",
        addressLine1: "789 Oak Street",
        addressLine2: "Apt 102",
        isActive: true,
      },
      {
        name: "Angelina Jolie",
        position: "Account Executive",
        photo: "",
        email: "angelina.jolie@left4code.com",
        phone: "+1 (456) 789-0123",
        department: "Account Management",
        location: "San Francisco, USA",
        joinedDate: "July 10, 2012",
        manager: "Michael Brown",
        addressLine1: "567 Pine Road",
        addressLine2: "Suite 200",
        isActive: false,
      },
      {
        name: "Brad Pitt",
        position: "Data Analyst",
        photo: "",
        email: "brad.pitt@left4code.com",
        phone: "+1 (567) 890-1234",
        department: "Data Analytics",
        location: "Seattle, USA",
        joinedDate: "September 3, 2016",
        manager: "Sarah Wilson",
        addressLine1: "890 Cedar Avenue",
        addressLine2: "Unit 501",
        isActive: true,
      },
      
    ];

    return _.shuffle(users);
  },
};

export default fakers;
