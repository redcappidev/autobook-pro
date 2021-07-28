import uniqid from 'uniqid';
import { User, Invitation, Role } from '@server/models';
import * as emailService from '@server/services/email-service';
import { ALL_PERMISSIONS, INVITATION_RESPONSE } from '@server/constants';
import { assessPermission } from '@server/lib/permission-helpers';

export const updateUserLeadSchedule = (id, input) => User.query()
  .findById(id)
  .patch({
    leadSchedule: input
  })
  .returning('*');

export const updateUserAccess = (id, roleId, permissions) => {
  const refinedPermissions =
    permissions.split(',')
      .filter((permission) => ALL_PERMISSIONS.includes(permission))
      .join(',');
  return User.query()
    .upsertGraphAndFetch({
      id: parseInt(id, 10),
      permissions: refinedPermissions,
      role: {
        id: parseInt(roleId, 10)
      }
    }, { relate: true, unrelate: true });
};

export const updateUserProfile = (id, profile) => User.query()
  .findById(id)
  .patch(profile)
  .returning('*');

export const resolveInvitationLink = (encryption) =>
  Invitation.query().findOne('encryption', encryption);

export const inviteUser = async (user, email, roleId, permissions) => {
  const invitee = await User.query().findOne('email', email);
  if (invitee) {
    return INVITATION_RESPONSE.userAlreadyExists;
  }

  const role = await Role.query().findById(roleId);
  const encryption = uniqid();

  const invitation = await Invitation.query().findOne('email', email);

  if (invitation) {
    await invitation.$query().patch({
      roleName: role.name,
      encryption,
      permissions
    });
  } else {
    await Invitation.query().insert({
      encryption,
      email,
      roleName: role.name,
      permissions
    });
  }

  await emailService.sendInvitationEmail(user, email, role.name, encryption);
  return INVITATION_RESPONSE.invitationSent;
};

export const changeUserStatus = async (actionUser, targetUserId, status) => {
  const targetUser = await User.query().findById(targetUserId).withGraphFetched('role');

  if (assessPermission.isSuperAdmin(targetUser)) {
    throw new Error('Changing the status of a super admin is prohibited');
  }

  if (actionUser.id === targetUserId) {
    throw new Error('Changing the status of myself is prohibited');
  }

  return targetUser.$query().patch({ status }).returning('*');
};
