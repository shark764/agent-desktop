function isPositiveInteger(x) {
  // http://stackoverflow.com/a/1019526/11236
  return /^\d+$/.test(x);
}

/**
 * Compare two software version numbers (e.g. 1.7.1)
 * Returns:
 *    0 if they're identical
 *    negative if version1 < version2
 *    positive if version1 > version2
 *    Nan if they in the wrong format
 *
 *  Taken from http://stackoverflow.com/a/6832721/11236
 */
function compareVersionNumbers(version1, version2) {
  const version1parts = version1.split('.');
  const version2parts = version2.split('.');

  function validateParts(parts) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < parts.length; i++) {
      if (!isPositiveInteger(parts[i])) {
        return false;
      }
    }
    return true;
  }
  if (!validateParts(version1parts) || !validateParts(version2parts)) {
    return NaN;
  }

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < version1parts.length; i++) {
    if (version2parts.length === i) {
      return 1;
    }

    if (version1parts[i] === version2parts[i]) {
      // eslint-disable-next-line no-continue
      continue;
    }
    if (version1parts[i] > version2parts[i]) {
      return 1;
    }
    return -1;
  }

  if (version1parts.length !== version2parts.length) {
    return -1;
  }

  return 0;
}

module.exports = compareVersionNumbers;
