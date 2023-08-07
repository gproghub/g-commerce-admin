import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export const POST = async (req: Request) => {
  try {
    // Check user exists
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    // Check body params exist
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    //Create store
    const newStore = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(newStore);
  } catch (error) {
    console.log('[STORES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
