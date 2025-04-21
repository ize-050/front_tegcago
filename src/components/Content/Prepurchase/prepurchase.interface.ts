export interface Route {
  id: string;
  name: string;
  key:string;
}

export interface Term {
  id: string;
  name: string;
}

export interface TransportData {
  id: string;
  name: string;
}

export const RouteData:Route[] = [
  {
    id: "1",
    name: "import",
    key:"IMPORT"
  },
  {
    id: "2",
    name: "export",
    key:"EXPORT"
  },
  {
    id: "3",
    name: "etc",
    key:"ETC"
  },
];


export const TransportData :TransportData[] =  [
    {
        id:"1",
        name:"EK",
    },
    {
        id:"2",
        name:"SEA",
    },
    {
        id:"3",
        name:"AIR",
    },
    {
        id:"4",
        name:"RE",
    }
]


export const TermData:Term[] = [
    {
        id:"1",
        name:"ALL IN",
    },
    {
        id:"2",
        name:"เคลียร์ฝั่งไทย",
    },
    {
        id:"3",
        name:"เคลียร์ฝั่งจีน",
    },
    {
        id:"4",
        name:"GREEN",
    },
    {
       id:"5",
       name:"FOB"
    },
    {
      id:"6",
      name:"EXW"
    },
    {
      id:"CIF",
      name:"CIF"
    },
    {
      id:"CUS",
      name:"CUSTOMER CLEAR"
    }

]