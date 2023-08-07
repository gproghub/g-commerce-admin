import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

/* GET SIZE*/
export const GET = async (req: Request, { params }: { params: { sizeId: string } }) => {
  try {
    // Check params exist
    if (!params.sizeId) {
      return new NextResponse('Size id is required', { status: 400 });
    }

    // Get size
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SIZE_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* UPDATE SIZE*/
export const PATCH = async (req: Request, { params }: { params: { storeId: string; sizeId: string } }) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    if (!params.sizeId) {
      return new NextResponse('Size id is required', { status: 400 });
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

    // Check store where size is updated belongs to user
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeBelongsToUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Update size
    const updatedSize = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(updatedSize);
  } catch (error) {
    console.log('[SIZE_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* DELETE SIZE*/
export const DELETE = async (req: Request, { params }: { params: { storeId: string; sizeId: string } }) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    if (!params.sizeId) {
      return new NextResponse('Size id is required', { status: 400 });
    }

    // Check user exists
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    // Check store where size is updated belongs to user
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeBelongsToUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Delete size
    const deletedSize = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(deletedSize);
  } catch (error) {
    console.log('[SIZE_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
