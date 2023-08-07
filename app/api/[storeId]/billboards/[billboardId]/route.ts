import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

/* GET BILLBOARD*/
export const GET = async (
  req: Request,
  { params }: { params: { billboardId: string } }
) => {
  try {
    // Check params exist
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    // Get billboard
    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[BILLBOARD_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* UPDATE BILLBOARD*/
export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    // Check user exists
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    // Check body params exist
    const body = await req.json();
    const { label, imageUrl } = body;
    if (!label) {
      return new NextResponse('Label is required', {
        status: 400,
      });
    }
    if (!imageUrl) {
      return new NextResponse('Image URL is required', {
        status: 400,
      });
    }

    // Check store where billboard is updated belongs to user
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeBelongsToUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Update billboard
    const updatedBillboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(updatedBillboard);
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* DELETE BILLBOARD*/
export const DELETE = async (
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse('Billboard id is required', { status: 400 });
    }

    // Check user exists
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    // Check store where billboard is updated belongs to user
    const storeBelongsToUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeBelongsToUser) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Delete billboard
    const deletedBillboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(deletedBillboard);
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
