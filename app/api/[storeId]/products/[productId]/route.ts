import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

/* GET PRODUCT*/
export const GET = async (req: Request, { params }: { params: { productId: string } }) => {
  try {
    // Check params exist
    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    // Get product
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        color: true,
        category: true,
        size: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* UPDATE PRODUCT*/
export const PATCH = async (req: Request, { params }: { params: { storeId: string; productId: string } }) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
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
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeBelongsToUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Update product - delete the existing image and upload the other data
    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {}, // We must first delete the image to update it
        },
        isFeatured,
        isArchived,
      },
    });

    // Update product - upload the new image
    const updatedProduct = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* DELETE PRODUCT*/
export const DELETE = async (req: Request, { params }: { params: { storeId: string; productId: string } }) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    // Check user exists
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    // Check store where product is updated belongs to user
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeBelongsToUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Delete product
    const deletedProduct = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
