import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

/* CREATE SIZE*/
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
    const { name, value } = body;
    if (!name) {
      return new NextResponse('Name is required', {
        status: 400,
      });
    }
    if (!value) {
      return new NextResponse('Value is required', {
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

    // Create new size
    const newSize = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(newSize);
  } catch (error) {
    console.log('[SIZES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* GET SIZE*/
export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    // Get sizes
    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log('[SIZES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
