import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

/* CREATE PRODUCT*/
export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    // Check user exists
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    // Check body params exist
    const body = await req.json();
    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;
    if (!name) {
      return new NextResponse('Name is required', {
        status: 400,
      });
    }
    if (!price) {
      return new NextResponse('Price is required', {
        status: 400,
      });
    }
    if (!categoryId) {
      return new NextResponse('Category id is required', {
        status: 400,
      });
    }
    if (!colorId) {
      return new NextResponse('Color id is required', {
        status: 400,
      });
    }
    if (!sizeId) {
      return new NextResponse('Size id is required', {
        status: 400,
      });
    }
    if (!images || !images.length) {
      return new NextResponse('Images are required', {
        status: 400,
      });
    }

    // Check store where product is updated belongs to user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Create new product
    const newProduct = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        isFeatured,
        isArchived,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* GET PRODUCT*/
export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    // Get the filters from the URL's searchParams
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const colorId = searchParams.get('colorId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    // Get products
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
