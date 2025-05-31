if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

import mailchimp from '@mailchimp/mailchimp_marketing';

// Configuration validation
function validateMailchimpConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  
  if (!apiKey) {
    throw new Error('MAILCHIMP_API_KEY environment variable is required');
  }
  
  if (!listId) {
    throw new Error('MAILCHIMP_LIST_ID environment variable is required');
  }
  
  // Extract datacenter from API key (format: key-dc)
  const datacenter = apiKey.split('-')[1];
  if (!datacenter) {
    throw new Error('Invalid MAILCHIMP_API_KEY format. Expected format: key-datacenter');
  }
  
  return { apiKey, listId, datacenter };
}

// Initialize Mailchimp client
function initializeMailchimp() {
  try {
    const { apiKey, datacenter } = validateMailchimpConfig();
    
    mailchimp.setConfig({
      apiKey,
      server: datacenter
    });
    
    return mailchimp;
  } catch (error) {
    console.error('Failed to initialize Mailchimp:', error);
    throw error;
  }
}

export interface MailchimpSubscriptionOptions {
  email: string;
  tags?: string[];
  interests?: { [key: string]: boolean };
  mergeFields?: { [key: string]: string };
  source?: string;
}

export interface MailchimpSubscriptionResult {
  success: boolean;
  message: string;
  isAlreadySubscribed?: boolean;
}

export async function subscribeToMailchimp(
  emailOrOptions: string | MailchimpSubscriptionOptions
): Promise<MailchimpSubscriptionResult> {
  // Handle both old signature (just email) and new signature (options object)
  let options: MailchimpSubscriptionOptions;
  
  if (typeof emailOrOptions === 'string') {
    options = { email: emailOrOptions };
  } else {
    options = emailOrOptions;
  }
  
  const { email, tags = [], interests = {}, mergeFields = {}, source } = options;
  // Input validation
  if (!email || typeof email !== 'string') {
    return {
      success: false,
      message: 'Email address is required.'
    };
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: 'Please enter a valid email address.'
    };
  }
  
  try {
    const { listId } = validateMailchimpConfig();
    const client = initializeMailchimp();
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    // Prepare subscription data
    const subscriptionData: any = {
      email_address: normalizedEmail,
      status: 'subscribed',
      merge_fields: {
        ...mergeFields,
        // Add source tracking if provided
        ...(source && { SOURCE: source })
      }
    };

    // Add interests if provided
    if (Object.keys(interests).length > 0) {
      subscriptionData.interests = interests;
    }

    // Add tags if provided
    if (tags.length > 0) {
      subscriptionData.tags = tags;
    }

    // Add subscriber to Mailchimp list
    const response = await client.lists.addListMember(listId, subscriptionData);
    
    if (response.id) {
      return {
        success: true,
        message: 'Successfully subscribed to our newsletter! Check your email to confirm.',
        isAlreadySubscribed: false
      };
    } else {
      return {
        success: false,
        message: 'Subscription failed. Please try again later.'
      };
    }
    
  } catch (error: any) {
    console.error('Mailchimp subscription error:', error);
    
    // Handle specific Mailchimp errors
    if (error.response?.body?.title === 'Member Exists') {
      return {
        success: true,
        message: 'You are already subscribed to our newsletter!',
        isAlreadySubscribed: true
      };
    }
    
    if (error.response?.body?.title === 'Invalid Resource') {
      return {
        success: false,
        message: 'Please enter a valid email address.'
      };
    }
    
    if (error.response?.body?.title === 'Forgotten Email Not Subscribed') {
      // Handle case where user was previously unsubscribed
      try {
        const { listId } = validateMailchimpConfig();
        const client = initializeMailchimp();
        
        // Try to resubscribe with updated data
        const updateData: any = {
          status: 'subscribed',
          merge_fields: {
            ...mergeFields,
            ...(source && { SOURCE: source })
          }
        };

        // Add interests and tags for resubscription
        if (Object.keys(interests).length > 0) {
          updateData.interests = interests;
        }

        await client.lists.updateListMember(listId, email.toLowerCase().trim(), updateData);
        
        // Add tags separately for existing members if provided
        if (tags.length > 0) {
          await client.lists.updateListMemberTags(listId, email.toLowerCase().trim(), {
            tags: tags.map(tag => ({ name: tag, status: 'active' }))
          });
        }
        
        return {
          success: true,
          message: 'Successfully resubscribed to our newsletter!'
        };
      } catch (resubscribeError) {
        console.error('Resubscribe error:', resubscribeError);
        return {
          success: false,
          message: 'Subscription failed. Please try again later.'
        };
      }
    }
    
    // Generic error handling
    if (error.response?.status === 400) {
      return {
        success: false,
        message: 'Invalid email address or subscription data.'
      };
    }
    
    if (error.response?.status === 401) {
      console.error('Mailchimp authentication failed. Check API key.');
      return {
        success: false,
        message: 'Service temporarily unavailable. Please try again later.'
      };
    }
    
    if (error.response?.status === 404) {
      console.error('Mailchimp list not found. Check LIST_ID.');
      return {
        success: false,
        message: 'Service temporarily unavailable. Please try again later.'
      };
    }
    
    // Network or other errors
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.'
    };
  }
}

// Optional: Function to check if email is already subscribed
export async function checkSubscriptionStatus(email: string): Promise<{
  subscribed: boolean;
  status?: string;
}> {
  try {
    const { listId } = validateMailchimpConfig();
    const client = initializeMailchimp();
    
    const normalizedEmail = email.toLowerCase().trim();
    const response = await client.lists.getListMember(listId, normalizedEmail);
    
    return {
      subscribed: response.status === 'subscribed',
      status: response.status
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { subscribed: false };
    }
    
    console.error('Error checking subscription status:', error);
    return { subscribed: false };
  }
}

// Optional: Function to get list statistics (for admin purposes)
export async function getListStats() {
  try {
    const { listId } = validateMailchimpConfig();
    const client = initializeMailchimp();
    
    const response = await client.lists.getList(listId);
    
    return {
      success: true,
      stats: {
        memberCount: response.stats.member_count,
        unsubscribeCount: response.stats.unsubscribe_count,
        cleanedCount: response.stats.cleaned_count
      }
    };
  } catch (error) {
    console.error('Error getting list stats:', error);
    return {
      success: false,
      error: 'Failed to fetch list statistics'
    };
  }
}

// Get all available tags for the list
export async function getListTags() {
  try {
    const { listId } = validateMailchimpConfig();
    const client = initializeMailchimp();
    
    const response = await client.lists.getListTags(listId);
    
    return {
      success: true,
      tags: response.tags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        memberCount: tag.member_count
      }))
    };
  } catch (error) {
    console.error('Error getting list tags:', error);
    return {
      success: false,
      error: 'Failed to fetch list tags'
    };
  }
}

// Get all interest categories and interests for the list
export async function getListInterests() {
  try {
    const { listId } = validateMailchimpConfig();
    const client = initializeMailchimp();
    
    const response = await client.lists.getListInterestCategories(listId);
    
    const interestCategories = [];
    for (const category of response.categories) {
      const interests = await client.lists.getListInterestCategoryInterests(listId, category.id);
      interestCategories.push({
        id: category.id,
        title: category.title,
        type: category.type,
        interests: interests.interests.map((interest: any) => ({
          id: interest.id,
          name: interest.name,
          subscriberCount: interest.subscriber_count
        }))
      });
    }
    
    return {
      success: true,
      categories: interestCategories
    };
  } catch (error) {
    console.error('Error getting list interests:', error);
    return {
      success: false,
      error: 'Failed to fetch list interests'
    };
  }
}

// Helper function to create predefined subscription configurations
export function createSubscriptionConfig(source: string): Partial<MailchimpSubscriptionOptions> {
  const configs: { [key: string]: Partial<MailchimpSubscriptionOptions> } = {
    // Homepage newsletter signup
    homepage: {
      tags: ['Homepage Signup'],
      source: 'homepage',
      mergeFields: { 
        SOURCE: 'Homepage Newsletter Form'
      }
    },
    
    // Blog/article signup
    blog: {
      tags: ['Blog Reader', 'Content Interested'],
      source: 'blog',
      mergeFields: { 
        SOURCE: 'Blog Article'
      }
    },
    
    // Product page signup
    product: {
      tags: ['Product Interested', 'High Intent'],
      source: 'product',
      mergeFields: { 
        SOURCE: 'Product Page'
      }
    },
    
    // Footer signup
    footer: {
      tags: ['Footer Signup'],
      source: 'footer',
      mergeFields: { 
        SOURCE: 'Footer Newsletter Form'
      }
    },
    
    // Popup/modal signup
    popup: {
      tags: ['Popup Signup'],
      source: 'popup',
      mergeFields: { 
        SOURCE: 'Newsletter Popup'
      }
    },
    
    // Exit intent signup
    'exit-intent': {
      tags: ['Exit Intent', 'Last Chance'],
      source: 'exit-intent',
      mergeFields: { 
        SOURCE: 'Exit Intent Popup'
      }
    }
  };
  
  return configs[source] || { 
    tags: ['General Signup'],
    source: source || 'unknown',
    mergeFields: { SOURCE: source || 'Unknown Source' }
  };
} 