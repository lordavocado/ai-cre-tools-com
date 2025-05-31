#!/usr/bin/env node

/**
 * Mailchimp Integration Test Script
 * 
 * This script tests your Mailchimp configuration to ensure everything is set up correctly.
 * Run with: node scripts/test-mailchimp.js
 * 
 * Prerequisites:
 * - MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID in your .env.local file
 * - Node.js environment with access to your environment variables
 */

require('dotenv').config({ path: '.env.local' });

async function testMailchimpIntegration() {
  console.log('🧪 Testing Mailchimp Integration...\n');

  // Check environment variables
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey) {
    console.error('❌ MAILCHIMP_API_KEY is not set in .env.local');
    return false;
  }

  if (!listId) {
    console.error('❌ MAILCHIMP_LIST_ID is not set in .env.local');
    return false;
  }

  console.log('✅ Environment variables found');

  // Validate API key format
  const datacenter = apiKey.split('-')[1];
  if (!datacenter) {
    console.error('❌ Invalid API key format. Expected: key-datacenter');
    return false;
  }

  console.log(`✅ API key format valid (datacenter: ${datacenter})`);

  try {
    // Dynamic import for ES modules
    const { getListStats, checkSubscriptionStatus } = await import('../src/lib/mailchimp.js');

    // Test getting list stats
    console.log('\n📊 Testing list statistics...');
    const statsResult = await getListStats();
    
    if (statsResult.success) {
      console.log('✅ Successfully connected to Mailchimp');
      console.log(`📈 Subscriber count: ${statsResult.stats.memberCount}`);
      console.log(`📉 Unsubscribed: ${statsResult.stats.unsubscribeCount}`);
      console.log(`🧹 Cleaned: ${statsResult.stats.cleanedCount}`);
    } else {
      console.error('❌ Failed to get list stats:', statsResult.error);
      return false;
    }

    // Test subscription status check with a test email
    console.log('\n📧 Testing subscription status check...');
    const testEmail = 'test@example.com';
    const statusResult = await checkSubscriptionStatus(testEmail);
    console.log(`✅ Subscription status check working (${testEmail} subscribed: ${statusResult.subscribed})`);

    console.log('\n🎉 All tests passed! Your Mailchimp integration is working correctly.');
    console.log('\n💡 Next steps:');
    console.log('   1. Test the newsletter form on your website');
    console.log('   2. Check your Mailchimp audience for new subscribers');
    console.log('   3. Visit /admin/newsletter to see the admin dashboard');

    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    
    if (error.message.includes('MAILCHIMP_API_KEY')) {
      console.log('\n💡 Make sure MAILCHIMP_API_KEY is set in your .env.local file');
    }
    
    if (error.message.includes('MAILCHIMP_LIST_ID')) {
      console.log('\n💡 Make sure MAILCHIMP_LIST_ID is set in your .env.local file');
    }

    if (error.message.includes('authentication') || error.message.includes('401')) {
      console.log('\n💡 Check your API key - it might be invalid or expired');
    }

    if (error.message.includes('404') || error.message.includes('list')) {
      console.log('\n💡 Check your List ID - it might be incorrect');
    }

    return false;
  }
}

// Run the test
testMailchimpIntegration()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }); 