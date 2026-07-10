export interface SocialCardData {
  title: string;
  description: string;
  image: string;
  url: string;
  username: string;
}

export function generateOpenGraphTags(data: SocialCardData): string {
  return `
    <meta property="og:title" content="${escapeHtml(data.title)}" />
    <meta property="og:description" content="${escapeHtml(data.description)}" />
    <meta property="og:image" content="${escapeHtml(data.image)}" />
    <meta property="og:url" content="${escapeHtml(data.url)}" />
    <meta property="og:type" content="profile" />
    <meta property="profile:username" content="${escapeHtml(data.username)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(data.title)}" />
    <meta name="twitter:description" content="${escapeHtml(data.description)}" />
    <meta name="twitter:image" content="${escapeHtml(data.image)}" />
  `.trim();
}

export function generateLinkedInCardData(data: SocialCardData) {
  return {
    title: data.title,
    description: data.description,
    image: data.image,
    url: data.url,
  };
}

export function generateXCardData(data: SocialCardData) {
  return {
    text: `${data.title}\n\n${data.description}`,
    url: data.url,
    hashtags: ["GitVerse", "DeveloperWrapped"],
  };
}

export function generateDiscordPreview(data: SocialCardData) {
  return {
    embeds: [{
      title: data.title,
      description: data.description,
      image: { url: data.image },
      url: data.url,
      color: 0x6552e6,
    }],
  };
}

export function generateReadmeEmbed(data: SocialCardData): string {
  return `[![${escapeHtml(data.title)}](${escapeHtml(data.image)})](${escapeHtml(data.url)})`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
