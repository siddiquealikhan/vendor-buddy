# Vendor-Buddy Deployment Guide

This guide covers different deployment options for the Vendor-Buddy application.

## 🚀 Quick Start with Docker Compose

The easiest way to deploy Vendor-Buddy is using Docker Compose:

```bash
# Clone the repository
git clone <repository-url>
cd vendor-buddy

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- MongoDB: localhost:27017

## 🌐 Production Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

#### Frontend Deployment on Vercel

1. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Set build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

2. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   VITE_APP_NAME=Vendor-Buddy
   ```

3. **Deploy:**
   - Vercel will automatically deploy on every push to main branch

#### Backend Deployment on Render

1. **Create a new Web Service:**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Choose "Web Service"

2. **Configure the service:**
   - Name: `vendor-buddy-backend`
   - Environment: `Java`
   - Build Command: `mvn clean install -DskipTests`
   - Start Command: `java -jar target/vendor-buddy-0.0.1-SNAPSHOT.jar`

3. **Environment Variables:**
   ```
   SPRING_DATA_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vendorbuddy
   JWT_SECRET=your-super-secret-jwt-key-for-production
   JWT_EXPIRATION=86400000
   ```

4. **Database Setup:**
   - Create a MongoDB Atlas cluster
   - Get the connection string
   - Add it to environment variables

### Option 2: Railway Deployment

1. **Connect to Railway:**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Deploy Backend:**
   - Create a new service from GitHub repo
   - Set environment variables
   - Railway will auto-detect Java and build

3. **Deploy Frontend:**
   - Create another service for frontend
   - Set build command: `npm run build`
   - Set static files directory: `dist`

### Option 3: AWS Deployment

#### Using AWS ECS with Fargate

1. **Create ECR repositories:**
   ```bash
   aws ecr create-repository --repository-name vendor-buddy-backend
   aws ecr create-repository --repository-name vendor-buddy-frontend
   ```

2. **Build and push images:**
   ```bash
   # Backend
   docker build -t vendor-buddy-backend ./backend
   docker tag vendor-buddy-backend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/vendor-buddy-backend:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/vendor-buddy-backend:latest

   # Frontend
   docker build -t vendor-buddy-frontend ./frontend
   docker tag vendor-buddy-frontend:latest <account-id>.dkr.ecr.<region>.amazonaws.com/vendor-buddy-frontend:latest
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/vendor-buddy-frontend:latest
   ```

3. **Create ECS cluster and services**
4. **Set up Application Load Balancer**
5. **Configure MongoDB Atlas**

## 🔧 Environment Configuration

### Frontend Environment Variables

Create `.env.production` in the frontend directory:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
VITE_APP_NAME=Vendor-Buddy
```

### Backend Environment Variables

```env
# Database
SPRING_DATA_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vendorbuddy

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-for-production
JWT_EXPIRATION=86400000

# Server Configuration
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api

# CORS Configuration
SPRING_WEB_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create a cluster:**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a free cluster
   - Choose your preferred cloud provider and region

2. **Set up database access:**
   - Create a database user with read/write permissions
   - Whitelist your IP addresses

3. **Get connection string:**
   - Go to "Connect" in your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update environment variables:**
   - Replace `<password>` with your actual password
   - Add the connection string to your backend environment variables

### Local MongoDB (Development)

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb
# or
brew services start mongodb-community
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Use HTTPS for all communications
- [ ] Set strong JWT secret (32+ characters)
- [ ] Configure CORS properly
- [ ] Use environment variables for sensitive data
- [ ] Set up proper MongoDB authentication
- [ ] Enable MongoDB network access controls
- [ ] Use strong passwords for database users
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up backup strategies

### SSL/TLS Configuration

For production, always use HTTPS:

1. **Obtain SSL certificate:**
   - Use Let's Encrypt (free)
   - Or purchase from a certificate authority

2. **Configure nginx (if using):**
   ```nginx
   server {
       listen 443 ssl;
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       # ... rest of configuration
   }
   ```

## 📊 Monitoring and Logging

### Application Monitoring

1. **Set up logging:**
   - Configure log levels in `application.properties`
   - Use structured logging (JSON format)
   - Set up log aggregation

2. **Health checks:**
   - Spring Boot Actuator endpoints
   - Database connectivity checks
   - External service health monitoring

3. **Performance monitoring:**
   - Application performance monitoring (APM)
   - Database query optimization
   - Response time tracking

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS errors:**
   - Check CORS configuration in backend
   - Verify frontend URL is in allowed origins

2. **Database connection issues:**
   - Verify MongoDB connection string
   - Check network access and firewall rules
   - Ensure database user has proper permissions

3. **JWT authentication issues:**
   - Verify JWT secret is consistent
   - Check token expiration settings
   - Ensure proper token format

4. **Build failures:**
   - Check Node.js and Java versions
   - Verify all dependencies are installed
   - Check for syntax errors in code

### Support

For deployment issues:
1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Test database connectivity
4. Check network connectivity between services

## 📈 Scaling Considerations

### Horizontal Scaling

1. **Load Balancing:**
   - Use multiple backend instances
   - Configure load balancer (nginx, AWS ALB, etc.)
   - Implement session management

2. **Database Scaling:**
   - MongoDB Atlas auto-scaling
   - Read replicas for read-heavy workloads
   - Sharding for large datasets

3. **Caching:**
   - Redis for session storage
   - CDN for static assets
   - Application-level caching

### Performance Optimization

1. **Frontend:**
   - Code splitting and lazy loading
   - Image optimization
   - Bundle size optimization

2. **Backend:**
   - Database query optimization
   - Connection pooling
   - Caching strategies

3. **Infrastructure:**
   - Auto-scaling policies
   - Resource monitoring
   - Performance alerts