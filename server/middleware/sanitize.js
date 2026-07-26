const sanitizeValue = (value) => {
  if (value === null || value === undefined) return value;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value;

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (typeof value === 'object') {
    const cleanObj = {};
    for (const key of Object.keys(value)) {
      if (key.startsWith('$') || key.includes('.')) {
        continue; // Strip MongoDB operator keys
      }
      const sanitized = sanitizeValue(value[key]);
      if (sanitized !== undefined) {
        cleanObj[key] = sanitized;
      }
    }
    return Object.keys(cleanObj).length > 0 ? cleanObj : undefined;
  }

  return value;
};

const sanitizeQuery = (req, res, next) => {
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = { sanitizeQuery };
