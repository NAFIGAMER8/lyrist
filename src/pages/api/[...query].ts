import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "genius-lyrics";
import NodeCache from "node-cache";

const lyricsCache = new NodeCache({ stdTTL: 1800 }); // Cache for 30 minutes (1800 seconds)
const nullishQueries = ["None", "N/A", "null", "undefined"];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new Client();

    if (req.method === "GET") {
      const { query } = req.query;

      // Validate query input
      if (!Array.isArray(query) || !query) {
        return res.status(400).json({ error: "Bad request" });
      }

      if (
        query.length <= 2 &&
        query.length !== 0 &&
        !query.some((q) => nullishQueries.includes(q))
      ) {
        const cacheKey = query.join(" ").toLowerCase();

        // Check cache first
        const cachedLyrics = lyricsCache.get(cacheKey);
        if (cachedLyrics) {
          console.log("Cache hit");
          return res.status(200).json(cachedLyrics);
        }

        // Fetch lyrics if not cached
        try {
          const searches = await client.songs.search(
            `${decodeURIComponent(query[0] as string)} ${decodeURIComponent(
              query?.length > 1 ? (query[1] as string) : ""
            )}`
          );
          const song = searches[0];
          const lyrics = await song?.lyrics();

          // Prepare response
          const response = {
            lyrics: lyrics,
            title: song?.title,
            artist: song?.artist.name,
            album: song?.album?.name,
            albumArt: song?.album?.image,
            releaseDate: song?.releasedAt,
            image: song?.image,
          };

          // Cache the response
          lyricsCache.set(cacheKey, response);

          res.setHeader(
            "Cache-Control",
            "public, s-maxage=86400, stale-while-revalidate=43200"
          );
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");

          return res.status(200).json(response);
        } catch (error) {
          console.error("Lyrics fetch failed:", error);
          return res.status(404).json({ error: "Lyrics not found" });
        }
      } else {
        return res.status(400).json({ error: "Bad request" });
      }
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
