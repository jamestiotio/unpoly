/*-
@module up.history
*/

up.migrate.renamedProperty(up.history.config, 'popTargets', 'restoreTargets')

/*-
Returns a normalized URL for the current history entry.

@function up.history.url
@return {string}
@deprecated Use the `up.history.location` property instead.
*/
up.history.url = function() {
  up.migrate.deprecated('up.history.url()', 'up.history.location')
  return up.history.location
}

up.migrate.renamedEvent('up:history:push', 'up:location:changed')
up.migrate.renamedEvent('up:history:pushed', 'up:location:changed')
up.migrate.renamedEvent('up:history:restore', 'up:location:changed')
up.migrate.renamedEvent('up:history:restored', 'up:location:changed')
// There was never an up:history:replace (present tense) event
up.migrate.renamedEvent('up:history:replaced', 'up:location:changed')

up.migrate.removedEvent('up:fragment:kept', 'up:fragment:keep')

let updateMetaElements = up.history.config.updateMetaElements
let updateMetaElementsSet = false
Object.defineProperty(up.history.config, 'updateMetaElements', {
  get() {
    return updateMetaElements
  },
  set(value) {
    updateMetaElements = value
    updateMetaElementsSet = true
  }
})

up.on('up:framework:boot', function() {
  if (!updateMetaElementsSet) {
    up.migrate.warn('Meta elements in the <head> are now updated automatically. Configure up.history.config.updateMetaElements to remove this warning.')
  }
})

// up.compiler('[up-hungry]')

up.migrate.warnOfHungryMetaElements = function(metas) {
  let fullHungrySelector = up.radio.config.hungrySelectors.join()
  let hungryMetas = up.util.filter(metas, (meta) => meta.matches(fullHungrySelector))
  if (hungryMetas.length) {
    up.migrate.warn('Meta elements in the <head> are now updated automatically. Remove the [up-hungry] attribute from %o.', hungryMetas)
  }
}
