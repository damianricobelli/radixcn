const SITE_NAME = "Radixcn";
const DEFAULT_OG_IMAGE_PATH = "/og.png";
const DEFAULT_OG_IMAGE_WIDTH = "1536";
const DEFAULT_OG_IMAGE_HEIGHT = "1024";

const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");

function absoluteUrl(path: string) {
  if (!siteUrl) {
    return path;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  imageAlt: string;
};

export function pageSeo({
  title,
  description,
  path,
  imageAlt,
}: PageSeoOptions) {
  const image = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const url = siteUrl ? absoluteUrl(path) : undefined;

  return {
    meta: [
      {
        title,
      },
      {
        name: "description",
        content: description,
      },
      ...(url
        ? [
            {
              property: "og:url",
              content: url,
            },
          ]
        : []),
      {
        property: "og:site_name",
        content: SITE_NAME,
      },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:image",
        content: image,
      },
      {
        property: "og:image:width",
        content: DEFAULT_OG_IMAGE_WIDTH,
      },
      {
        property: "og:image:height",
        content: DEFAULT_OG_IMAGE_HEIGHT,
      },
      {
        property: "og:image:alt",
        content: imageAlt,
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: title,
      },
      {
        name: "twitter:description",
        content: description,
      },
      {
        name: "twitter:image",
        content: image,
      },
      {
        name: "twitter:image:alt",
        content: imageAlt,
      },
    ],
    links: url
      ? [
          {
            rel: "canonical",
            href: url,
          },
        ]
      : [],
  };
}
