require('dotenv').config()

const REQUIRED = ['NODE_ENV', 'PORT', 'MONGODB_URI', 'CLOUD_NAME', 'UPLOAD_PRESET']
const missing = REQUIRED.filter(key => !process.env[key])


if (missing.length > 0) {
    console.log(`Missing required environment variable(s): ${missing.join(', ')}`)
    process.exit(1)
}

// exported vars should be used through the project and should serve as a central hub if any need to be changed/added
module.exports = {
    nodeEnv:process.env.NODE_ENV,
    port:Number(process.env.PORT),
    mongoUri:process.env.MONGODB_URI,
    cloudName:process.env.CLOUD_NAME,
    uploadPreset:process.env.UPLOAD_PRESET,
    isProduction:process.env.NODE_ENV === 'production'
}