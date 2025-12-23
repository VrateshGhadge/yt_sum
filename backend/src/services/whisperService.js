require('dotenv').config()

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const OpenAI = require('openai');
const { sanitizeText } = require('../utils/transcript');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const TEMP_DIR = path.join(process.cwd(), 'tmp');

if(!fs.existsSync(TEMP_DIR)){
    fs.mkdirSync(TEMP_DIR);
}

function downloadAudio(youtubeUrl, outputPath){
    return new Promise((resolve, reject)=>{
        const command = `yt-dlp -f bestaudio --extract-audio --audio-format mp3 -o "${outputPath}" "${youtubeUrl}"`;
 
        
        exec(command, (error)=>{
            if(error) return reject(error)
            resolve();
        });
    });
}

async function transcribeWithWhisper(youtubeUrl){
    const fileName = `audio-${Date.now()}.mp3`;
    const filePath = path.join(TEMP_DIR, fileName)

    try{
        await downloadAudio(youtubeUrl, filePath);

        const response = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1',
        });

        if(!response || !response.text) return null

        return sanitizeText(response.text);
    }catch(error){
        console.error('[Whisper] Transcription failed:', error.message);
        return null;
    } finally {
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        }
    }
}

module.exports = { transcribeWithWhisper }
