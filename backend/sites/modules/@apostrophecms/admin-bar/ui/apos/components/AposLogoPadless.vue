<!--
  White-label override of Apostrophe's own admin-bar icon (core component:
  @apostrophecms/schema/ui/apos/components/AposLogoPadless.vue). Apostrophe
  resolves admin UI Vue components by filename across all active modules'
  ui/apos/components folders, so a project-level file with the same name
  replaces the core one everywhere it's used — here, in the top-left corner
  of the admin bar on every tenant site.
-->
<template>
  <img
    class="apos-northstar-logo-padless"
    :src="logoUrl"
    alt="Northstar Fitness Collective"
  />
</template>

<script>
import logoUrl from '../images/northstar-icon.png';

export default {
  data() {
    return { logoUrl };
  }
};
</script>

<style scoped>
.apos-northstar-logo-padless {
  height: 100%;
  width: auto;
  display: block;
  object-fit: contain;
}
</style>
