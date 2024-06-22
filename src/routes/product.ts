import { Router, Request, Response } from 'express';
import { AppDataSource } from '../database';
import { Product } from '../entity/Product';
import multer from 'multer';
import { authenticateJWT, isAdmin } from '../middleware/auth';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', [authenticateJWT, isAdmin], upload.array('images', 10), async (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;

  let images: string[] = [];
  if (Array.isArray(req.files)) {
    images = req.files.map((file: Express.Multer.File) => file.path);
  }

  const product = new Product();
  product.name = name;
  product.description = description;
  product.price = parseFloat(price);
  product.stock = parseInt(stock);
  product.images = images;

  await AppDataSource.manager.save(product);
  res.status(201).send(product);
});

router.get('/', async (req: Request, res: Response) => {
  const { name, minPrice, maxPrice, page = 1, pageSize = 10, order = 'asc' } = req.query;

  const query = AppDataSource.getRepository(Product).createQueryBuilder('product');

  if (name) {
    query.andWhere('product.name LIKE :name', { name: `%${name}%` });
  }
  if (minPrice) {
    query.andWhere('product.price >= :minPrice', { minPrice: parseFloat(minPrice as string) });
  }
  if (maxPrice) {
    query.andWhere('product.price <= :maxPrice', { maxPrice: parseFloat(maxPrice as string) });
  }

  query.orderBy('product.price', order === 'asc' ? 'ASC' : 'DESC');

  query.skip((parseInt(page as string) - 1) * parseInt(pageSize as string));
  query.take(parseInt(pageSize as string));

  const [products, total] = await query.getManyAndCount();

  res.send({
    data: products,
    total,
    page: parseInt(page as string),
    pageSize: parseInt(pageSize as string),
    totalPages: Math.ceil(total / parseInt(pageSize as string)),
  });

});

router.get('/random', async (req: Request, res: Response) => {
  try {
    const products = await AppDataSource.getRepository(Product).query(
      `SELECT * FROM product ORDER BY RANDOM() LIMIT 10`
    );

    const processedProducts = products.map((product: any) => {
      return {
        ...product,
        images: product.images.split(',')
      };
    });

    res.send(processedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const product = await AppDataSource.manager.findOneBy(Product, {
    id: parseInt(req.params.id),
  });
  res.send(product);
});

const removePrefix = (urls: string[] | string, prefix: string): string[] => {
  if (urls === undefined) {
    return [];
  }
  if (!Array.isArray(urls)) {
    console.error('Expected an array but received:', urls);
    return urls.startsWith(prefix) ? [urls.slice(prefix.length)] : [urls];
  }
  return urls.map(url => url.startsWith(prefix) ? url.slice(prefix.length) : url);
};

router.put('/:id', [authenticateJWT, isAdmin], upload.array('images', 10), async (req: Request, res: Response) => {
  const { name, description, price, stock, oldImages } = req.body;

  let images: string[] = [];
  if (Array.isArray(req.files)) {
    images = req.files.map((file: Express.Multer.File) => file.path);
  }

  const product = await AppDataSource.manager.findOneBy(Product, {
    id: parseInt(req.params.id),
  });

  if (product) {
    product.name = name;
    product.description = description;
    product.price = parseFloat(price);
    product.stock = parseInt(stock);

    const oldImagesArray = removePrefix(oldImages, 'http://localhost:3000/');
    product.images = [...oldImagesArray, ...images];

    await AppDataSource.manager.save(product);
    res.send(product);
  } else {
    res.status(404).send('Product not found');
  }
});

router.delete('/:id', [authenticateJWT, isAdmin], async (req: Request, res: Response) => {
  const result = await AppDataSource.manager.delete(Product, {
    id: parseInt(req.params.id),
  });
  if (result.affected) {
    res.sendStatus(204);
  } else {
    res.status(404).send('Product not found');
  }
});

export default router;
