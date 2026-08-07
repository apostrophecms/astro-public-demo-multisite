<!--
  White-label override of Apostrophe's own wordmark logo (core component:
  @apostrophecms/schema/ui/apos/components/AposLogo.vue), shown in the
  login page footer. See AposLogoPadless.vue in this same folder for how
  the override mechanism works.
-->
<template>
  <img
    class="apos-northstar-logo"
    :src="logoUrl"
    alt="Northstar Fitness Collective"
  />
</template>

<script>
import logoUrl from '../images/northstar-full.png';

export default {
  data() {
    return { logoUrl };
  }
};
</script>

<style scoped>
.apos-northstar-logo {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>
