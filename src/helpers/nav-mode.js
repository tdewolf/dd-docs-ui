'use strict'

module.exports = ({
  data: {
    root: { contentCatalog = { getSiteStartPage () {} }, navMode },
  },
}) => {
  if (navMode) return navMode
  const siteStartPage = contentCatalog.getSiteStartPage()
  return siteStartPage &&
    (siteStartPage.asciidoc.attributes['export-site-navigation-data'] != null ||
      siteStartPage.asciidoc.attributes['site-navigation-data-path'])
    ? 'client'
    : 'template'
}
