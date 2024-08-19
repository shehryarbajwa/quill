import { IncomingWebhook } from '@slack/webhook';

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL!);

export async function sendSlackNotification(message: string, userName: string, email: string) {
  try {
    await webhook.send({
      text: message,
      blocks: [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "New Signup",
            "emoji": true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${message}*\nUser: ${userName}*\nEmail: ${email} `
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Cool"
              },
              "style": "primary",
              "value": "click_me_123"
            },
          ]
        }
      ]
    });
    console.log('Slack notification sent successfully');
  } catch (error) {
    console.error('Error sending Slack notification:', error);
  }
}