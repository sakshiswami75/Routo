import { execSync } from 'child_process';

const BASE_URL = 'http://localhost:3000/api';

let senderToken = '';
let carrierToken = '';
let parcelId = '';
let routeId = '';
let deliveryId = '';

const testRunner = async () => {
  let passed = 0;
  let failed = 0;

  const runTest = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (e: any) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   ${e.message || e}`);
      failed++;
    }
  };

  const fetchApi = async (method: string, endpoint: string, body?: any, token?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  };

  console.log('--- STARTING INTEGRATION TESTS ---');

  await runTest('User A (Sender) Registration', async () => {
    const res = await fetchApi('POST', '/auth/register', {
      name: 'Sender User',
      email: `sender${Date.now()}@example.com`,
      password: 'password123'
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}: ${JSON.stringify(res.data)}`);
  });

  let senderEmail = `sender${Date.now()}@test.com`;
  let carrierEmail = `carrier${Date.now()}@test.com`;

  await runTest('User A (Sender) Login', async () => {
    await fetchApi('POST', '/auth/register', { name: 'Sender', email: senderEmail, password: 'password123' });
    const loginRes = await fetchApi('POST', '/auth/login', { email: senderEmail, password: 'password123' });
    if (loginRes.status !== 200) throw new Error('Login failed');
    senderToken = loginRes.data.data.token;
  });

  await runTest('User B (Carrier) Registration and Login', async () => {
    await fetchApi('POST', '/auth/register', { name: 'Carrier', email: carrierEmail, password: 'password123' });
    const loginRes = await fetchApi('POST', '/auth/login', { email: carrierEmail, password: 'password123' });
    if (loginRes.status !== 200) throw new Error('Carrier login failed');
    carrierToken = loginRes.data.data.token;
  });

  await runTest('Create Parcel (User A)', async () => {
    const res = await fetchApi('POST', '/parcels', {
      title: 'Box of books',
      pickupLocation: 'City A',
      dropLocation: 'City B',
      weight: 5.5,
      rewardAmount: 20
    }, senderToken);
    if (res.status !== 201) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
    parcelId = res.data.data.id;
  });

  await runTest('Create Route (User B)', async () => {
    const res = await fetchApi('POST', '/routes', {
      fromCity: 'City A',
      toCity: 'City B',
      vehicleType: 'Car',
      availableCapacity: 10,
      travelDate: new Date(Date.now() + 86400000).toISOString()
    }, carrierToken);
    if (res.status !== 201) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
    routeId = res.data.data.id;
  });

  await runTest('Self Parcel Acceptance should FAIL', async () => {
    const res = await fetchApi('POST', '/deliveries/accept', { parcelId }, senderToken);
    if (res.status !== 400) throw new Error(`Expected 400 for self-acceptance, got ${res.status}`);
  });

  await runTest('Accept Parcel (User B)', async () => {
    const res = await fetchApi('POST', '/deliveries/accept', { parcelId }, carrierToken);
    if (res.status !== 201) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
    deliveryId = res.data.data.id;
  });

  await runTest('Duplicate Parcel Acceptance should FAIL', async () => {
    const res = await fetchApi('POST', '/deliveries/accept', { parcelId }, carrierToken);
    if (res.status !== 400 && res.status !== 404) throw new Error(`Expected error, got ${res.status}`);
  });

  await runTest('Generate OTP before Pickup should FAIL', async () => {
    const res = await fetchApi('POST', `/deliveries/${deliveryId}/generate-otp`, {}, carrierToken);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await runTest('Unauthorized Access to Pickup should FAIL', async () => {
    const res = await fetchApi('PATCH', `/deliveries/${deliveryId}/pickup`, {}, senderToken);
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
  });

  await runTest('Pickup Parcel (User B)', async () => {
    const res = await fetchApi('PATCH', `/deliveries/${deliveryId}/pickup`, {}, carrierToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
  });

  await runTest('Duplicate Pickup should FAIL', async () => {
    const res = await fetchApi('PATCH', `/deliveries/${deliveryId}/pickup`, {}, carrierToken);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await runTest('Mark In Transit (User B)', async () => {
    const res = await fetchApi('PATCH', `/deliveries/${deliveryId}/in-transit`, {}, carrierToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
  });

  let plainOtp = '';
  await runTest('Generate OTP (User B)', async () => {
    const res = await fetchApi('POST', `/deliveries/${deliveryId}/generate-otp`, {}, carrierToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
    plainOtp = res.data.data.otp;
    if (!plainOtp) throw new Error('OTP not returned in response');
  });

  await runTest('Verify Wrong OTP (User B)', async () => {
    const res = await fetchApi('POST', `/deliveries/${deliveryId}/verify-otp`, { otp: '000000' }, carrierToken);
    if (res.status !== 400) throw new Error(`Expected 400 for wrong OTP, got ${res.status}`);
  });

  await runTest('Verify Correct OTP -> Deliver (User B)', async () => {
    const res = await fetchApi('POST', `/deliveries/${deliveryId}/verify-otp`, { otp: plainOtp }, carrierToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
  });

  await runTest('Duplicate OTP Verification should FAIL', async () => {
    const res = await fetchApi('POST', `/deliveries/${deliveryId}/verify-otp`, { otp: plainOtp }, carrierToken);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await runTest('Generate OTP after Delivery should FAIL', async () => {
    const res = await fetchApi('POST', `/deliveries/${deliveryId}/generate-otp`, {}, carrierToken);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await runTest('Wallet Credit Check (User B)', async () => {
    const res = await fetchApi('GET', '/wallet', undefined, carrierToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
    if (res.data.data.walletBalance !== 20) throw new Error(`Expected balance 20, got ${res.data.data.walletBalance}`);
  });

  await runTest('Wallet Withdrawal Success (User B)', async () => {
    const res = await fetchApi('POST', '/wallet/withdraw', { amount: 15 }, carrierToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
  });

  await runTest('Wallet Balance Update After Withdrawal (User B)', async () => {
    const res = await fetchApi('GET', '/wallet', undefined, carrierToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
    if (res.data.data.walletBalance !== 5) throw new Error(`Expected balance 5, got ${res.data.data.walletBalance}`);
    if (res.data.data.totalWithdrawn !== 15) throw new Error(`Expected totalWithdrawn 15, got ${res.data.data.totalWithdrawn}`);
  });

  await runTest('Wallet Withdrawal Failure - Insufficient Balance (User B)', async () => {
    const res = await fetchApi('POST', '/wallet/withdraw', { amount: 10 }, carrierToken);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await runTest('Wallet Withdrawal Failure - Negative Amount (User B)', async () => {
    const res = await fetchApi('POST', '/wallet/withdraw', { amount: -5 }, carrierToken);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  await runTest('Wallet Unauthorized Access', async () => {
    const res = await fetchApi('GET', '/wallet');
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  await runTest('Wallet Transaction History (User B)', async () => {
    const res = await fetchApi('GET', '/wallet/transactions', undefined, carrierToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
    if (res.data.data.length !== 2) throw new Error(`Expected 2 transactions, got ${res.data.data.length}`);
  });

  await runTest('Dashboard Data Fetch (User A)', async () => {
    const res = await fetchApi('GET', '/dashboard', undefined, senderToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
  });

  await runTest('Create Review for Carrier (User A)', async () => {
    // Senders can review carriers after delivery
    const res = await fetchApi('POST', '/reviews', {
      deliveryId,
      rating: 5,
      comment: 'Great carrier!'
    }, senderToken);
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
  });

  await runTest('Get Carrier Reviews (User A)', async () => {
    const carrierId = (await fetchApi('GET', '/dashboard', undefined, carrierToken)).data.data.user.id;
    const res = await fetchApi('GET', `/reviews/carrier/${carrierId}`, undefined, senderToken);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.data.data.length === 0) throw new Error('Expected at least 1 review');
  });

  console.log(`--- RESULTS: ${passed} Passed | ${failed} Failed ---`);
  if (failed > 0) process.exit(1);
};

testRunner();
