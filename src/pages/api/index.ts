import axios from 'axios';
import NodeCache from 'node-cache';

const lyricsCache = new NodeCache({ stdTTL: 3600 }); // Cache with a 1-hour TTL

export async function fetchLyrics(song: string, artist: string) {
    const cacheKey = `${artist}-${song}`.toLowerCase();

    // Check if lyrics are already in cache
    const cachedLyrics = lyricsCache.get(cacheKey);
    if (cachedLyrics) {
        console.log('Cache hit');
        return cachedLyrics;
    }

    try {
        const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${song}`);
        const lyrics = response.data;

        // Store in cache
        lyricsCache.set(cacheKey, lyrics);

        return lyrics;
    } catch (error) {
        if (error.response?.status === 429) { // Rate limit exceeded
            console.warn('Rate limit hit. Retrying after a delay...');
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
            return fetchLyrics(song, artist); // Retry
        }
        throw error;
    }
}
