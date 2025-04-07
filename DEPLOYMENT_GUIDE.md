# Deployment Guide for Community Portal

This guide explains how to deploy the Community Portal microservices application to Render.

## Prerequisites

1. A Render account
2. MongoDB Atlas account and connection string
3. Google Gemini API key
4. GitHub repository with your code

## Deployment Steps

### 1. Prepare Your Repository

1. Make sure all your code is pushed to GitHub
2. Ensure all environment variables are properly configured in the `render.yaml` file
3. Verify that all package.json files have the correct start scripts

### 2. Deploy to Render

1. Log in to your Render account
2. Click "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and create all services

### 3. Configure Environment Variables

For each service, you'll need to set the following environment variables:

#### Server
- `PORT`: 4000
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure secret for JWT token generation
- `GEMINI_API_KEY`: Your Google Gemini API key

#### Auth MFE
- `VITE_API_URL`: The URL of your deployed server (e.g., https://community-portal-server.onrender.com/graphql)
- `VITE_PORT`: 3001

#### Community MFE
- `VITE_API_URL`: The URL of your deployed server
- `VITE_PORT`: 3002

#### AI Assistant MFE
- `VITE_API_URL`: The URL of your deployed server
- `VITE_PORT`: 3003

#### Container MFE
- `VITE_API_URL`: The URL of your deployed server
- `VITE_PORT`: 3000

### 4. Verify Deployment

1. Wait for all services to deploy successfully
2. Check the logs for each service to ensure there are no errors
3. Test the application by accessing the container MFE URL

### 5. Post-Deployment Tasks

1. Update CORS settings in the server if needed
2. Configure custom domains if required
3. Set up monitoring and logging
4. Configure auto-deploy from your GitHub repository

## Troubleshooting

### Common Issues

1. **Connection Refused**: Check if all services are running and the ports are correctly configured
2. **CORS Errors**: Verify CORS settings in the server and ensure all URLs are correct
3. **Database Connection**: Ensure MongoDB Atlas is accessible and the connection string is correct
4. **Environment Variables**: Double-check all environment variables are set correctly

### Checking Logs

1. Go to the Render dashboard
2. Select the service you want to check
3. Click on "Logs" to view the service logs
4. Look for any error messages or warnings

## Maintenance

1. Regularly update dependencies
2. Monitor resource usage
3. Set up alerts for service health
4. Keep environment variables up to date
5. Regularly backup your database

## Security Considerations

1. Keep all API keys and secrets secure
2. Use HTTPS for all services
3. Implement rate limiting
4. Regularly update dependencies for security patches
5. Monitor for suspicious activity

## Support

If you encounter any issues during deployment, please:
1. Check the Render documentation
2. Review the service logs
3. Contact Render support if needed
4. Check the GitHub repository for updates 