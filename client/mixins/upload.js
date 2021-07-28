import axios from 'axios';
import graphql from '@client/graphql';

export default {
  methods: {
    async upload(file, { onUploadProgress }) {
      const response = await this.$apollo.mutate({
        mutation: graphql.mutations.createUploadForm,
        variables: {
          fileName: file.name
        }
      });

      const presignedPostData = response.data.createUploadForm;

      const formData = new FormData();
      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(key, presignedPostData.fields[key]);
      });

      formData.append('file', file);

      await axios.post(presignedPostData.url, formData, { onUploadProgress });

      return `${presignedPostData.url}/${presignedPostData.fields.key}`;
    }
  }
};
