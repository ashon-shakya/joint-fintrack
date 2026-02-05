const mongoose = require('mongoose');
const User = require('./models/User');
const Record = require('./models/Record');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const verifyPartners = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Cleanup test data
        await User.deleteMany({ email: { $in: ['partner1@test.com', 'partner2@test.com'] } });
        await Record.deleteMany({ description: 'PartnerTestRecord' });

        // 1. Create Users
        console.log('Creating users...');
        const user1 = await User.create({
            name: 'Partner One',
            email: 'partner1@test.com',
            password: 'password123'
        });

        const user2 = await User.create({
            name: 'Partner Two',
            email: 'partner2@test.com',
            password: 'password123'
        });

        console.log(`Created User1 (${user1._id}) and User2 (${user2._id})`);

        // 2. User1 Invites User2
        // Simulate backend logic from partnerController:invitePartner
        console.log('User1 inviting User2...');
        user1.partners.push({
            user: user2._id,
            status: 'PENDING',
            initiatedBy: user1._id
        });
        await user1.save();

        user2.partners.push({
            user: user1._id,
            status: 'PENDING',
            initiatedBy: user1._id
        });
        await user2.save();

        // 3. User2 Accepts
        // Simulate backend logic from partnerController:acceptInvite
        console.log('User2 accepting invite...');
        const user2Link = user2.partners.find(p => p.user.toString() === user1._id.toString());
        user2Link.status = 'ACCEPTED';
        await user2.save();

        const user1Link = user1.partners.find(p => p.user.toString() === user2._id.toString());
        user1Link.status = 'ACCEPTED';
        await user1.save();

        console.log('Partnership accepted.');

        // 4. User1 adds a record
        console.log('User1 creating a record...');
        await Record.create({
            user: user1._id,
            amount: 100,
            type: 'EXPENSE',
            category: 'Test',
            description: 'PartnerTestRecord',
            spender: 'PersonA'
        });

        // 5. User2 fetches joint records
        // Simulate recordController:getRecords logic
        console.log('User2 fetching joint records...');
        const userIds = [user2._id, user1._id]; // User2 + Partner(User1)
        const records = await Record.find({
            user: { $in: userIds },
            description: 'PartnerTestRecord'
        });

        if (records.length === 1 && records[0].user.toString() === user1._id.toString()) {
            console.log('SUCCESS: User2 can see User1\'s record!');
        } else {
            console.error('FAILURE: User2 could not find the record.', records);
        }

        // Cleanup
        await User.deleteMany({ email: { $in: ['partner1@test.com', 'partner2@test.com'] } });
        await Record.deleteMany({ description: 'PartnerTestRecord' });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyPartners();
