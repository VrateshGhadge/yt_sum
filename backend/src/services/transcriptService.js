const { fetchTranscript } = require('youtube-transcript-plus')
const { DEFAULT_PARAGRAPH_MS, decodeHtmlEntities, mergeSegmentsByDuration, sanitizeText } = require('../utils/transcript')

// Summarize, then Ask, then Notes, then Quiz all need the SAME transcript for
// one video, and each call would otherwise re-download it from YouTube. A short
// cache removes that repeat, and keeps YouTube off the critical path for every
// request after the first.
const CACHE_TTL_MS = 15 * 60 * 1000
const CACHE_MAX_ENTRIES = 50
const cache = new Map()

function cacheGet(videoId){
    const hit = cache.get(videoId)
    if(!hit) return null
    if(Date.now() > hit.expires){
        cache.delete(videoId)
        return null
    }
    return hit.data
}

function cacheSet(videoId, data){
    // Plain Map iteration order is insertion order, so the oldest key is first.
    if(cache.size >= CACHE_MAX_ENTRIES){
        const oldest = cache.keys().next().value
        if(oldest !== undefined) cache.delete(oldest)
    }
    cache.set(videoId, { data, expires: Date.now() + CACHE_TTL_MS })
}

async function fetchRawTranscript(videoId){
    if(!videoId){
        return null
    }
    try{
        // youtube-transcript-plus solves YouTube's PoToken requirement, which
        // makes the older youtube-transcript package return empty results.
        return await fetchTranscript(videoId)
    }catch(err){
        //console.log('Transcript fetch error:', err?.message || err);
        return null
    }
}

// Full clean text + timed segments in a single fetch (used by the summary flow).
async function getTranscriptData(videoId){
    if(!videoId){
        return null
    }

    const cached = cacheGet(videoId)
    if(cached) return cached

    const transcript = await fetchRawTranscript(videoId)

    if(!transcript || transcript.length === 0){
        return null
    }

    // Segment offset/duration are in SECONDS; convert to ms for the API.
    const captionLines = transcript
        .map(item => ({
            text: sanitizeText(decodeHtmlEntities(item.text)),
            offsetMs: Math.round((item.offset || 0) * 1000),
            durationMs: Math.round((item.duration || 0) * 1000)
        }))
        .filter(segment => segment.text)

    if(captionLines.length === 0){
        return null
    }

    const segments = mergeSegmentsByDuration(captionLines, DEFAULT_PARAGRAPH_MS)
    const text = sanitizeText(segments.map(segment => segment.text).join(' '))

    const data = { text, segments }
    cacheSet(videoId, data)
    return data
}

async function getTranscriptByVideoId(videoId){
    const data = await getTranscriptData(videoId);
    return data ? data.text : null;
}

async function getTimedSegments(videoId){
    const data = await getTranscriptData(videoId);
    return data ? data.segments : null;
}

module.exports = { getTranscriptByVideoId, getTimedSegments, getTranscriptData }