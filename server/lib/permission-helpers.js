import {
  USER_PERMISSIONS,
  REPORT_PERMISSIONS,
  TAQ_PERMISSIONS,
  PAYMENT_PERMISSIONS,
  EMAIL_TEMPLATE_PERMISSIONS,
  SMS_TEMPLATE_PERMISSIONS,
  STATUS_PERMISSIONS,
  QUOTE_PERMISSIONS,
  ORDER_PERMISSIONS,
  CARRIER_PERMISSIONS,
  PERMISSION_PERMISSIONS,
  ROLE_NAMES
} from '@server/constants';

export const removePermission = (permissions, permission) =>
  permissions
    .split(',')
    .filter((p) => p !== permission)
    .join(',');

export const removeUserPermission = (user, permission) => {
  const permissions = removePermission(user.permissions, permission);

  return {
    ...user,
    permissions
  };
};

const wrap = (fn) => (user) => {
  if (!user) return false;
  if (user.role.name === ROLE_NAMES.SUPERADMIN) return true;
  return fn(user);
};

export const assessPermission = {
  isSuperAdmin: (user) => user.role.name === ROLE_NAMES.SUPERADMIN,
  user: {
    canView: wrap((user) => user.permissions.indexOf(USER_PERMISSIONS.view) !== -1),
    canCreate: wrap((user) => user.permissions.indexOf(USER_PERMISSIONS.create) !== -1),
    canUpdate: wrap((user) => user.permissions.indexOf(USER_PERMISSIONS.update) !== -1)
  },
  report: {
    canView: wrap((user) => {
      if (user.permissions.indexOf(REPORT_PERMISSIONS.viewAll) === -1) return false;
      if (user.permissions.indexOf(REPORT_PERMISSIONS.viewDispatchOnly) === -1) return false;
      if (user.permissions.indexOf(REPORT_PERMISSIONS.viewAllAvailableOrders) === -1) return false;
      return true;
    }),
    canCreate: wrap((user) => user.permissions.indexOf(REPORT_PERMISSIONS.create) !== -1),
    canViewAll: wrap((user) => user.permissions.indexOf(REPORT_PERMISSIONS.viewAll) !== -1),
    canViewDispatchOnly: wrap(
      (user) => user.permissions.indexOf(REPORT_PERMISSIONS.viewDispatchOnly) !== -1
    ),
    canViewAllAvailableOrders: wrap(
      (user) => user.permissions.indexOf(REPORT_PERMISSIONS.viewAllAvailableOrders) !== -1
    )
  },
  taq: {
    canView: wrap((user) => user.permissions.indexOf(TAQ_PERMISSIONS.view) !== -1),
    canUpdate: wrap((user) => user.permissions.indexOf(TAQ_PERMISSIONS.update) !== -1)
  },
  payment: {
    canAddManually: wrap((user) => user.permissions.indexOf(PAYMENT_PERMISSIONS.manualAdd) !== -1),
    canCharge: wrap((user) => user.permissions.indexOf(PAYMENT_PERMISSIONS.charge) !== -1)
  },
  emailTemplate: {
    canView: wrap((user) => user.permissions.indexOf(EMAIL_TEMPLATE_PERMISSIONS.view) !== -1),
    canCreate: wrap((user) => user.permissions.indexOf(EMAIL_TEMPLATE_PERMISSIONS.create) !== -1),
    canUpdate: wrap((user) => user.permissions.indexOf(EMAIL_TEMPLATE_PERMISSIONS.update) !== -1)
  },
  smsTemplate: {
    canView: wrap((user) => user.permissions.indexOf(SMS_TEMPLATE_PERMISSIONS.view) !== -1),
    canCreate: wrap((user) => user.permissions.indexOf(SMS_TEMPLATE_PERMISSIONS.create) !== -1),
    canUpdate: wrap((user) => user.permissions.indexOf(SMS_TEMPLATE_PERMISSIONS.update) !== -1)
  },
  status: {
    canView: wrap((user) => user.permissions.indexOf(STATUS_PERMISSIONS.view) !== -1),
    canCreate: wrap((user) => user.permissions.indexOf(STATUS_PERMISSIONS.create) !== -1),
    canUpdate: wrap((user) => user.permissions.indexOf(STATUS_PERMISSIONS.update) !== -1)
  },
  quote: {
    canView: wrap((user) => user.permissions.indexOf(QUOTE_PERMISSIONS.view) !== -1),
    canCreate: wrap((user) => user.permissions.indexOf(QUOTE_PERMISSIONS.create) !== -1),
    canUpdate: wrap((user) => user.permissions.indexOf(QUOTE_PERMISSIONS.update) !== -1),
    canContactShipper: wrap(
      (user) => user.permissions.indexOf(QUOTE_PERMISSIONS.contactShipper) !== -1
    )
  },
  order: {
    canView: wrap((user) => user.permissions.indexOf(ORDER_PERMISSIONS.view) !== -1),
    canCreate: wrap((user) => user.permissions.indexOf(ORDER_PERMISSIONS.create) !== -1),
    canUpdate: wrap((user) => user.permissions.indexOf(ORDER_PERMISSIONS.update) !== -1),
    canContactShipper: wrap(
      (user) => user.permissions.indexOf(ORDER_PERMISSIONS.contactShipper) !== -1
    ),
    canPostToLoadBoardOnly: wrap(
      (user) => user.permissions.indexOf(ORDER_PERMISSIONS.postToLoadBoardOnly) !== -1
    ),
    canDispatchOnly: wrap(
      (user) => user.permissions.indexOf(ORDER_PERMISSIONS.dispatchOnly) !== -1
    )
  },
  carrier: {
    canView: wrap((user) => user.permissions.indexOf(CARRIER_PERMISSIONS.view) !== -1),
    canCreate: wrap((user) => user.permissions.indexOf(CARRIER_PERMISSIONS.create) !== -1),
    canUpdate: wrap((user) => user.permissions.indexOf(CARRIER_PERMISSIONS.update) !== -1)
  },
  permission: {
    canView: wrap((user) => user.permissions.indexOf(PERMISSION_PERMISSIONS.view) !== -1),
    canUpdate: wrap((user) => user.permissions.indexOf(PERMISSION_PERMISSIONS.update) !== -1)
  }
};

export const getRoleTitle = (roleName) => {
  if (roleName === ROLE_NAMES.SUPERADMIN) return 'Super Admin';
  if (roleName === ROLE_NAMES.ADMIN) return 'Admin';
  if (roleName === ROLE_NAMES.MANAGER) return 'Manager';
  if (roleName === ROLE_NAMES.SALES) return 'Sales';
  if (roleName === ROLE_NAMES.DISPATCH) return 'Dispatch';
  if (roleName === ROLE_NAMES.SUPPORT) return 'Support';
  return 'N/A';
};
