<template>
  <div class="autobookpro-page-content">
    <div style="max-width: 600px;" class="q-mt-md q-mx-auto">
      <app-ring-central-integration-card />
    </div>
  </div>
</template>

<script>
import AppRingCentralIntegrationCard from '@client/components/cards/ring-central-integration-card';

export default {
  name: 'AppIntegrations',
  metaInfo: {
    title: 'AutoBook Pro - Integrations'
  },
  components: {
    AppRingCentralIntegrationCard
  }
};
</script>

<style></style>
