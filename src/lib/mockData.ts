
// Mock data for the email generator

// Function to generate email copy based on URL
export const generateEmailCopy = (url: string) => {
  // In a real app, this would call an API to analyze the URL and generate copy
  
  // For demo purposes, we'll return different copy based on the URL
  if (url.includes('webinar')) {
    return {
      subject: "Don't Miss Our Exclusive Webinar: Transform Your Marketing Strategy",
      preheader: "Join industry experts to learn cutting-edge marketing techniques",
      body: `Hi there,

We're excited to invite you to our upcoming webinar "Transform Your Marketing Strategy in 2023" happening next Thursday at 2 PM EST.

In this exclusive session, our panel of industry experts will share:

• Proven strategies to increase conversion rates by up to 35%
• The latest trends in digital marketing that are driving results
• Step-by-step frameworks you can implement immediately
• Real case studies from businesses that have transformed their approach

Spaces are limited, so secure your spot today by clicking the button below.

[Register Now]

Can't make it live? Register anyway and we'll send you the recording.

Looking forward to seeing you there!

Best regards,
The Marketing Team`
    };
  } else if (url.includes('product')) {
    return {
      subject: "Introducing Our New Product: The Solution You've Been Waiting For",
      preheader: "Discover how our new product can solve your biggest challenges",
      body: `Hello,

We're thrilled to announce the launch of our newest product that's designed to solve the challenges you've been facing.

Our team has spent months perfecting every detail to ensure it delivers exceptional results for customers like you. Here's what makes it special:

• Intuitive design that makes implementation a breeze
• Advanced features that outperform competitors by 40%
• Seamless integration with your existing tools
• Dedicated support to ensure your success

For a limited time, we're offering an exclusive 20% discount for early adopters.

[Shop Now]

Not quite ready? Schedule a personalized demo with our product specialists to see it in action.

[Book a Demo]

We can't wait for you to experience the difference.

Warm regards,
The Product Team`
    };
  } else {
    // Default email copy
    return {
      subject: "Special Offer Just For You: Save 25% This Week Only",
      preheader: "Limited time discount on our most popular products and services",
      body: `Dear Valued Customer,

We wanted to reach out with an exclusive offer just for you. As one of our loyal customers, you can now enjoy 25% off your next purchase.

Why are we doing this?

We appreciate your continued support and want to give something back. This special discount is our way of saying thank you.

Here's what's included:

• 25% off any product or service
• Free shipping on orders over $50
• Extended 60-day return policy
• Priority customer support

This offer is valid until the end of this week, so don't miss out!

[Shop Now]

Thank you for being part of our journey.

Best regards,
The Customer Success Team`
    };
  }
};

// Mock saved templates
export const getSavedTemplates = () => {
  return [
    {
      id: "template-1",
      name: "Product Launch Announcement",
      subject: "Introducing Our New Product: The Solution You've Been Waiting For",
      created: "Oct 15, 2023"
    },
    {
      id: "template-2",
      name: "Webinar Invitation",
      subject: "Don't Miss Our Exclusive Webinar: Transform Your Marketing Strategy",
      created: "Oct 10, 2023"
    },
    {
      id: "template-3",
      name: "Special Discount Offer",
      subject: "Special Offer Just For You: Save 25% This Week Only",
      created: "Oct 5, 2023"
    },
    {
      id: "template-4",
      name: "Newsletter Welcome",
      subject: "Welcome to Our Newsletter - Here's What to Expect",
      created: "Sep 28, 2023"
    },
    {
      id: "template-5",
      name: "Abandoned Cart Reminder",
      subject: "You Left Something Behind - Complete Your Purchase Today",
      created: "Sep 20, 2023"
    }
  ];
};
