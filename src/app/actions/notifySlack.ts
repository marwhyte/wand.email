'use server'

type SlackChannelType = 'upgrade' | 'errors'

const idForChannel = (channel: SlackChannelType) => {
  if (channel === 'upgrade') {
    return 'C07T0NXLS64'
  }
  return 'C07S193MQLR'
}

export async function notifySlack(message: string, channel: SlackChannelType) {
  // if (isLocalDev) {
  //   console.log(`Slack message to send to channel ${channel}: `, message)
  //   return
  // }

  const channelId = idForChannel(channel)

  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${process.env.SLACK_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      channel: channelId,
      text: message,
    }),
  })
}
