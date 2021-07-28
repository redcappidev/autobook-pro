<template>
  <div class="autobookpro-page-content">
    <div class="q-mt-md row justify-end">
      <q-btn
        outline
        color="primary"
        label="Save"
        :loading="saving"
        @click="handleSaveSchedule"
      />
    </div>
    <div class="row q-gutter-x-sm q-mt-md">
      <div class="col-1">Name</div>
      <div class="col-1">Sunday</div>
      <div class="col-1">Monday</div>
      <div class="col-1">Tuesday</div>
      <div class="col-1">Wednesday</div>
      <div class="col-1">Thursday</div>
      <div class="col-1">Friday</div>
      <div class="col-1">Saturday</div>
      <div class="col-1">24 Hour</div>
      <div class="col-1">Pause</div>
      <div class="col-1">Ratio/Max</div>
    </div>
    <div
      v-for="(leadSchedule, index) in leadScheduleByUsers"
      v-bind:key="index"
    >
      <div class="row q-mt-sm q-gutter-x-sm">
        <div class="col-1">{{ leadSchedule.userName }}</div>
        <div class="col-1">
          <q-input v-model="leadSchedule.sundayStart" dense type="time" />
          <q-input v-model="leadSchedule.sundayEnd" dense type="time" />
        </div>
        <div class="col-1">
          <q-input v-model="leadSchedule.mondayStart" dense type="time" />
          <q-input v-model="leadSchedule.mondayEnd" dense type="time" />
        </div>
        <div class="col-1">
          <q-input v-model="leadSchedule.tuesdayStart" dense type="time" />
          <q-input v-model="leadSchedule.tuesdayEnd" dense type="time" />
        </div>
        <div class="col-1">
          <q-input v-model="leadSchedule.wednesdayStart" dense type="time" />
          <q-input v-model="leadSchedule.wednesdayEnd" dense type="time" />
        </div>
        <div class="col-1">
          <q-input v-model="leadSchedule.thursdayStart" dense type="time" />
          <q-input v-model="leadSchedule.thursdayEnd" dense type="time" />
        </div>
        <div class="col-1">
          <q-input v-model="leadSchedule.fridayStart" dense type="time" />
          <q-input v-model="leadSchedule.fridayEnd" dense type="time" />
        </div>
        <div class="col-1">
          <q-input v-model="leadSchedule.saturdayStart" dense type="time" />
          <q-input v-model="leadSchedule.saturdayEnd" dense type="time" />
        </div>
        <div class="col-1">
          <q-checkbox v-model="leadSchedule.wholeDay" />
        </div>
        <div class="col-1">
          <q-checkbox v-model="leadSchedule.pause" />
        </div>
        <div class="col-1">
          <q-input v-model.number="leadSchedule.ratio" dense type="number" />
          <q-input v-model.number="leadSchedule.maxCap" dense type="number" />
        </div>
      </div>
      <q-separator class="q-my-sm" />
    </div>
  </div>
</template>

<script>
import graphql from '@client/graphql';
import runPromiseSerial from '@server/lib/promise-serial';
import { sanitizeObject } from '@client/utils/object-helpers';

export default {
  metaInfo: {
    title: 'AutoBook Pro - Lead Schedule'
  },
  apollo: {
    users: {
      query: graphql.queries.loadUsers,
      result(result) {
        if (result.loading) return;

        this.leadScheduleByUsers = result.data.users.map((user) => {
          const leadSchedule = {
            wholeDay: false,
            pause: false,
            ratio: 1,
            maxCap: 10,
            ...sanitizeObject(user.leadSchedule || {})
          };

          return {
            ...leadSchedule,
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`
          };
        });
      }
    }
  },
  data() {
    return {
      saving: false,
      leadScheduleByUsers: []
    };
  },
  methods: {
    async handleSaveSchedule() {
      this.saving = true;

      const promiseSerial = this.leadScheduleByUsers.map(
        (leadSchedule) => async () => {
          const { userId, userName, ...leadScheduleInput } = leadSchedule;

          await this.$apollo.mutate({
            mutation: graphql.mutations.updateUserLeadSchedule,
            variables: {
              id: userId,
              input: sanitizeObject(leadScheduleInput)
            }
          });
        }
      );

      await runPromiseSerial(promiseSerial);

      this.saving = false;
    }
  }
};
</script>

<style></style>
