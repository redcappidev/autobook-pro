import Vue from 'vue';
import VueApollo from 'vue-apollo';
import ApolloClient from 'apollo-boost';

Vue.use(VueApollo);

const apolloClient = new ApolloClient({
  uri: `${window.BASE_URL}/graphql`
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

export default apolloProvider;
