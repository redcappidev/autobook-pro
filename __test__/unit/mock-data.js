import faker from 'faker';

/**
 * The mock users are hard-coded so should be updated according to your database update/setup
 */

export const adminMockUser = {
  id: '19',
  auth0Id:
    'localauth|6636adef015120f2cc0ca32f6de2aa20bae64944321fdfe5ec24cb6303002416|645d33092bf3e8fa81916f8916fddb59e73533de31602f267d1fdbfe97d7fde3c14be33d8619a516bc69c34b6e8a652e73e1d12d75e189d7f585523892cc41cb0ad44b2a2274ed9f7b06ca6c34e35b3af83b4d1fee8b6dcc560629c93247d94f934b9b51b742c8d36f350c267ee3d49ad6e05dda3a19789e3bf9aa02c8347b155ae529c0c830aa2e81a18c4a1d4cd0af333f931cddba6c7a4a1502357979d1c29b93356978d9bf04d8e3d6162f3570a529d3cdad726b3b5f459feb6216bf6f3cfb725ec1c6414124ce6d84e94684b954aca570595951dca34da197bb693e3ba448c690296c5056b0de729eec3af7454cf24f113f5e75dc60f62badced51c0a843ec08f56bc4e44b00cd2f6c898fd0513393a27824559da1fdcc38341332eb4eab4adc9e14c1762e8bcd3b51e80f03a6e48c8591a85e8e55ad4abcef5f7866a833dbd97e232132a5bfdf9c9c88dbf91819eb9097cdbd41d8f66a64c88ea97d299ee2f71067d0557fb3e63b82421b13fd7dbee704f5e770a8363dd29509260f005ae3415ad7075151cc61428415908b9a446e2bfb37fb0ea3c366ef7004dd34a883e71e84933f83cfc3bbbd394d21e9e0f167f4c827781e36fcd87ad62ae1a653125a506a8f790e64da61fb1a82ec760b6b330a088a49d63b5d4ff1e37379eb11ec95c6257aff5904ba34ede6d9e6323f587395d85995ae9a3afe211f3294c1d61',
  email: '1598066516331.mock@example.com',
  firstName: 'Jest',
  lastName: 'User',
  roleId: 1,
  role: {
    id: 1,
    name: 'Admin',
    permissions:
      'pricing_exception.view,pricing_exception.add_edit,pricing_exception.delete,mileage_pricing.view,mileage_pricing.add_edit,mileage_pricing.delete,vehicle_size.view,vehicle_size.add_edit,vehicle_size.delete,vehicle_sizechart.view,vehicle_sizechart.add_edit,vehicle_sizechart.delete,quote.view,quote.add_edit,quote.delete,status.view,status.add_edit,status.delete,email_template.view,email_template.add_edit,email_template.delete,sms_template.view,sms_template.add_edit,sms_template.delete,quote_note.view,quote_note.add_edit,quote_note.delete,order.view,order.add_edit,order.delete,order.dispatch,carrier.view,carrier.add_edit,carrier.delete,carrier_driver.view,carrier_driver.add_edit,carrier_driver.delete,carrier_note.view,carrier_note.add_edit,carrier_note.delete,carrier_dispatch.view,carrier_dispatch.add_edit,carrier_dispatch.delete,followup_type.view,followup_type.add_edit,followup_type.delete,followup.view,followup.add_edit,followup.delete,invite.view,invite.add_edit,invite.delete,user.view,user.add_edit,user.delete,report.add_edit,report.view,report.delete'
  }
};

export const manageMockUser = {
  id: '20',
  auth0Id:
    'localauth|65098f081914fe90c536761bbdca4a45dbc382781c5c8a7636292d43e1732304|501d1cfddc8d6d1ab64159bfb8216108ff587fbade88e38674d424bde13d5af5edbad69fecfdb54dff37fe11f8edbf70b2df337df6693ba19ff1b1366f8f977db34c0eedc1cef33418abf888c07a6a03bdc0c27c98496fa0e33936a50cf5cdfb72cffc9b9fdd6e6a9d38be295fc4918cf39c45320ea0be3e99de39ad6d5372e469d8b8ce1d4ade25478da623441f483d87011c25b139821cc815c690063fceeb7b48d14cf368976f16588fc8faa1f9931a5f400f277bede6abcaf25461f94471568cdb39034fbe836ec949daa1968179cd86c1bfa354265987d3e614f0ac899dfd587d29f70023ffc56a6f75da0cecdfa6365d6f53643d97b58b367adbd51b39187e27b74174b9e8f30b6b70b909703d16f1a4f9ad6677b70cabe3b27eefd764b93fc50fbc901c4b7f1d570a0a58b8d0337d6da7b9a0ad9220f8558c7973e3d1c31fbea241fff916757e2cc92b945fe423b33928eaa117e901b60f39ce99edf9fb49115d1f83b712910679a4fee8f972c468db9d2c3b0f1e7fea169839efd890a960b9c0b9e7bd3d5df54f71925473277c57439f1762df291bc5b655155939b531d1bbd064917a37416ed0051f56c0ca4cf315a889e75cd82aefed560764d7c69c74997c482b03eac83f9cf4cdde67f558292cd5eef707bb3578406e438c6b21c9e9259a4104a8f9ca33adf127990cbc728a9ec8a7609429e80ce0f5d6a6244c',
  email: '1598067538644.mock@example.com',
  firstName: 'Jest',
  lastName: 'User',
  roleId: 2,
  role: {
    id: 2,
    name: 'Manager',
    permissions:
      'pricing_exception.view,pricing_exception.add_edit,pricing_exception.delete,mileage_pricing.view,mileage_pricing.add_edit,mileage_pricing.delete,vehicle_size.view,vehicle_size.add_edit,vehicle_size.delete,vehicle_sizechart.view,vehicle_sizechart.add_edit,vehicle_sizechart.delete,quote.view,quote.add_edit,quote.delete,status.view,status.add_edit,status.delete,email_template.view,email_template.add_edit,email_template.delete,sms_template.view,sms_template.add_edit,sms_template.delete,quote_note.view,quote_note.add_edit,quote_note.delete,order.view,order.add_edit,order.delete,order.dispatch,carrier.view,carrier.add_edit,carrier.delete,carrier_driver.view,carrier_driver.add_edit,carrier_driver.delete,carrier_note.view,carrier_note.add_edit,carrier_note.delete,carrier_dispatch.view,carrier_dispatch.add_edit,carrier_dispatch.delete,followup_type.view,followup_type.add_edit,followup_type.delete,followup.view,followup.add_edit,followup.delete'
  }
};

export const manageMockUser1 = {
  id: '28',
  auth0Id:
    'localauth|03b665c7cca944d14fd28bbb561910f4a9095f3ed29996c2f8b728ae560ae271|8784746462f7a690886bf8db1d051e453f6e76d0cc2bf9c97285873e89207c362eafd6908542f5bea1c6d309779bc073f6f927a6eb0f82bda3bce035709b65933c3a349e4f0cc40f5fd704ce7e4091b6e2e5bb2cb2e6138cb07a924a912d800e4b473afd5fbd06a407272a8250fc1fc4b49ed8c248f7e086788b908bb6e8144ca01fdbaf6ce61f12f35d0507d381f46b1444214b1a88346bf56cd469ed0b364ba258f00240f2da1282adef3f1ee5458da0de7728c80648f4b413b25d856b2d9f864e859b054cbb81094675c88f76be64071be6b5a21122127352517e5eb9a1f92b3b14dbd9cb52208f75a6a3825b41bf2dab792ed080b08402ced8741743ec438d3a86fbb95d8af0b1e4bda30fdfe169b20e17736a07a8538a827d6f3a2d959a8e0106af18df835165ef0680185aaeaa66ab1aff36a1591f15395457ff10e27980dbae682f0fa00fa95a946aac1f250a338d873f1b280ea622859e6be419e485b2685aa2efc32ba1bbd89dba38359f8480c80f8897e1a5ba1de40fd5bbb0b4cd0b8f578ac1dd3b1e59562b1e72e0bbae670413d9842e8529691b113500a4c71690e283d8dd990898eacc5a175eff229d8ee242efaae2caf5d59b8b93732871957be476ac404af235c97537bbb2a923981546bbdfdb8140198c9b162b5d529e07f94b8d4cc9e8408672fa594624e55e1b7aed36a409fa69238f6e85abbd2fa476',
  email: '1598691215148.mock@example.com',
  firstName: 'Jest',
  lastName: 'User',
  roleId: 2,
  role: {
    id: 2,
    name: 'Manager',
    permissions:
      'pricing_exception.view,pricing_exception.add_edit,pricing_exception.delete,mileage_pricing.view,mileage_pricing.add_edit,mileage_pricing.delete,vehicle_size.view,vehicle_size.add_edit,vehicle_size.delete,vehicle_sizechart.view,vehicle_sizechart.add_edit,vehicle_sizechart.delete,quote.view,quote.add_edit,quote.delete,status.view,status.add_edit,status.delete,email_template.view,email_template.add_edit,email_template.delete,sms_template.view,sms_template.add_edit,sms_template.delete,quote_note.view,quote_note.add_edit,quote_note.delete,order.view,order.add_edit,order.delete,order.dispatch,carrier.view,carrier.add_edit,carrier.delete,carrier_driver.view,carrier_driver.add_edit,carrier_driver.delete,carrier_note.view,carrier_note.add_edit,carrier_note.delete'
  }
};

export const salesMockUser = {
  id: '21',
  auth0Id:
    'localauth|4e586bf6ee76ffa1d984b7053678145e81b8012291f7c6d775ef59e9e51445a0|703f60737ef37f3bf143842f76b39ed950465ad4e8b6070fb215a0113c359026feed2987075886d50a3100921514f9a4864707a0c48f8e153063ea78d07d2778fef7e9472a28ce31aaaa03df5425296936be8eb5917e1f1f56e35068b170e8c703229769f3504f5b46e15d81055bffeb1d60f90f0aeb64384c1902c816a53cfdb6bcba76356e8d6edd74f8044608c1c0b564bc0b67d62df9803db6fe74f549d828cb1478734124be74995b70f92c7c3203b60d2cec752a107d20e925e76608cd7d6cc78305a611ce7d605d41ca7d31ff21d6ed1d9c3a406379ff9ad0059a6d3eb695f2481acfa5b185f6fe9b03af5d5ce417cafeead45aa27b42dbbede7527fa25e53ae47e26784ca25899faf22ec3323bf8b8c7a042eee1134d6a0ca8d34bf533e719a3a50c2d8ed2cb127450616f0826b23a1612e9b4aaa828b364a43365223526dc551465b2f5b1c6249f1b8cfce506d4aa3804b38b8552472d5c08d8499ff49cde5a4b3c4d57907b0aa790d7772adf71215f2f5ce457bd2edb5f3d56ce8292a11f151954cd7e8b397055dffb10ee5cd39c689969c27dd318ccc6480521bc8938f5eaad5b315fca2d25f88445e4f227f9b359b406cd069c640ef0e609091ffc498106242362b16f9920fa8e28765ccc05ce5650c84477700afb702dc13e02b32f69d0c2485049820a1ac1179ad4d290fe9bacdb524a3dde5a211c586925c6',
  email: '1598067552525.mock@example.com',
  firstName: 'Jest',
  lastName: 'User',
  roleId: 3,
  role: {
    id: 3,
    name: 'Sales',
    permissions:
      'mileage_pricing.view,pricing_exception.view,vehicle_size.view,vehicle_sizechart.view,quote.view,status.view,email_template.view,sms_template.view,quote_note.view,order.view'
  }
};

export const dispatchMockUser = {
  id: '22',
  auth0Id:
    'localauth|0810b00678f1cc263e4c03fb7bf39bc7b2c455597a1343d335e99470349efaae|df1876c505ba9a7a7de0e4588e8c8d24b35645f1b3495d5f836246b1f0b767eab25c7d66764558c00c0158333642f3a15e82c809167b47da9ae1bd230fa91d0a526e442442e05e76daf375e941c93bfebb9d4d102e02153b76d376d15b163bed92a8e08af2e217406dd985efa779f5c4df9c707316aa861cfb4a51423ea77887a01c2b811cfbee0ca5040400dd87e8e90f793a99a7160c52001368d442e78b6059c1d3a466e0e124a17d75c4fcd3eaa981e118c047b7aaf4cf0eed3d838680222d6c8c29bebcdc70a9be2c51fb031fdffe70e01fbdb4139124e0e463003ec54b60cdac84c41e681b294fa55940c3ceddc28af46f1c85aef257d821b49fc91d2d2af8782ef2064fbc9dbe23255a74115e4495253508733aea2930d736593e29a897bd0b23845c427fc77a402d20e1a1da1d5c1febcee1422a2c1754cfcf559c38cd91a5b0ffd1f669e955a6486324263a54dc801256ab248fe06bfc771bc7cba88df01c7b241550b419a28cb74c0bc12e8cd2f1fa59aa6cd4bd823d794da77cb2de41f5b36465b1c69c839c9d9d5a94809297fb9577fd792e51410e0dac3e403e44572e529d203104751875509ddeed03e6f65ad0022b6aeaa5beebcda843bd815eef3e3d81a41cff520639cc9bd777653df6d5cc88306628a225f3749938154e7a890bf795c132f6851bbc5bfdcb6a679bf939fc32b1ea5093f7e6e68fa6d6f3',
  email: '1598067563075.mock@example.com',
  firstName: 'Jest',
  lastName: 'User',
  roleId: 4,
  role: {
    id: 4,
    name: 'Dispatch',
    permissions:
      'mileage_pricing.view,pricing_exception.view,vehicle_size.view,vehicle_sizechart.view,quote.view,status.view,email_template.view,sms_template.view,quote_note.view,order.view'
  }
};

export const supportMockUser = {
  id: '23',
  auth0Id:
    'localauth|bf6278d12007dee8c02a780bf8cd1404faf2a559d336a1a5708cbe151b6fb92d|5ede3ff41a7e12c3013570a1e2c70cf145d2a7ffc623b873b9ddd5589da06d1a04ee69a20f08f0a4a003675c56971c060f931974b41ae94e0542c1f2500614185b8d2b53593c1e481b8f318e36abd5075947e8c03628411d851f3d623f5336c7386779dac05226bf3a598881cbf71eeeb8578cbb34931db2ddab57a15b374ec058a3903b79b656372e1724ee39195bf51b2175a1ad1172deaf618dfc68a953bf1be3cbdc99137c67d84dc52072d2263915aad9cc8865b90b9b2b105d138a44970296033b281031702a1b1a9f45005ec7ac0e98c62d93cbb2ce5ae9679c50415556736f08d15491948580d9a72b42a3351581f11d2f657eec22bd05864e0031c7371431cd114145848a6ab1ad331c5d812d803aede6039cc485a3cfd6f3790b74cb7db1aa8bc1c0ebbd7fff0e7cff1e39f44838f7e9e4b76ea5331304d11e8308667caf354922da84ee266185592d14a8c03de8f72427c8edb1eed492c41ca28ad28b1a993add2e42761557716004425a8d85a3821d309f0ba09b2bb48bd74633dc2b970168f283ce9cb6660406e9ba0dd8ef5d8f3746c62f384af97cc4d60714a656a05c77dec61aa48a11a1af9797087da0956121bbfe152ea0a0b74cd042c6c760edb0ce62b9baccac8653839f03471897144c7ca9047d49e64ffd4393e280f7c6e011d15122c570806eca2cf74ace8923971276d49a5a080ef8b9606d0b69',
  email: '1598067574459.mock@example.com',
  firstName: 'Jest',
  lastName: 'User',
  roleId: 5,
  role: {
    id: 5,
    name: 'Support',
    permissions: 'quote.view'
  }
};

export const parentStatus1 = 10;
export const childStatus1 = 11;
export const childStatus2 = 11;

export const parentStatus2 = 14;
export const childStatus3 = 15;
export const childStatus4 = 16;

const originLocations = [
  {
    zipcode: '35802',
    city: 'Huntsville',
    state: 'AL'
  },
  {
    zipcode: '99501',
    city: 'Anchorage',
    state: 'AK'
  },
  {
    zipcode: '90209',
    city: 'Beverly Hills',
    state: 'CA'
  },
  {
    zipcode: '85001',
    city: 'Phoenix',
    state: 'AZ'
  },
  {
    zipcode: '70112',
    city: 'New Orleans',
    state: 'LA'
  },
  {
    zipcode: '72201',
    city: 'Little Rock',
    state: 'AR'
  },
  {
    zipcode: '29020',
    city: 'Camden',
    state: 'SC'
  }
];

const destLocations = [
  {
    zipcode: '37201',
    city: 'Nashville',
    state: 'TN'
  },
  {
    zipcode: '32501',
    city: 'Pensacola',
    state: 'FL'
  },
  {
    zipcode: '82941',
    city: 'Pinedale',
    state: 'WY'
  },
  {
    zipcode: '03217',
    city: 'Ashland',
    state: 'NH'
  },
  {
    zipcode: '67201',
    city: 'Wichita',
    state: 'KS'
  },
  {
    zipcode: '90089',
    city: 'Los Angeles',
    state: 'CA'
  },
  {
    zipcode: '21237',
    city: 'Baltimore',
    state: 'MD'
  }
];

const vehicles = [
  {
    year: 2016,
    make: 'Ford',
    model: 'F-350 Super Duty',
    operable: false
  },
  {
    year: 1990,
    make: 'GMC',
    model: 'Bus',
    operable: true
  },
  {
    year: 2004,
    make: 'Isuzu',
    model: 'NPR-HD',
    operable: false
  },
  {
    year: 2007,
    make: 'Ford',
    model: 'S-max',
    operable: true
  },
  {
    year: 2018,
    make: 'Nissan',
    model: 'Altima',
    operable: true
  },
  {
    year: 2003,
    make: 'Jeep',
    model: 'Wrangler',
    operable: true
  },
  {
    year: 2007,
    make: 'Abarth',
    model: 'Grande Punto',
    operable: true
  }
];

const availableDates = [
  '2020-09-20',
  '2020-09-21',
  '2020-09-18',
  '2020-09-17',
  '2020-04-05',
  '2020-09-20',
  '2020-06-23'
];

export const randomQuoteData = (index) => ({
  shipper: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: `+1${faker.phone.phoneNumberFormat().replace(/-/g, '')}`
  },
  origin: {
    zipcode: originLocations[index].zipcode,
    city: originLocations[index].city,
    state: originLocations[index].state
  },
  destination: {
    zipcode: destLocations[index].zipcode,
    city: destLocations[index].city,
    state: destLocations[index].state
  },
  vehicles: [vehicles[index]],
  transport: {
    availableDate: availableDates[index]
  }
});

export const randomOrderData = (index) => ({
  shipper: {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: `+1${faker.phone.phoneNumberFormat().replace(/-/g, '')}`,
    address: faker.address.streetAddress(),
    city: 'Huntsville',
    state: 'AL',
    zipcode: '35802'
  },
  origin: {
    zipcode: originLocations[index].zipcode,
    city: originLocations[index].city,
    state: originLocations[index].state,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: faker.address.streetAddress(),
    phone: `+1${faker.phone.phoneNumberFormat().replace(/-/g, '')}`
  },
  destination: {
    zipcode: destLocations[index].zipcode,
    city: destLocations[index].city,
    state: destLocations[index].state,
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    address: faker.address.streetAddress(),
    phone: `+1${faker.phone.phoneNumberFormat().replace(/-/g, '')}`
  },
  vehicles: [
    {
      ...vehicles[index],
      sizeId: 36,
      color: '#324323'
    }
  ],
  transport: {
    availableDate: availableDates[index]
  }
});

export const demoQuoteId1 = '1110';
export const demoEmailTemplateId = '5';

export const dummyQuoteIdForAssetSpec = '1111';

export const dummyCarrierIdForAssetSpec = '51';

export const customReport = [
  {
    area: 'Quotes',
    fields: [
      {
        name: 'Order ID',
        filter: 'ORDER_ID'
      },
      {
        name: 'Shipper First Name',
        filter: 'SHIPPER_FIRST_NAME'
      },
      {
        name: 'Shipper Last Name',
        filter: 'SHIPPER_LAST_NAME'
      },
      {
        name: 'Origin City',
        filter: 'ORIGIN_CITY'
      },
      {
        name: 'Origin State',
        filter: 'ORIGIN_STATE'
      },
      {
        name: 'Origin Zipcode',
        filter: 'ORIGIN_ZIPCODE'
      },
      {
        name: 'Destination City',
        filter: 'DESTINATION_CITY'
      },
      {
        name: 'Destination State',
        filter: 'DESTINATION_STATE'
      },
      {
        name: 'Destination Zipcode',
        filter: 'DESTINATION_ZIPCODE'
      },
      {
        name: 'Available Date',
        filter: 'AVAILABLE_DATE'
      },
      {
        name: 'Company',
        filter: 'COMPANY'
      },
      {
        name: 'Shipper Email',
        filter: 'SHIPPER_EMAIL'
      },
      {
        name: 'Shipper Phone 1',
        filter: 'SHIPPER_PHONE_1'
      },
      {
        name: 'Shipper Phone 2',
        filter: 'SHIPPER_PHONE_2'
      },
      {
        name: 'Shipper Mobile',
        filter: 'SHIPPER_MOBILE'
      },
      {
        name: 'Shipper Fax',
        filter: 'SHIPPER_FAX'
      },
      {
        name: 'Shipper Address 1',
        filter: 'SHIPPER_ADDRESS_1'
      },
      {
        name: 'Shipper Address 2',
        filter: 'SHIPPER_ADDRESS_2'
      },
      {
        name: 'Shipper Address City',
        filter: 'SHIPPER_ADDRESS_CITY'
      },
      {
        name: 'Shipper Address State',
        filter: 'SHIPPER_ADDRESS_STATE'
      },
      {
        name: 'Shipper Address Zipcode',
        filter: 'SHIPPER_ADDRESS_ZIPCODE'
      },
      {
        name: 'Referrer',
        filter: 'REFERRER'
      },
      {
        name: 'Carrier Type',
        filter: 'CARRIER_TYPE'
      },
      {
        name: 'Created',
        filter: 'CREATED'
      },
      {
        name: 'Price',
        filter: 'PRICE'
      },
      {
        name: 'Deposit',
        filter: 'DEPOSIT'
      },
      {
        name: 'Assigned To',
        filter: 'ASSIGNED_TO'
      },
      {
        name: 'Status',
        filter: 'STATUS'
      },
      {
        name: 'Vehicle Identification Number',
        filter: 'VEHICLE_IDENTIFICATION_NUMBER'
      },
      {
        name: 'Vehicle Year',
        filter: 'VEHICLE_YEAR'
      },
      {
        name: 'Vehicle Maker',
        filter: 'VEHICLE_MAKER'
      },
      {
        name: 'Vehicle Model',
        filter: 'VEHICLE_MODEL'
      },
      {
        name: 'Vehicle Running Condition',
        filter: 'VEHICLE_RUNNING_CONDITION'
      },
      {
        name: 'Vehicle P.O.',
        filter: 'VEHICLE_P_O'
      },
      {
        name: 'Vehicle Note',
        filter: 'VEHICLE_NOTE'
      }
    ]
  },
  {
    area: 'Orders',
    fields: [
      {
        name: 'Order ID',
        filter: 'ORDER_ID'
      },
      {
        name: 'Shipper First Name',
        filter: 'SHIPPER_FIRST_NAME'
      },
      {
        name: 'Shipper Last Name',
        filter: 'SHIPPER_LAST_NAME'
      },
      {
        name: 'Origin City',
        filter: 'ORIGIN_CITY'
      },
      {
        name: 'Origin State',
        filter: 'ORIGIN_STATE'
      },
      {
        name: 'Origin Zipcode',
        filter: 'ORIGIN_ZIPCODE'
      },
      {
        name: 'Destination City',
        filter: 'DESTINATION_CITY'
      },
      {
        name: 'Destination State',
        filter: 'DESTINATION_STATE'
      },
      {
        name: 'Destination Zipcode',
        filter: 'DESTINATION_ZIPCODE'
      },
      {
        name: 'Available Date',
        filter: 'AVAILABLE_DATE'
      },
      {
        name: 'Company',
        filter: 'COMPANY'
      },
      {
        name: 'Shipper Email',
        filter: 'SHIPPER_EMAIL'
      },
      {
        name: 'Shipper Phone 1',
        filter: 'SHIPPER_PHONE_1'
      },
      {
        name: 'Shipper Phone 2',
        filter: 'SHIPPER_PHONE_2'
      },
      {
        name: 'Shipper Mobile',
        filter: 'SHIPPER_MOBILE'
      },
      {
        name: 'Shipper Fax',
        filter: 'SHIPPER_FAX'
      },
      {
        name: 'Shipper Address 1',
        filter: 'SHIPPER_ADDRESS_1'
      },
      {
        name: 'Shipper Address 2',
        filter: 'SHIPPER_ADDRESS_2'
      },
      {
        name: 'Shipper Address City',
        filter: 'SHIPPER_ADDRESS_CITY'
      },
      {
        name: 'Shipper Address State',
        filter: 'SHIPPER_ADDRESS_STATE'
      },
      {
        name: 'Shipper Address Zipcode',
        filter: 'SHIPPER_ADDRESS_ZIPCODE'
      },
      {
        name: 'Referrer',
        filter: 'REFERRER'
      },
      {
        name: 'Carrier Type',
        filter: 'CARRIER_TYPE'
      },
      {
        name: 'Created',
        filter: 'CREATED'
      },
      {
        name: 'Price',
        filter: 'PRICE'
      },
      {
        name: 'Deposit',
        filter: 'DEPOSIT'
      },
      {
        name: 'Assigned To',
        filter: 'ASSIGNED_TO'
      },
      {
        name: 'Status',
        filter: 'STATUS'
      },
      {
        name: 'Vehicle Identification Number',
        filter: 'VEHICLE_IDENTIFICATION_NUMBER'
      },
      {
        name: 'Vehicle Year',
        filter: 'VEHICLE_YEAR'
      },
      {
        name: 'Vehicle Maker',
        filter: 'VEHICLE_MAKER'
      },
      {
        name: 'Vehicle Model',
        filter: 'VEHICLE_MODEL'
      },
      {
        name: 'Vehicle Running Condition',
        filter: 'VEHICLE_RUNNING_CONDITION'
      },
      {
        name: 'Vehicle P.O.',
        filter: 'VEHICLE_P_O'
      },
      {
        name: 'Vehicle Note',
        filter: 'VEHICLE_NOTE'
      }
    ]
  }
];
