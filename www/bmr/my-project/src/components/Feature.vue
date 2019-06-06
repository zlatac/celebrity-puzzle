<script>
/**
 * Feature flag component.
 */
export default {
  data: function() {
    return {
      environment: '',
      featureData: {
        action: {},
        show: false,
        template: {}
      },
      list: {},
    }
  },
  props: {
    featureName: {
      required: true,
      default: '',
      type: String
    }
  },
  methods: {
    getFeatureData() {
      if (this.envStatus !== undefined) {
        this.featureData = this.list[this.environment][this.featureName];

        return;
      }
      if (this.globalStatus !== undefined) {
        this.featureData = this.list.global[this.featureName];

        return;
      }
    },
    getFeatureList: async function() {
      const domain = window.location.origin;
      const timestamp = new Date().toISOString();
      try {
        const response = await fetch(`${domain}/feature.json?t=${timestamp}`);
        this.list = await response.json();
        console.log(this.list.global.wow)
      } catch (e) {
        console.warn(new Error(e))
      }
    }

  },
  created: async function() {
    console.log('heeeeey')
    await this.getFeatureList();
    this.environment = (process.env.NODE_ENV !== undefined)
      ? process.env.NODE_ENV
      : '';
    this.getFeatureData();
    this.$emit('feature-flag', this.featureData);
  },
  computed: {
    devMode() {
      return this.environment === 'development';
    },
    envStatus() {
      const env = this.environment;
      const featureName = this.featureName;
      if (env !== '' && env in this.list && featureName in this.list[env]) {
        return this.list[env][featureName].show;
      }

      return undefined;
    },
    globalStatus() {
      if ('global' in this.list && this.featureName in this.list.global) {
        return this.list.global[this.featureName].show;
      }

      return undefined;
    },

    status() {
      if (typeof this.envStatus === 'boolean') {
        return this.envStatus;
      }
      if (this.devMode) {
        return this.devMode;
      }
      if (typeof this.globalStatus === 'boolean') {
        return this.globalStatus;
      }

      return this.devMode;
    }
  }
}
</script>

<template>
<div class="feature-flag">
  <slot v-if="status" :feature-slot="featureData"></slot>
</div>
</template>

<style>

</style>
