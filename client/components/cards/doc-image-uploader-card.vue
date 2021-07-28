<template>
  <q-uploader
    label="File Uploader"
    auto-upload
    :url="handleUpload"
    :multiple="false"
    color="white"
    text-color="dark"
    style="width: 100%; min-height: 250px;"
  />
</template>
<script>
import uploadMixin from '@client/mixins/upload';
import graphql from '@client/graphql';

export default {
  name: 'AppDocImageUploaderCard',
  mixins: [uploadMixin],
  props: ['data'],
  methods: {
    async handleUpload(files) {
      this.isUploading = true;
      const url = await this.upload(files[0], {
        onUploadProgress: (ev) => {
          const percentCompleted = Math.round((ev.loaded * 100) / ev.total);
          this.percentage = percentCompleted;
          if (percentCompleted === 100) {
            this.notifyPositive('Successfully the asset has been uploaded');
          }
        }
      });

      await this.$apollo.mutate({
        mutation: graphql.mutations.attachFileToQuote,
        variables: {
          id: this.data,
          asset: {
            fileUrl: url,
            fileName: files[0].name
          }
        }
      });
    }
  }
};
</script>
<style lang="scss">
.q-uploader .q-uploader__header {
  padding: 0 1.25rem;
}
</style>
