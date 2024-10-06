import express from 'express';
import { connectDB, getDB } from './db/index.js';
import { ObjectId } from 'mongodb';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((error) => {
  console.error("Failed to start the server:", error);
});

app.post('/products', async (req, res) => {
  try {
    const db = getDB();
    const { name, price, description } = req.body;
    const result = await db.collection('products').insertOne({ name, price, description });
    const insertedProduct = { _id: result.insertedId, name, price, description };
    res.status(201).json(insertedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.get('/products', async (req, res) => {
  try {
    const db = getDB();
    const products = await db.collection('products').find().toArray();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const db = getDB();
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const db = getDB();
    const { name, price, description } = req.body;
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, price, description } }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json({ message: "Product updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.status(200).json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});