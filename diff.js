class Diff {
  getDiff (oldString, newString, callback) {
    function done (value) {
      if (callback) {
        callback(null, value)
        return true
      }

      return value
    }

    oldString = oldString.split('').filter(s => s !== '')
    newString = newString.split('').filter(s => s !== '')

    const newLen = newString.length
    const oldLen = oldString.length
    const bestPath = [{ newPos: -1, components: [] }]
    const oldPos = this._getCommon(bestPath[0], newString, oldString, 0)
    let editLength = 1

    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      return done(null, [{value: newString.join(''), count: newString.length}])
    }

    const execEditLength = () => {
      for (let diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        const addPath = bestPath[diagonalPath - 1]
        const removePath = bestPath[diagonalPath + 1]

        let oldPos = (removePath ? removePath.newPos : 0) - diagonalPath
        let basePath

        if (addPath) { bestPath[diagonalPath - 1] = undefined }

        let canAdd = addPath && addPath.newPos + 1 < newLen
        let canRemove = removePath && oldPos >= 0 && oldPos < oldLen

        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = undefined
          continue
        }

        if (!canAdd || (canRemove && addPath.newPos < removePath.newPos)) {
          basePath = { newPos: removePath.newPos, components: removePath.components.slice(0) }
          this._pushComponent(basePath.components, undefined, true)
        } else {
          basePath = addPath
          basePath.newPos++
          this._pushComponent(basePath.components, true, undefined)
        }

        oldPos = this._getCommon(basePath, newString, oldString, diagonalPath)

        if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
          return done(this._buildValues(basePath.components, newString, oldString))
        }

        bestPath[diagonalPath] = basePath
      }

      editLength++
    }

    if (callback) {
      (function exec () {
        if (!execEditLength()) { exec() }
      }())
    }
  }

  _pushComponent (components, added, removed) {
    const last = components[components.length - 1]
    if (last && last.added === added && last.removed === removed) {
      components[components.length - 1] = { count: last.count + 1, added: added, removed: removed }
      return
    }

    components.push({ count: 1, added: added, removed: removed })
  }

  _getCommon (basePath, newString, oldString, diagonalPath) {
    let newLen = newString.length
    let oldLen = oldString.length
    let newPos = basePath.newPos
    let oldPos = newPos - diagonalPath

    let commonCount = 0

    while ((newPos + 1 < newLen && oldPos + 1 < oldLen) && (newString[newPos + 1] === oldString[oldPos + 1])) {
      newPos++
      oldPos++
      commonCount++
    }

    if (commonCount) { basePath.components.push({ count: commonCount }) }

    basePath.newPos = newPos
    return oldPos
  }

  _buildValues (components, newString, oldString) {
    let componentPos = 0
    let newPos = 0
    let oldPos = 0

    for (; componentPos < components.length; componentPos++) {
      const component = components[componentPos]

      if (!component.removed) {
        component.value = newString.slice(newPos, newPos + component.count).join('')
        newPos += component.count

        if (!component.added) { oldPos += component.count }
      } else {
        component.value = oldString.slice(oldPos, oldPos + component.count).join('')
        oldPos += component.count

        if (componentPos && components[componentPos - 1].added) {
          const tmp = components[componentPos - 1]
          components[componentPos - 1] = components[componentPos]
          components[componentPos] = tmp
        }
      }
    }

    const lastComponent = components[components.length - 1]
    if (components.length > 1 && (lastComponent.added || lastComponent.removed) && !lastComponent.value) {
      components[components.length - 2].value += lastComponent.value
      components.pop()
    }

    return components
  }
}

module.exports = new Diff()
