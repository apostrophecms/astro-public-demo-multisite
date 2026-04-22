// Ensure the global doc is walked alongside pages/pieces when annotating
// data for the Astro front end, so areas on the global schema (e.g. the
// shared footer) get `.field`, `.options`, and widget annotations and can
// be rendered by AposArea without blowing up.
export default {
  extendMethods(self) {
    return {
      getDocsForExternalFront(_super, req, template, data, moduleName) {
        const docs = _super(req, template, data, moduleName);
        if (data.global && !docs.includes(data.global)) {
          docs.push(data.global);
        }
        return docs;
      }
    };
  }
};
