const { User } = require('./models');

async function seed() {
  const users = await User.findAll();
  for (const user of users) {
    user.password_hash = 'Password@123'; // Hooks in User.js will hash it with bcrypt!
    await user.save();
    console.log(`Updated password for ${user.email}`);
  }
  console.log('All passwords securely hashed with bcrypt!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
