export const USER_STATUSES = {
  ACTIVATED: 'ACTIVATED',
  DEACTIVATED: 'DEACTIVATED'
};

export const ROLE_NAMES = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  SALES: 'SALES',
  DISPATCH: 'DISPATCH',
  SUPPORT: 'SUPPORT'
};

export const USER_PERMISSIONS = {
  view: 'user.view',
  create: 'user.create',
  update: 'user.update'
};

export const REPORT_PERMISSIONS = {
  create: 'report.create',
  viewAll: 'report.view_all',
  viewDispatchOnly: 'report.view_dispatch_only',
  viewAllAvailableOrders: 'report.view_all_available_orders'
};

export const TAQ_PERMISSIONS = {
  view: 'taq.view',
  update: 'taq.update'
};

export const PAYMENT_PERMISSIONS = {
  manualAdd: 'payment.manual_add',
  charge: 'payment.charge'
};

export const EMAIL_TEMPLATE_PERMISSIONS = {
  view: 'email_template.view',
  create: 'email_template.create',
  update: 'email_template.update'
};

export const SMS_TEMPLATE_PERMISSIONS = {
  view: 'sms_template.view',
  create: 'sms_template.create',
  update: 'sms_template.update'
};

export const STATUS_PERMISSIONS = {
  view: 'status.view',
  create: 'status.create',
  update: 'status.update'
};

export const QUOTE_PERMISSIONS = {
  view: 'quote.view',
  create: 'quote.create',
  update: 'quote.update',
  contactShipper: 'quote.contact_shipper'
};

export const ORDER_PERMISSIONS = {
  view: 'order.view',
  create: 'order.create',
  update: 'order.update',
  contactShipper: 'order.contact_shipper',
  // changeStatus: 'order.change_status',
  postToLoadBoardOnly: 'order.post_to_load_board_only',
  dispatchOnly: 'order.dispatch_only'
};

export const CARRIER_PERMISSIONS = {
  view: 'carrier.view',
  create: 'carrier.create',
  update: 'carrier.update'
};

export const PERMISSION_PERMISSIONS = {
  view: 'permission.view',
  update: 'permission.update'
};

export const USER_ACCESSES = [{
  principal: 'User Accounts',
  permissions: [{
    id: USER_PERMISSIONS.view,
    label: 'View Users'
  }, {
    id: USER_PERMISSIONS.create,
    label: 'Create New User'
  }, {
    id: USER_PERMISSIONS.update,
    label: 'Edit Users'
  }]
}, {
  principal: 'Reports',
  permissions: [{
    id: REPORT_PERMISSIONS.create,
    label: 'Create New Report'
  }, {
    id: REPORT_PERMISSIONS.viewAll,
    label: 'View All Reports'
  }, {
    id: REPORT_PERMISSIONS.viewDispatchOnly,
    label: 'View Dispatch Reports Only'
  }, {
    id: REPORT_PERMISSIONS.viewAllAvailableOrders,
    label: 'View All Available Orders'
  }]
}, {
  principal: 'TAQ',
  permissions: [{
    id: TAQ_PERMISSIONS.view,
    label: 'View TAQ'
  }, {
    id: TAQ_PERMISSIONS.update,
    label: 'Edit TAQ'
  }]
}, {
  principal: 'Payment',
  permissions: [{
    id: PAYMENT_PERMISSIONS.manualAdd,
    label: 'Add Order Payment Information'
  }, {
    id: PAYMENT_PERMISSIONS.charge,
    label: 'Charge Order'
  }]
}, {
  principal: 'Email Templates',
  permissions: [{
    id: EMAIL_TEMPLATE_PERMISSIONS.view,
    label: 'View Email Templates'
  }, {
    id: EMAIL_TEMPLATE_PERMISSIONS.create,
    label: 'Create New Email Template'
  }, {
    id: EMAIL_TEMPLATE_PERMISSIONS.update,
    label: 'Edit Email Templates'
  }]
}, {
  principal: 'SMS Templates',
  permissions: [{
    id: SMS_TEMPLATE_PERMISSIONS.view,
    label: 'View SMS Templates'
  }, {
    id: SMS_TEMPLATE_PERMISSIONS.create,
    label: 'Create New SMS Template'
  }, {
    id: SMS_TEMPLATE_PERMISSIONS.update,
    label: 'Edit SMS Templates'
  }]
}, {
  principal: 'Statuses',
  permissions: [{
    id: STATUS_PERMISSIONS.view,
    label: 'View Statuses'
  }, {
    id: STATUS_PERMISSIONS.create,
    label: 'Create New Status'
  }, {
    id: STATUS_PERMISSIONS.update,
    label: 'Edit Statuses'
  }]
}, {
  principal: 'Quotes',
  permissions: [{
    id: QUOTE_PERMISSIONS.view,
    label: 'View Quotes'
  }, {
    id: QUOTE_PERMISSIONS.create,
    label: 'Create New Quote'
  }, {
    id: QUOTE_PERMISSIONS.update,
    label: 'Edit Quotes'
  }, {
    id: QUOTE_PERMISSIONS.contactShipper,
    label: 'Contact Shipper'
  }]
}, {
  principal: 'Orders',
  permissions: [{
    id: ORDER_PERMISSIONS.view,
    label: 'View Orders'
  }, {
    id: ORDER_PERMISSIONS.create,
    label: 'Create New Order'
  }, {
    id: ORDER_PERMISSIONS.update,
    label: 'Edit Orders'
  // }, {
  //   id: ORDER_PERMISSIONS.changeStatus,
  //   label: 'Change Status'
  }, {
    id: ORDER_PERMISSIONS.postToLoadBoardOnly,
    label: 'Post to Load Board Only'
  }, {
    id: ORDER_PERMISSIONS.dispatchOnly,
    label: 'Dispatch Only'
  }]
}, {
  principal: 'Carriers',
  permissions: [{
    id: CARRIER_PERMISSIONS.view,
    label: 'View Carriers'
  }, {
    id: CARRIER_PERMISSIONS.create,
    label: 'Create New Carrier'
  }, {
    id: CARRIER_PERMISSIONS.update,
    label: 'Edit Carriers'
  }]
}, {
  principal: 'Permissions',
  permissions: [{
    id: PERMISSION_PERMISSIONS.view,
    label: 'View Permissions'
  }, {
    id: PERMISSION_PERMISSIONS.update,
    label: 'Update Permissions'
  }]
}];

export const DEFAULT_PERMISSIONS_BY_ROLE = {
  [ROLE_NAMES.ADMIN]: [
    QUOTE_PERMISSIONS.view,
    QUOTE_PERMISSIONS.update,
    QUOTE_PERMISSIONS.create,
    QUOTE_PERMISSIONS.contactShipper,
    ORDER_PERMISSIONS.view,
    ORDER_PERMISSIONS.update,
    ORDER_PERMISSIONS.create,
    ORDER_PERMISSIONS.contactShipper,
    ORDER_PERMISSIONS.dispatchOnly,
    ORDER_PERMISSIONS.postToLoadBoardOnly,
    USER_PERMISSIONS.view,
    REPORT_PERMISSIONS.viewAll,
    REPORT_PERMISSIONS.viewAllAvailableOrders,
    REPORT_PERMISSIONS.viewDispatchOnly,
    REPORT_PERMISSIONS.create,
    TAQ_PERMISSIONS.view,
    TAQ_PERMISSIONS.update,
    PAYMENT_PERMISSIONS.manualAdd,
    PAYMENT_PERMISSIONS.charge,
    EMAIL_TEMPLATE_PERMISSIONS.view,
    EMAIL_TEMPLATE_PERMISSIONS.create,
    EMAIL_TEMPLATE_PERMISSIONS.update,
    SMS_TEMPLATE_PERMISSIONS.view,
    SMS_TEMPLATE_PERMISSIONS.create,
    SMS_TEMPLATE_PERMISSIONS.update,
    STATUS_PERMISSIONS.view,
    STATUS_PERMISSIONS.create,
    STATUS_PERMISSIONS.update,
    CARRIER_PERMISSIONS.view,
    CARRIER_PERMISSIONS.create,
    CARRIER_PERMISSIONS.update,
    PERMISSION_PERMISSIONS.view
  ],
  [ROLE_NAMES.MANAGER]: [
    QUOTE_PERMISSIONS.view,
    QUOTE_PERMISSIONS.update,
    QUOTE_PERMISSIONS.create,
    QUOTE_PERMISSIONS.contactShipper,
    ORDER_PERMISSIONS.view,
    ORDER_PERMISSIONS.update,
    ORDER_PERMISSIONS.create,
    ORDER_PERMISSIONS.contactShipper,
    ORDER_PERMISSIONS.dispatchOnly,
    ORDER_PERMISSIONS.postToLoadBoardOnly,
    USER_PERMISSIONS.view,
    REPORT_PERMISSIONS.viewAll,
    REPORT_PERMISSIONS.viewAllAvailableOrders,
    REPORT_PERMISSIONS.viewDispatchOnly,
    REPORT_PERMISSIONS.create,
    PAYMENT_PERMISSIONS.manualAdd,
    PAYMENT_PERMISSIONS.charge,
    EMAIL_TEMPLATE_PERMISSIONS.view,
    EMAIL_TEMPLATE_PERMISSIONS.create,
    EMAIL_TEMPLATE_PERMISSIONS.update,
    SMS_TEMPLATE_PERMISSIONS.view,
    SMS_TEMPLATE_PERMISSIONS.create,
    SMS_TEMPLATE_PERMISSIONS.update,
    STATUS_PERMISSIONS.view,
    STATUS_PERMISSIONS.create,
    STATUS_PERMISSIONS.update,
    CARRIER_PERMISSIONS.view,
    CARRIER_PERMISSIONS.create,
    CARRIER_PERMISSIONS.update
  ],
  [ROLE_NAMES.SALES]: [
    QUOTE_PERMISSIONS.view,
    QUOTE_PERMISSIONS.contactShipper,
    ORDER_PERMISSIONS.view,
    ORDER_PERMISSIONS.contactShipper
  ],
  [ROLE_NAMES.DISPATCH]: [
    QUOTE_PERMISSIONS.view,
    ORDER_PERMISSIONS.view,
    ORDER_PERMISSIONS.dispatchOnly,
    ORDER_PERMISSIONS.postToLoadBoardOnly
  ],
  [ROLE_NAMES.SUPPORT]: [
    QUOTE_PERMISSIONS.view,
    ORDER_PERMISSIONS.view
  ]
};

const allPermissions = [];
USER_ACCESSES.forEach((access) => {
  access.permissions.forEach((p) => allPermissions.push(p.id));
});
export const ALL_PERMISSIONS = allPermissions;
