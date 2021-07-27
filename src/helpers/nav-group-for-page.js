'use strict'

module.exports = (
  navGroups,
  {
    data: {
      root: { page, site },
    },
  }
) => {
  const pageUrl = page.url
  const navGroupByUrl = navGroups.find(({ url }) => url === pageUrl)
  if (navGroupByUrl) return navGroupByUrl
  const pageComponentName = page.component.name
  if (pageComponentName === 'home' && page.module !== 'contribute') return
  return navGroups.find(({ components }) => ~components.indexOf(pageComponentName))
}
