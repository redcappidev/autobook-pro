import Home from '@client/pages/home';
import Dashboard from '@client/pages/dashboard';
import Notifications from '@client/pages/notifications';
import Quotes from '@client/pages/quotes/list';
import CreateQuote from '@client/pages/quotes/new';
import QuoteDetail from '@client/pages/quotes/detail';
import Convert from '@client/pages/quotes/convert';
import Book from '@client/pages/quotes/book';
import TermsAndConditions from '@client/pages/quotes/terms';
import BillingInformation from '@client/pages/quotes/billing-info';
import Settings from '@client/pages/settings';

import GeneralSettings from '@client/pages/settings/general';
import LeadScheduleSettings from '@client/pages/settings/lead-schedule';
import ShortCodeSettings from '@client/pages/settings/short-codes';
import EmailTemplates from '@client/pages/email-templates/list';
import EmailTemplateDetail from '@client/pages/email-templates/detail';

import SMSTemplates from '@client/pages/sms-templates/list';
import SMSTemplateDetail from '@client/pages/sms-templates/detail';

import Statuses from '@client/pages/statuses/list';
import CreateStatus from '@client/pages/statuses/create';
import StatusDetail from '@client/pages/statuses/detail';

import TAQ from '@client/pages/taq';
import MileagePricing from '@client/pages/taq/mileage-pricing';
import ExceptionRules from '@client/pages/taq/exceptions';
import VehicleSize from '@client/pages/taq/vehicle-size';
import VehicleSizechart from '@client/pages/taq/vehicle-sizechart';
import Fees from '@client/pages/taq/fees';
import CarrierList from '@client/pages/carriers/carrier-list';
import CreateCarrier from '@client/pages/carriers/create-carrier';
import CarrierDetail from '@client/pages/carriers/carrier-detail';
import Reports from '@client/pages/reports';
import Users from '@client/pages/users/list';
import Invitation from '@client/pages/users/invitation';

import Integrations from '@client/pages/integrations/list';

import HomeLayout from '@client/layouts/home-layout';
import DashboardLayout from '@client/layouts/dashboard-layout';

import graphql from '@client/graphql';
import { assessPermission } from '@server/lib/permission-helpers';

const getCurrentUser = async (apolloProvider) => {
  const response = await apolloProvider.defaultClient.query({
    query: graphql.queries.currentUser
  });
  return response.data.currentUser;
};

const makeRoutes = (apolloProvider) => [
  {
    path: '/',
    component: HomeLayout,
    children: [
      {
        name: 'home',
        path: '',
        component: Home
      },
      {
        name: 'book-order',
        path: '/book-order/:token',
        component: Book
      },
      {
        name: 'terms-and-conditions',
        path: '/terms-and-conditions/:token',
        component: TermsAndConditions
      },
      {
        name: 'billing-information',
        path: '/billing-information/:token',
        component: BillingInformation
      },
      {
        name: 'invitation',
        path: '/invitation/:token',
        component: Invitation
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        name: 'dashboard',
        path: '/',
        component: Dashboard
      },
      {
        name: 'notifications',
        path: '/notifications',
        component: Notifications
      },
      {
        name: 'create-quote',
        path: '/quotes/create',
        component: CreateQuote,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.quote.canCreate(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'convert-to-order',
        path: '/quotes/:id/convert',
        component: Convert,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.order.canCreate(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'quote-detail',
        path: '/quotes/:id',
        component: QuoteDetail,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.quote.canView(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'quotes',
        path: '/quotes',
        component: Quotes,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.quote.canView(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'followups',
        path: '/followups',
        component: Quotes,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.quote.canView(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'create-order',
        path: '/orders/create',
        component: CreateQuote,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.order.canCreate(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'convert-to-quote',
        path: '/orders/:id/convert',
        component: Convert,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.quote.canCreate(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'order-detail',
        path: '/orders/:id',
        component: QuoteDetail,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.order.canView(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'orders',
        path: '/orders',
        component: Quotes,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.order.canView(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'reports',
        path: '/reports',
        component: Reports,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.report.canView(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'users',
        path: '/users',
        component: Users,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.user.canView(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'settings',
        path: '/settings',
        component: Settings,
        async beforeEnter(to, from, next) {
          if (to.name === 'settings') {
            next({ name: 'general' });
          } else {
            next();
          }
        },
        children: [
          {
            name: 'general',
            path: 'general',
            component: GeneralSettings
          },
          {
            name: 'create-email-template',
            path: 'email-templates/create',
            component: EmailTemplateDetail,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.emailTemplate.canCreate(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'email-template-detail',
            path: 'email-templates/:id',
            component: EmailTemplateDetail,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.emailTemplate.canUpdate(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'email-templates',
            path: 'email-templates',
            component: EmailTemplates,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.emailTemplate.canView(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'create-sms-templates',
            path: 'sms-templates/create',
            component: SMSTemplateDetail,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.smsTemplate.canCreate(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'sms-templates-detail',
            path: 'sms-templates/:id',
            component: SMSTemplateDetail,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.smsTemplate.canUpdate(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'sms-templates',
            path: 'sms-templates',
            component: SMSTemplates,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.smsTemplate.canView(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'create-status',
            path: 'statuses/create',
            component: CreateStatus,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.status.canCreate(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'status-detail',
            path: 'statuses/:id',
            component: StatusDetail,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.status.canUpdate(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'statuses',
            path: 'statuses',
            component: Statuses,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.status.canView(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'integrations',
            path: 'integrations',
            component: Integrations
          },
          {
            name: 'lead-schedule',
            path: 'lead-schedule',
            component: LeadScheduleSettings,
            async beforeEnter(to, from, next) {
              const user = await getCurrentUser(apolloProvider);
              if (assessPermission.isSuperAdmin(user)) {
                next();
              } else {
                next({ name: 'settings' });
              }
            }
          },
          {
            name: 'short-codes',
            path: 'short-codes',
            component: ShortCodeSettings
          }
        ]
      },
      {
        name: 'taq',
        path: '/taq',
        component: TAQ,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.taq.canView(user)) {
            if (to.name === 'taq') {
              next({ name: 'mileage-pricing' });
            } else {
              next();
            }
          } else {
            next({ name: 'dashboard' });
          }
        },
        children: [
          {
            name: 'mileage-pricing',
            path: 'mileage-pricing',
            component: MileagePricing
          },
          {
            name: 'exceptions',
            path: 'exceptions',
            component: ExceptionRules
          },
          {
            name: 'vehicle-size',
            path: 'vehicle-size',
            component: VehicleSize
          },
          {
            name: 'vehicle-sizechart',
            path: 'vehicle-sizechart',
            component: VehicleSizechart
          },
          {
            name: 'fees',
            path: 'fees',
            component: Fees
          }
        ]
      },
      {
        name: 'create-carrier',
        path: '/carriers/new',
        component: CreateCarrier,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.carrier.canCreate(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'carrier-detail',
        path: '/carriers/:id',
        component: CarrierDetail,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.carrier.canUpdate(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      },
      {
        name: 'carriers',
        path: '/carriers',
        component: CarrierList,
        async beforeEnter(to, from, next) {
          const user = await getCurrentUser(apolloProvider);
          if (assessPermission.carrier.canView(user)) {
            next();
          } else {
            next({ name: 'dashboard' });
          }
        }
      }
    ]
  },
  {
    name: 'form-exercise',
    path: '/form-exercise',
    component: () => import('@client/pages/__temp/form-exercise')
  },
  {
    name: 'file-upload',
    path: '/file-upload',
    component: () => import('@client/pages/__temp/file-upload')
  }
];

export default makeRoutes;
