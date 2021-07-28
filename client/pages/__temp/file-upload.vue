<template>
  <div>
    File upload
    <div>
      <input type="file" @change="handleChange" />
    </div>
  </div>
</template>

<script>
import uploadMixin from '@client/mixins/upload';
import graphql from '@client/graphql';

export default {
  name: 'FileUpload',
  mixins: [uploadMixin],
  methods: {
    async handleChange(e) {
      const file = e.target.files[0];

      const url = await this.upload(file, {
        onUploadProgress: (ev) => {
          const percentCompleted = Math.round((ev.loaded * 100) / ev.total);
          console.log(percentCompleted);
        }
      });

      await this.$apollo.mutate({
        mutation: graphql.mutations.attachFileToQuote,
        variables: {
          id: '992',
          asset: {
            fileUrl: url,
            fileName: file.name
          }
        }
      });
    }
  }
};
</script>

<style></style>
