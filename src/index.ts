import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './database';
import productRouter from './routes/product';
import authRouter from './routes/auth';
import { generateProductFeed, getProductXMLFeed } from './services/productFeedService';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/products', productRouter);
app.use('/auth', authRouter);
app.use('/uploads', express.static('uploads'));

app.get('/generate-feed', async (req, res) => {
  try {
    await generateProductFeed();
    res.status(200).send('Product feed generated successfully.');
  } catch (error) {
    console.error('Error generating product feed:', error);
    res.status(500).send('Error generating product feed.');
  }
});

app.get('/product-feed.xml', (req, res) => {
  const productsXML = getProductXMLFeed();
  if (productsXML) {
    res.header('Content-Type', 'application/xml');
    res.status(200).send(productsXML);
  } else {
    res.status(500).send('Product feed not available.');
  }
});

async function startServer() {
  try {
    await initializeDatabase();
    console.log('Data Source and database initialized!');
    
    await generateProductFeed();
    
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error during server startup:', err);
  }
}

startServer();