'use strict'

module.exports = (navGroups, { data: { root: { page, site } } }) => {
  const pageUrl = page.url
  const navGroupByUrl = navGroups.find(({ url }) => url === pageUrl)
  if (navGroupByUrl) return navGroupByUrl
  const pageComponentName = page.component.name
  return navGroups.find(({ components }) => ~components.indexOf(pageComponentName))
}
