<template>
  <q-card flat bordered>
    <q-card-section class="q-pa-sm bg-primary">
      <div class="row justify-between">
        <div class="text-subtitle1 text-bold">
          <q-icon name="map" style="font-size: 25px; padding-right: 0.1rem;" />
          Google Maps
        </div>
        <q-btn
          dense
          outline
          label="Check Full Path"
          size="sm"
          class="float-right q-px-sm"
          style="top: 3px;"
          @click="handleCheckFullPath"
        />
      </div>
    </q-card-section>

    <q-separator />
    <q-card-section>
      <div class="row q-gutter-x-sm">
        <div class="col">
          <google-map-loader
            v-if="!loading && !loadingMapApi"
            style="width: 100%; height: 260px;"
            :mapConfig="{
              ...mapConfig,
              center: originCenter
            }"
            :apiKey="GMAP_API_KEY"
          >
            <template slot-scope="{ google, map }">
              <google-map-marker
                :marker="{
                  position: originCenter
                }"
                :google="google"
                :map="map"
              />
            </template>
          </google-map-loader>
          <q-skeleton v-else type="rect" height="260px" animation="fade" />
        </div>
        <div class="col">
          <google-map-loader
            v-if="!loading && !loadingMapApi"
            style="width: 100%; height: 260px;"
            :mapConfig="{
              ...mapConfig,
              center: destinationCenter
            }"
            :apiKey="GMAP_API_KEY"
          >
            <template slot-scope="{ google, map }">
              <google-map-marker
                :marker="{
                  position: destinationCenter
                }"
                :google="google"
                :map="map"
              />
            </template>
          </google-map-loader>
          <q-skeleton v-else type="rect" height="260px" animation="fade" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
import { Google } from '@client/third-party';
import GoogleMapsApiLoader from 'google-maps-api-loader';
import GoogleMapLoader from '../google-map/google-map-loader';
import GoogleMapMarker from '../google-map/google-map-marker';

export default {
  components: {
    GoogleMapLoader,
    GoogleMapMarker
  },
  data() {
    return {
      loadingMapApi: true,
      loading: true,
      GMAP_API_KEY: window.GOOGLE_MAP_API_KEY_FOR_CLIENT,
      mapConfig: {
        zoom: 5,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      },
      originCenter: { lat: 0, lng: 0 },
      destinationCenter: { lat: 0, lng: 0 },
      fullPath: null
    };
  },
  async created() {
    this.loadingMapApi = true;
    if (!window.googleMapsApi) {
      window.googleMapsApi = await GoogleMapsApiLoader({
        apiKey: this.GMAP_API_KEY
      });
    }
    this.loadingMapApi = false;
  },
  methods: {
    async refreshMap(origin, destination) {
      this.loading = true;
      this.originCenter = await Google.getLocationFromZipcode(origin.zipcode);
      this.destinationCenter = await Google.getLocationFromZipcode(
        destination.zipcode
      );
      this.fullPath = `https://maps.google.com/maps?q=from+${origin.city},+${origin.state}+${origin.zipcode}+to+${destination.city},+${destination.state}+${destination.zipcode}`;
      this.loading = false;
    },
    handleCheckFullPath() {
      window.open(this.fullPath);
    }
  }
};
</script>
<style lang="scss"></style>
