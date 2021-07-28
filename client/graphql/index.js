import {
  GetTeamMembers,
  GetRoles,
  CurrentUser,
  LoadUsers,
  UpdateUserLeadSchedule,
  UpdateUserAccess,
  UpdateUserProfile,
  ResolveInvitationLink,
  InviteUser,
  ActivateUser,
  DeactivateUser
} from './User.gql';
import { CreateUploadForm, AttachFileToQuote } from './Asset.gql';
import {
  GetQuote,
  FindPossibleDuplicates,
  PowerSearch,
  GetQuoteEvents,
  LoadQuotes,
  GetQuotesCount,
  CalcQuotePrice,
  CreateQuote,
  UpdateQuote,
  DuplicateQuote,
  ConvertToQuote,
  SendQuoteEmail,
  SendTermsAndConditionsEmail,
  SendBillingInfoInputEmail,
  SendQuoteSMS,
  ResolveBookOrderLink,
  UpdateQuoteByCustomer,
  ReassignQuotes
} from './Quote.gql';
import { GetFollowups, GetFollowupsCount } from './Followup.gql';
import {
  LoadOrders,
  GetOrdersCount,
  GetOrder,
  CreateOrder,
  UpdateOrder,
  PostToLoadBoard,
  RemoveFromLoadBoard,
  DuplicateOrder,
  ConvertToOrder,
  SetBillingInfoToOrder,
  ChargeOrder,
  DispatchOrder,
  ResolveTermsAndConditionsLink,
  ResolveBillingInformationLink,
  AcceptTermsAndConditions,
  ProvideBillingInfo,
  ReassignOrders
} from './Order.gql';
import {
  GetEmailTemplate,
  GetEmailTemplates,
  CreateEmailTemplate,
  UpdateEmailTemplate,
  DeleteEmailTemplate
} from './EmailTemplate.gql';
import {
  GetSMSTemplate,
  GetSMSTemplates,
  CreateSMSTemplate,
  UpdateSMSTemplate,
  DeleteSMSTemplate
} from './SMSTemplate.gql';
import {
  GetStatus,
  GetParentStatus,
  UpdateStatus,
  CreateStatus,
  DeleteStatus
} from './Status.gql';

import {
  GetVehicleSizes,
  GetVehicleSizechart,
  UpdateVehicleSizechart,
  DeleteVehicleSizechart,
  UpdateVehicleSize
} from './VehicleSize.gql';

import {
  AddQuoteNote,
  UpdateQuoteNote,
  DeleteQuoteNote
} from './Note.gql';

import {
  GetMileagePricings,
  UpdateMileagePricings,
  DeleteMileagePricings
} from './MileagePricing.gql';

import {
  GetPricingExceptions,
  CreatePricingException,
  UpdatePricingException,
  UpdatePricingExceptions
} from './PricingException.gql';

import {
  GetCarrier,
  GetCarriers,
  AddCarrier,
  UpdateCarrier,
  AddDriver,
  UpdateDriver
} from './Carrier.gql';

import {
  GetFees,
  UpdateFees,
  GetEnclosedFees,
  UpdateEnclosedFees,
  DeleteEnclosedFees
} from './Fee.gql';

import {
  GetPhoneNumber,
  SetPhoneNumber
} from './Integration.gql';

import {
  GetNotificationsCount,
  GetTodayNotifications,
  GetEarlierNotifications,
  MarkNotificationAsRead,
  MarkTodayNotificationsAsRead,
  MarkEarlierNotificationsAsRead
} from './Notification.gql';

import {
  GetQuotesMonthlyTotals,
  GetUserQuotesDailyTotals,
  GetTodayTransactions
} from './Report.gql';

import {
  GetShortCodes,
  UpdateShortCodes,
  DeleteShortCodes
} from './ShortCode.gql';

export default {
  queries: {
    getTeamMembers: GetTeamMembers,
    getRoles: GetRoles,
    currentUser: CurrentUser,
    loadUsers: LoadUsers,
    getEmailTemplate: GetEmailTemplate,
    getEmailTemplates: GetEmailTemplates,
    getSMSTemplate: GetSMSTemplate,
    getSMSTemplates: GetSMSTemplates,
    getStatus: GetStatus,
    getParentStatus: GetParentStatus,
    powerSearch: PowerSearch,
    loadQuotes: LoadQuotes,
    getQuoteEvents: GetQuoteEvents,
    getQuotesCount: GetQuotesCount,
    getQuote: GetQuote,
    findPossibleDuplicates: FindPossibleDuplicates,
    getFollowups: GetFollowups,
    getFollowupsCount: GetFollowupsCount,
    getVehicleSizes: GetVehicleSizes,
    getMileagePricings: GetMileagePricings,
    getPricingExceptions: GetPricingExceptions,
    getVehicleSizechart: GetVehicleSizechart,
    loadOrders: LoadOrders,
    getOrdersCount: GetOrdersCount,
    getOrder: GetOrder,
    getCarrier: GetCarrier,
    getCarriers: GetCarriers,
    getEnclosedFees: GetEnclosedFees,
    getFees: GetFees,
    getPhoneNumber: GetPhoneNumber,
    getTodayNotifications: GetTodayNotifications,
    getEarlierNotifications: GetEarlierNotifications,
    getNotificationsCount: GetNotificationsCount,
    getQuotesMonthlyTotals: GetQuotesMonthlyTotals,
    getUserQuotesDailyTotals: GetUserQuotesDailyTotals,
    getTodayTransactions: GetTodayTransactions,
    getShortCodes: GetShortCodes
  },
  mutations: {
    updateUserLeadSchedule: UpdateUserLeadSchedule,
    updateUserAccess: UpdateUserAccess,
    updateUserProfile: UpdateUserProfile,
    resolveInvitationLink: ResolveInvitationLink,
    inviteUser: InviteUser,
    activateUser: ActivateUser,
    deactivateUser: DeactivateUser,
    createUploadForm: CreateUploadForm,
    attachFileToQuote: AttachFileToQuote,
    updateStatus: UpdateStatus,
    createStatus: CreateStatus,
    deleteStatus: DeleteStatus,
    createEmailTemplate: CreateEmailTemplate,
    updateEmailTemplate: UpdateEmailTemplate,
    deleteEmailTemplate: DeleteEmailTemplate,
    createSMSTemplate: CreateSMSTemplate,
    updateSMSTemplate: UpdateSMSTemplate,
    deleteSMSTemplate: DeleteSMSTemplate,
    calcQuotePrice: CalcQuotePrice,
    createQuote: CreateQuote,
    updateQuote: UpdateQuote,
    reassignQuotes: ReassignQuotes,
    duplicateQuote: DuplicateQuote,
    sendQuoteEmail: SendQuoteEmail,
    sendTermsAndConditionsEmail: SendTermsAndConditionsEmail,
    sendBillingInfoInputEmail: SendBillingInfoInputEmail,
    sendQuoteSMS: SendQuoteSMS,
    addQuoteNote: AddQuoteNote,
    updateQuoteNote: UpdateQuoteNote,
    deleteQuoteNote: DeleteQuoteNote,
    resolveBookOrderLink: ResolveBookOrderLink,
    resolveTermsAndConditionsLink: ResolveTermsAndConditionsLink,
    resolveBillingInformationLink: ResolveBillingInformationLink,
    acceptTermsAndConditions: AcceptTermsAndConditions,
    provideBillingInfo: ProvideBillingInfo,
    createOrder: CreateOrder,
    updateOrder: UpdateOrder,
    reassignOrders: ReassignOrders,
    postToLoadBoard: PostToLoadBoard,
    removeFromLoadBoard: RemoveFromLoadBoard,
    duplicateOrder: DuplicateOrder,
    convertToOrder: ConvertToOrder,
    convertToQuote: ConvertToQuote,
    createPricingException: CreatePricingException,
    updatePricingException: UpdatePricingException,
    updatePricingExceptions: UpdatePricingExceptions,
    updateVehicleSizechart: UpdateVehicleSizechart,
    deleteVehicleSizechart: DeleteVehicleSizechart,
    updateVehicleSize: UpdateVehicleSize,
    addCarrier: AddCarrier,
    updateCarrier: UpdateCarrier,
    addDriver: AddDriver,
    updateDriver: UpdateDriver,
    setBillingInfoToOrder: SetBillingInfoToOrder,
    chargeOrder: ChargeOrder,
    dispatchOrder: DispatchOrder,
    updateQuoteByCustomer: UpdateQuoteByCustomer,
    updateMileagePricings: UpdateMileagePricings,
    deleteMileagePricings: DeleteMileagePricings,
    updateEnclosedFees: UpdateEnclosedFees,
    deleteEnclosedFees: DeleteEnclosedFees,
    updateFees: UpdateFees,
    setPhoneNumber: SetPhoneNumber,
    markNotificationAsRead: MarkNotificationAsRead,
    markTodayNotificationsAsRead: MarkTodayNotificationsAsRead,
    markEarlierNotificationsAsRead: MarkEarlierNotificationsAsRead,
    updateShortCodes: UpdateShortCodes,
    deleteShortCodes: DeleteShortCodes
  }
};
