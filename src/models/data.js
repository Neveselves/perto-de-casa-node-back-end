const data = {
  halls: [
    {
      hall: 'Bebidas',
      promotion: false,
      imageHall: 'assets/icon/favicon.png',
      products: [
        {
          desc: 'Destilados',
          price: 3.55,
          image: 'assets/images/cerveja-corona.png',
          promotion: false,
          details: {
            quantity: 10,
            sales: 80,
            typePromotion: [
              {
                get: 2,
                pay: 1,
                price: 10
              }
            ]
          }
        },
        {
          desc: 'Sucos',
          price: 3.55,
          image: 'assets/images/cerveja-corona.png',
          promotion: false,
          details: {
            quantity: 10,
            sales: 80,
            typePromotion: [
              {
                get: 2,
                pay: 1,
                price: 10
              }
            ]
          }
        },
        {
          desc: 'Cerveja skol 350ml',
          price: 3.55,
          image: 'assets/images/cerveja-corona.png',
          promotion: false,
          details: {
            quantity: 10,
            sales: 80,
            typePromotion: [
              {
                get: 2,
                pay: 1,
                price: 10
              }
            ]
          }
        }
      ]
    },
    {
      hall: 'Carnes e Congelados',
      promotion: false,
      imageHall: 'assets/icon/favicon.png',
      products: [
        {
          desc: 'Picanha',
          price: 89.90,
          image: 'assets/images/picanha.png',
          promotion: false,
          details: {
            quantity: 20,
            sales: 45,
            typePromotion: [
              {
                get: 1,
                pay: 1,
                price: 79.90
              }
            ]
          }
        },
        {
          desc: 'Frango Congelado',
          price: 15.90,
          image: 'assets/images/frango.png',
          promotion: false,
          details: {
            quantity: 50,
            sales: 120,
            typePromotion: [
              {
                get: 3,
                pay: 2,
                price: 42.90
              }
            ]
          }
        }
      ]
    }
  ]
};

module.exports = data;