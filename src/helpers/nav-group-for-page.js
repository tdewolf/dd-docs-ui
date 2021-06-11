'use strict'

module.exports = (navGroups, { data: { root: { page, site } } }) => {
  const pageComponentName = page.component.name
  if (pageComponentName === 'home') return navGroups.find(({ url }) => url === page.url)
  return navGroups.find(({ components }) => ~components.indexOf(pageComponentName))
}
