// Native fetch is available in Node 18+
const api = 'http://localhost:5000/api';

async function runTests() {
    console.log('Starting Verification Tests...');

    // 1. Register
    console.log('\n1. Testing Registration...');
    const user = {
        name: 'Verify User',
        email: `verify_${Date.now()}@test.com`,
        password: 'password123'
    };

    let token;

    try {
        const regRes = await fetch(`${api}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (regRes.status !== 201) {
            const err = await regRes.text();
            throw new Error(`Registration failed: ${regRes.status} ${err}`);
        }

        const regData = await regRes.json();
        console.log('✅ Registration Successful:', regData.email);
        token = regData.token;

        // 2. Login (Optional, since register returns token, but good to test)
        console.log('\n2. Testing Login...');
        const loginRes = await fetch(`${api}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });

        if (loginRes.status !== 200) {
            throw new Error(`Login failed: ${loginRes.status}`);
        }
        const loginData = await loginRes.json();
        console.log('✅ Login Successful');

        // 3. Add Record
        console.log('\n3. Testing Add Record...');
        const record = {
            amount: 100,
            type: 'INCOME',
            category: 'Salary',
            description: 'Test Income'
        };

        const addRes = await fetch(`${api}/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(record)
        });

        if (addRes.status !== 201) {
            const err = await addRes.text();
            throw new Error(`Add Record failed: ${addRes.status} ${err}`);
        }
        const addData = await addRes.json();
        console.log('✅ Add Record Successful:', addData.description);

        // 4. Get Records
        console.log('\n4. Testing Get Records...');
        const getRes = await fetch(`${api}/records`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const records = await getRes.json();
        if (Array.isArray(records) && records.length > 0) {
            console.log(`✅ Get Records Successful: Found ${records.length} records`);
        } else {
            throw new Error('Get Records failed or empty');
        }

        console.log('\n🎉 ALL BACKEND TESTS PASSED');

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error.message);
        process.exit(1);
    }
}

// Check for native fetch
if (!global.fetch) {
    console.log('Node version does not support native fetch, trying to require node-fetch...');
    try {
        global.fetch = require('node-fetch');
    } catch (e) {
        console.error('This script requires Node.js 18+ or node-fetch installed.');
        process.exit(1);
    }
}

runTests();
