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
    const bestPath = [{ newPos: -1, elements: [] }]
    const oldPos = this._getCommonPattern(bestPath[0], newString, oldString, 0)
    let editLength = 1

    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      return done([{value: newString.join(''), count: newString.length}])
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
          basePath = {
            newPos: removePath.newPos,
            elements: removePath.elements.slice(0)
          }
          this._pushElement(basePath.elements, undefined, true)
        } else {
          basePath = addPath
          basePath.newPos++
          this._pushElement(basePath.elements, true)
        }

        oldPos = this._getCommonPattern(basePath, newString, oldString, diagonalPath)

        if (basePath.newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
          return done(this._buildValues(basePath.elements, newString, oldString))
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

  _pushElement (elements, added, removed) {
    const last = elements[elements.length - 1]

    if (last && last.added === added && last.removed === removed) {
      elements[elements.length - 1] = { count: last.count + 1, added, removed }
      return
    }

    elements.push({ count: 1, added, removed })
  }

  _getCommonPattern (basePath, newString, oldString, diagonalPath) {
    let newLen = newString.length
    let oldLen = oldString.length
    let newPos = basePath.newPos
    let oldPos = newPos - diagonalPath

    let commonCount = 0

    while (
      (newPos + 1 < newLen && oldPos + 1 < oldLen) &&
      (newString[newPos + 1] === oldString[oldPos + 1])
    ) {
      newPos++
      oldPos++
      commonCount++
    }

    if (commonCount) { basePath.elements.push({ count: commonCount }) }

    basePath.newPos = newPos
    return oldPos
  }

  _buildValues (elements, newString, oldString) {
    let elementPos = 0
    let newPos = 0
    let oldPos = 0

    for (; elementPos < elements.length; elementPos++) {
      const element = elements[elementPos]

      if (!element.removed) {
        element.value = newString.slice(newPos, newPos + element.count).join('')
        newPos += element.count

        if (!element.added) { oldPos += element.count }
      } else {
        element.value = oldString.slice(oldPos, oldPos + element.count).join('')
        oldPos += element.count

        if (elementPos && elements[elementPos - 1].added) {
          const tmp = elements[elementPos - 1]
          elements[elementPos - 1] = elements[elementPos]
          elements[elementPos] = tmp
        }
      }
    }

    const lastElement = elements[elements.length - 1]
    if (elements.length > 1 && (lastElement.added || lastElement.removed) && !lastElement.value) {
      elements[elements.length - 2].value += lastElement.value
      elements.pop()
    }

    return elements
  }
}

module.exports = new Diff()
