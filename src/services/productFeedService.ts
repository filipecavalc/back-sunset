import fs from 'fs';
import { Product } from '../entity/Product';
import { AppDataSource, initializeDatabase } from '../database';

let productsXML: string = '';

export async function generateProductFeed(): Promise<void> {
  try {
    await initializeDatabase();
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find();
    
    productsXML = generateXMLFeed(products);
    
    fs.writeFileSync('product_feed.xml', productsXML);
    
    console.log('Product feed generated successfully.');
  } catch (error) {
    console.error('Error generating product feed:', error);
  }
}

export function getProductXMLFeed(): string {
  return productsXML;
}

function generateXMLFeed(products: Product[]): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n<channel>\n`;
  
  products.forEach(product => {
    xml += `<item>\n`;
    xml += `<title>${sanitize(product.name)}</title>\n`;
    xml += `<description>${sanitize(product.description)}</description>\n`;
    xml += `<g:price>${product.price.toFixed(2)} BRL</g:price>\n`;
    xml += `<g:availability>${product.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>\n`;
    
    product.images.forEach(image => {
      xml += `<g:image_link>${sanitize(image)}</g:image_link>\n`;
    });
    
    xml += `</item>\n`;
  });
  
  xml += `</channel>\n</rss>`;
  
  return xml;
}

function sanitize(text: string): string {
  return text.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}