const vendorOnly = (req, res, next) => {
  if (req.user.role !== 'vendor') {
    return res.status(403).json({ error: 'Vendor access only' });
  }
  next();
};

const customerOnly = (req, res, next) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ error: 'Customer access only' });
  }
  next();
};

module.exports = {
  vendorOnly,
  customerOnly
};
