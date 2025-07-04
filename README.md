# SoundCast

## Live URL
https://soundcast.onrender.com

## Demo
How to Generate Podcast: https://www.youtube.com/watch?v=7Suius1enhI  
How to Generate TTS(Text To Speech): https://www.youtube.com/watch?v=_8O9yYNmQOs

## Setup
1. git clone https://github.com/AhanafTahmid/SoundCast.git
2. Run "npm i" on both frontend and backend folder
3. Setup .env files on both frontend and backend folder

   
Frontend env:  
VITE_CLERK_PUBLISHABLE_KEY =  
BASEE_URL(Website's URL After Hosting)= 

Backend env:  
PORT =  
BASEE_URL(Website's URL After Hosting)=  
MONGODB_URI =  
ADMIN_EMAIL =  
ClOUDINARY_API_KEY =  
ClOUDINARY_API_SECRET =  
ClOUDINARY_ClOUD_NAME =  
NODE_ENV =  
CLERK_PUBLISHABLE_KEY =  
CLERK_SECRET_KEY =  

OPENAI_API_KEY =  
GROQ_API_KEY =  
NEBIUS_API_KEY =  
GEMINI_API_KEY =

## Tools Used
For Text to audio Generation : [GROQ](https://console.groq.com/docs/text-to-speech)  
For Text to image Generation : [NEBIUS](https://studio.nebius.com/?modality=text2image)


## Challenges
- Adding podcast for multiple voices(Used multiple Groq TTS for this)
