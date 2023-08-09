import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

/* GET CATEGORY*/
export const GET = async (req: Request, { params }: { params: { categoryId: string } }) => {
  try {
    // Check params exist
    if (!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    // Get category
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* UPDATE CATEGORY*/
export const PATCH = async (req: Request, { params }: { params: { storeId: string; categoryId: string } }) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    // Check user exists
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    // Check body params exist
    const body = await req.json();
    const { name, billboardId } = body;
    if (!name) {
      return new NextResponse('Name is required', {
        status: 400,
      });
    }
    if (!billboardId) {
      return new NextResponse('Billboard id is required', {
        status: 400,
      });
    }

    // Check store where category is updated belongs to user
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeBelongsToUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Update category
    const updatedCategory = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.log('[CATEGORY_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* DELETE CATEGORY*/
export const DELETE = async (req: Request, { params }: { params: { storeId: string; categoryId: string } }) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    if (!params.categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    // Check user exists
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    // Check store where category is updated belongs to user
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeBelongsToUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Delete category
    const deletedCategory = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.log('[CATEGORY_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
