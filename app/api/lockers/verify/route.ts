import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/lockers/verify - Verify OTP and unlock locker
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stationId, otp } = body;

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { error: 'Please enter a valid 6-digit access OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP matches any item in the database
    const item = await prisma.item.findFirst({
      where: { lockerOtp: otp },
    });

    // Also check locker station sample OTPs
    const station = stationId
      ? await prisma.lockerStation.findUnique({ where: { id: stationId } })
      : null;

    // Valid test codes for demo
    const validTestCodes = ['123456'];

    const isValid =
      item !== null ||
      (station && station.sampleOtp === otp) ||
      validTestCodes.includes(otp);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP for this locker bay. Please check your SMS/email dispatch.' },
        { status: 401 }
      );
    }

    // If we found an item, get the associated station
    const activeItem = item?.title || station?.activeItem || 'Verified Item Deposit';

    return NextResponse.json({
      success: true,
      activeItem,
      station: station?.name || 'Safe Handover Hub',
      message: 'Locker unlocked successfully',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
