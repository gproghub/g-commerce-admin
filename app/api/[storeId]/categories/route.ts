import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

/* CREATE CATEGORY*/
export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
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

    // Check store where billboard is updated belongs to user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Create new category
    const newCategory = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    console.log('[CATEGORIES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* GET CATEGORY*/
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    // Get categories
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log('[CATEGORIES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
