import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

/* CREATE STORE*/
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
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 });
    }

    // Create new billboard
    const newBillboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(newBillboard);
  } catch (error) {
    console.log('[BILLBOARDS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};

/* GET STORE*/
export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    // Check params exist
    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    // Get billboards
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[BILLBOARDS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
