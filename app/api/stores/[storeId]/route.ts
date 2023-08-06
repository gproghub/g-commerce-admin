import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log('[STORE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
