<template>
  <q-dialog
    v-model="open"
    persistent
    transition-show="fade"
    transition-hide="fade"
    position="top"
  >
    <q-card style="width: 500px; top: 7rem;">
      <q-toolbar>
        <q-toolbar-title class="text-h6">
          Internal Note
        </q-toolbar-title>
        <q-btn flat round dense icon="close" @click="(e) => closeDialog()" />
      </q-toolbar>

      <q-card-section class="q-py-none">
        <q-input
          v-model="note"
          outlined
          placeholder="Internal note here...."
          type="textarea"
        />

        <div class="assign-users q-py-md">
          <div class="text-subtitle2">
            Assign To
          </div>
          <q-separator class="q-my-sm" />
          <div class="row wrap">
            <div v-for="user in users" :key="user.id" class="col-4">
              <q-checkbox
                v-model="checked[user.id]"
                @input="(e) => handleChange({ ...e, user })"
                :label="`${user.firstName} ${user.lastName}`"
              />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancel"
          color="primary"
          @click="(e) => closeDialog()"
        />
        <q-btn flat label="Save" color="primary" @click="handleSave" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import graphql from '@client/graphql';

export default {
  name: 'AppAddEditNoteDialog',
  props: ['data', 'open', 'closeDialog'],
  apollo: {
    currentUser: {
      query: graphql.queries.currentUser
    },
    users: {
      query: graphql.queries.loadUsers
    }
  },
  data() {
    return {
      isEdit: false,
      note: null,
      checked: [],
      assignedUsers: []
    };
  },
  watch: {
    data: function (newVal) {
      this.isEdit = newVal.edit;
      if (newVal.edit) {
        this.note = newVal.internalNote.note;
      } else {
        this.isEdit = false;
        this.note = null;
        this.checked = [];
        this.assignedUsers = [];
      }
    }
  },
  methods: {
    handleChange(props) {
      const { user } = props;
      if (this.checked[user.id]) {
        this.checked[user.id] = true;
        this.assignedUsers.push(user.id);
      } else {
        this.checked[user.id] = false;
        this.assignedUsers = this.assignedUsers.filter((el) => el !== user.id);
      }
    },
    async handleSave() {
      const quoteId = this.$route.params.id;
      try {
        if (this.isEdit) {
          await this.$apollo.mutate({
            mutation: graphql.mutations.updateQuoteNote,
            variables: {
              id: this.data.internalNote.id,
              input: {
                note: this.note,
                assignees: this.assignedUsers
              }
            },
            update: (store, { data: { updateQuoteNote } }) => {
              const data = store.readQuery({
                query: graphql.queries.getQuote,
                variables: {
                  id: quoteId
                }
              });
              const tmp = [...data.quote.internalNotes];
              const idx = tmp.findIndex(
                (el) => el.id === this.data.internalNote.id
              );
              tmp[idx] = updateQuoteNote;
              data.quote.internalNotes = tmp;
              store.writeQuery({
                query: graphql.queries.getQuote,
                variables: {
                  id: quoteId
                },
                data
              });
              this.closeDialog();
              this.notifyPositive(
                'Successfully the Quote Note has been updated!'
              );
            }
          });
        } else {
          await this.$apollo.mutate({
            mutation: graphql.mutations.addQuoteNote,
            variables: {
              input: {
                quoteId: this.data.quote.id,
                note: this.note,
                assignees: this.assignedUsers
              }
            },
            update: (store, { data: { addQuoteNote } }) => {
              const data = store.readQuery({
                query: graphql.queries.getQuote,
                variables: {
                  id: quoteId
                }
              });
              data.quote.internalNotes = [
                addQuoteNote,
                ...data.quote.internalNotes
              ];

              store.writeQuery({
                query: graphql.queries.getQuote,
                variables: {
                  id: quoteId
                },
                data
              });
              this.closeDialog();
              this.notifyPositive(
                'Successfully the Quote Note has been created!'
              );
            }
          });
        }
      } catch (error) {
        this.notifyNegative(error.message);
      }
    }
  }
};
</script>
<style lang="scss"></style>
