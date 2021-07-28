import { ROLE_NAMES, USER_STATUSES } from '@server/constants';
import { User, Role, AccountPhoneNumber } from '@server/models';
import { userService } from '@server/services';

export default {
  TeamMember: {
    ext: async (user) => {
      const phoneNumber = await AccountPhoneNumber.query().findOne('userId', '=', user.id);
      if (phoneNumber) return phoneNumber.extension;
      return null;
    }
  },
  User: {
    role: (user) => Role.query().findById(user.roleId),
    permissions: (user) => user.permissions || ''
  },
  Query: {
    currentUser: (parent, args, { user }) => user,
    users: () => User.query().where('status', USER_STATUSES.ACTIVATED).withGraphFetched('role').orderBy('createdAt', 'DESC'),
    teamMembers: () => User.query().where('status', 'ACTIVATED'),
    roles: async () => {
      const roles = await Role.query();
      return roles.filter((r) => r.name !== ROLE_NAMES.SUPERADMIN);
    }
  },
  Mutation: {
    updateUserLeadSchedule: (_, { id, input }) => userService.updateUserLeadSchedule(id, input),
    updateUserAccess: (_, { id, roleId, permissions }) =>
      userService.updateUserAccess(id, roleId, permissions),
    updateUserProfile: (_, { id, input }) => userService.updateUserProfile(id, input),
    resolveInvitationLink: (_, { encryption }) => userService.resolveInvitationLink(encryption),
    inviteUser: (_, { email, roleId, permissions }, { user }) =>
      userService.inviteUser(user, email, roleId, permissions),
    activateUser: (_, { id }, { user }) =>
      userService.changeUserStatus(user, id, 'ACTIVATED'),
    deactivateUser: (_, { id }, { user }) =>
      userService.changeUserStatus(user, id, 'DEACTIVATED')
  }
};
