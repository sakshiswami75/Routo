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

  await runTest('User A (Sender) Login', async () => {
    // Wait for the DB to save... actually it's immediate
    const res = await fetchApi('POST', '/auth/login', {
      email: `sender@test.com`, // We need to use a consistent email
      password: 'password123'
    });
    // Let's re-register with a fixed email and catch 409
    await fetchApi('POST', '/auth/register', { name: 'Sender', email: 'sender@test.com', password: 'password123' });
    const loginRes = await fetchApi('POST', '/auth/login', { email: 'sender@test.com', password: 'password123' });
    if (loginRes.status !== 200) throw new Error('Login failed');
    senderToken = loginRes.data.data.token;
  });

  await runTest('User B (Carrier) Registration and Login', async () => {
    await fetchApi('POST', '/auth/register', { name: 'Carrier', email: 'carrier@test.com', password: 'password123' });
    const loginRes = await fetchApi('POST', '/auth/login', { email: 'carrier@test.com', password: 'password123' });
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

  await runTest('Invalid Status Transition (Deliver before Pickup) should FAIL', async () => {
    const res = await fetchApi('PATCH', `/deliveries/${deliveryId}/deliver`, {}, carrierToken);
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

  await runTest('Deliver Parcel (User B)', async () => {
    const res = await fetchApi('PATCH', `/deliveries/${deliveryId}/deliver`, {}, carrierToken);
    if (res.status !== 200) throw new Error(`Failed: ${JSON.stringify(res.data)}`);
  });

  await runTest('Duplicate Delivery Completion should FAIL', async () => {
    const res = await fetchApi('PATCH', `/deliveries/${deliveryId}/deliver`, {}, carrierToken);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  console.log(`--- RESULTS: ${passed} Passed | ${failed} Failed ---`);
  if (failed > 0) process.exit(1);
};

testRunner();
