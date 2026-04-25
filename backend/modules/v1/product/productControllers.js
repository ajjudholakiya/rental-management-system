const { Product, RentalPrice } = require('../../../database/models');

const {
  createProductSchema,
  updateProductSchema,
  pricingSchema
} = require('../../../validations/productValidation');

// Create
const create = async (req, res) => {
  try {
    const { error, value } = createProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const product = await Product.create({
      ...value,
      ownerVendorId: req.user.id
    });

    return res.status(201).json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// List
const list = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { status: 'available' },
      include: ['pricing']
    });

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get By Id
const getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: ['pricing']
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Update
const update = async (req, res) => {
  try {
    const { error, value } = updateProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.ownerVendorId != req.user.id) {
      return res.status(403).json({
        error: `Unauthorized access: This product is owned by Vendor ID ${product.ownerVendorId}, but your Vendor ID is ${req.user.id}.`
      });
    }

    await product.update(value);

    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Delete
const remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.ownerVendorId != req.user.id) {
      return res.status(403).json({
        error: `Unauthorized access: This product is owned by Vendor ID ${product.ownerVendorId}, but your Vendor ID is ${req.user.id}.`
      });
    }

    await product.destroy();

    return res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Pricing
const pricing = async (req, res) => {
  try {
    const { error, value } = pricingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.ownerVendorId != req.user.id) {
      return res.status(403).json({
        error: `Unauthorized access: This product is owned by Vendor ID ${product.ownerVendorId}, but your Vendor ID is ${req.user.id}.`
      });
    }

    let price = await RentalPrice.findOne({
      where: { productId: req.params.id }
    });
    if (price) {
      await price.update(value);
    } else {
      price = await RentalPrice.create({
        ...value,
        productId: req.params.id
      });
    }

    return res.json(price);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get Vendor Products
const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { ownerVendorId: req.user.id },
      include: ['pricing']
    });
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  pricing,
  getVendorProducts
};
