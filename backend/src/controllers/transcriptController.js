const { getTranscriptByVideoId } = require('../services/transcriptService')
const { extractVideoId, validateYouTubeUrl } = require('../utils/transcript')

    // 1. Validate input
    // 2. Validate YouTube URL
    // 3. Extract videoId
    // 4. Fetch transcript (service)
    // 5. Success response


async function getTranscript(req, res){
    try{
        const{ youtubeUrl } = req.body;

        if(!youtubeUrl){
            return res.status(400).json({
                success: false,
                message: "Youtube URL not found"
            })
        }

        if(!validateYouTubeUrl){
            return res.status(400).json({
                success: true,
                message: "Invalid Youtube URl"
            })
        }

        const videoId = extractVideoId(youtubeUrl);
        if(!videoId){
            return res.status(400).json({
                success: true,
                message: "Unable to extract video ID"
            })
        }

        const transcript = await getTranscriptByVideoId(videoId);
        if(!transcript){
            return res.status(404).json({
                success: false,
                message: "Transcript not available for this video"
            })
        }
        //console.log('Transcript length:', transcript.length);

        return res.status(200).json({
            success: true,
            data: {
                videoId,
                transcript
            }
        });
        
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

module.exports = { getTranscript }