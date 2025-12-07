# High-Priority Issue Implementations

**Last Updated**: 2025-12-07  
**Status**: Phase 0 - Foundation  
**Architecture**: AWS Serverless with LocalStack

This document details implementation specifications for high-priority blocking issues that must be completed before other features can proceed.

---

## Critical Path Issues

These issues block all other development and must be implemented first:

1. **Issue #3**: PostgreSQL Database Setup
2. **Issue #5**: Authentication System  
3. **Issue #26**: Database Schema Implementation
4. **Issue #22**: AI Gateway Service
5. **Issue #24**: Redis Cache & Session Store
6. **Issue #23**: Background Worker Queue
7. **Issue #25**: WebSocket Infrastructure (Y.js)
8. **Issue #2**: AWS CDK Infrastructure Setup

---


## Issue #2: AWS CDK Infrastructure Setup

**Priority**: CRITICAL - Blocks all AWS infrastructure  
**Complexity**: Medium  
**Estimated Time**: 3-4 days  
**Dependencies**: None

### Overview

Set up AWS CDK project to define all infrastructure as code, deployable to both LocalStack (development) and AWS (production).

### Architecture Decisions

- **IaC Tool**: AWS CDK with TypeScript
- **Local Development**: LocalStack with \cdklocal\ wrapper
- **Stack Organization**: Multiple stacks for separation of concerns
- **Deployment**: Single \cdk deploy --all\ command

### Stack Structure

\\\
infra/
├── bin/
│   └── infra.ts                 # CDK app entry point
├── lib/
│   ├── network-stack.ts         # VPC, subnets, security groups
│   ├── database-stack.ts        # Aurora Serverless v2
│   ├── storage-stack.ts         # S3 buckets
│   ├── cache-stack.ts           # ElastiCache Redis
│   ├── api-stack.ts             # API Gateway + Lambda functions
│   ├── worker-stack.ts          # SQS + Fargate workers
│   ├── collaboration-stack.ts   # ALB + Fargate (Y.js)
│   └── auth-stack.ts            # Secrets Manager, Cognito (optional)
├── package.json
├── cdk.json
└── tsconfig.json
\\\

### Implementation Steps

#### 1. Initialize CDK Project

\\\ash
cd infra
npm init -y
npm install aws-cdk-lib constructs
npm install -D @types/node typescript ts-node
npx cdk init app --language typescript
\\\

#### 2. Main CDK App (\in/infra.ts\)

\\\	ypescript
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { DatabaseStack } from '../lib/database-stack';
import { StorageStack } from '../lib/storage-stack';
import { CacheStack } from '../lib/cache-stack';
import { ApiStack } from '../lib/api-stack';
import { WorkerStack } from '../lib/worker-stack';
import { CollaborationStack } from '../lib/collaboration-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT || 'local',
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

// Network foundation
const network = new NetworkStack(app, 'TheBrainNetworkStack', { env });

// Storage layer
const storage = new StorageStack(app, 'TheBrainStorageStack', { env });

// Database
const database = new DatabaseStack(app, 'TheBrainDatabaseStack', {
  env,
  vpc: network.vpc,
});

// Cache
const cache = new CacheStack(app, 'TheBrainCacheStack', {
  env,
  vpc: network.vpc,
});

// API
const api = new ApiStack(app, 'TheBrainApiStack', {
  env,
  vpc: network.vpc,
  database: database.cluster,
  redis: cache.cluster,
  uploadsBucket: storage.uploadsBucket,
});

// Background workers
const workers = new WorkerStack(app, 'TheBrainWorkerStack', {
  env,
  vpc: network.vpc,
  database: database.cluster,
  redis: cache.cluster,
});

// Collaboration (Y.js WebSocket)
const collab = new CollaborationStack(app, 'TheBrainCollaborationStack', {
  env,
  vpc: network.vpc,
  redis: cache.cluster,
});

app.synth();
\\\

#### 3. Network Stack (\lib/network-stack.ts\)

\\\	ypescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class NetworkStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly lambdaSecurityGroup: ec2.SecurityGroup;
  public readonly fargateSecurityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with public and private subnets
    this.vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: 'Isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Lambda security group
    this.lambdaSecurityGroup = new ec2.SecurityGroup(this, 'LambdaSG', {
      vpc: this.vpc,
      description: 'Security group for Lambda functions',
      allowAllOutbound: true,
    });

    // Fargate security group
    this.fargateSecurityGroup = new ec2.SecurityGroup(this, 'FargateSG', {
      vpc: this.vpc,
      description: 'Security group for Fargate tasks',
      allowAllOutbound: true,
    });

    // Outputs
    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      exportName: 'TheBrainVpcId',
    });
  }
}
\\\

#### 4. Database Stack (\lib/database-stack.ts\)

\\\	ypescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface DatabaseStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class DatabaseStack extends cdk.Stack {
  public readonly cluster: rds.DatabaseCluster;
  public readonly secret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    // Database credentials in Secrets Manager
    this.secret = new secretsmanager.Secret(this, 'DBCredentials', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'postgres' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
      },
    });

    // Security group for Aurora
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSG', {
      vpc: props.vpc,
      description: 'Security group for Aurora Serverless',
    });

    dbSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
      ec2.Port.tcp(5432),
      'Allow PostgreSQL from VPC'
    );

    // Aurora Serverless v2 Cluster
    this.cluster = new rds.DatabaseCluster(this, 'Database', {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_15_3,
      }),
      credentials: rds.Credentials.fromSecret(this.secret),
      writer: rds.ClusterInstance.serverlessV2('writer', {
        publiclyAccessible: false,
      }),
      readers: [
        rds.ClusterInstance.serverlessV2('reader', {
          scaleWithWriter: true,
        }),
      ],
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 2,
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [dbSecurityGroup],
      defaultDatabaseName: 'thebrain',
      backup: {
        retention: cdk.Duration.days(7),
        preferredWindow: '03:00-04:00',
      },
      deletionProtection: true,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ClusterEndpoint', {
      value: this.cluster.clusterEndpoint.hostname,
      exportName: 'TheBrainDBEndpoint',
    });

    new cdk.CfnOutput(this, 'SecretArn', {
      value: this.secret.secretArn,
      exportName: 'TheBrainDBSecretArn',
    });
  }
}
\\\

#### 5. Storage Stack (\lib/storage-stack.ts\)

\\\	ypescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class StorageStack extends cdk.Stack {
  public readonly uploadsBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Uploads bucket
    this.uploadsBucket = new s3.Bucket(this, 'UploadsBucket', {
      bucketName: 'thebrain-uploads',
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      cors: [
        {
          allowedOrigins: ['http://localhost:3000', 'https://thebrain.io'],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
          ],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
      lifecycleRules: [
        {
          id: 'DeleteOldTempFiles',
          expiration: cdk.Duration.days(7),
          prefix: 'temp/',
        },
        {
          id: 'TransitionToIA',
          transitions: [
            {
              storageClass: s3.StorageClass.INFREQUENT_ACCESS,
              transitionAfter: cdk.Duration.days(90),
            },
          ],
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Output
    new cdk.CfnOutput(this, 'UploadsBucketName', {
      value: this.uploadsBucket.bucketName,
      exportName: 'TheBrainUploadsBucket',
    });
  }
}
\\\

#### 6. Cache Stack (\lib/cache-stack.ts\)

\\\	ypescript
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';

export interface CacheStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
}

export class CacheStack extends cdk.Stack {
  public readonly cluster: elasticache.CfnCacheCluster;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: CacheStackProps) {
    super(scope, id, props);

    // Security group
    this.securityGroup = new ec2.SecurityGroup(this, 'RedisSG', {
      vpc: props.vpc,
      description: 'Security group for Redis',
    });

    this.securityGroup.addIngressRule(
      ec2.Peer.ipv4(props.vpc.vpcCidrBlock),
      ec2.Port.tcp(6379),
      'Allow Redis from VPC'
    );

    // Subnet group
    const subnetGroup = new elasticache.CfnSubnetGroup(this, 'RedisSubnetGroup', {
      description: 'Subnet group for Redis',
      subnetIds: props.vpc.privateSubnets.map(subnet => subnet.subnetId),
      cacheSubnetGroupName: 'thebrain-redis-subnet-group',
    });

    // Redis cluster
    this.cluster = new elasticache.CfnCacheCluster(this, 'RedisCluster', {
      cacheNodeType: 'cache.t3.micro',
      engine: 'redis',
      engineVersion: '7.0',
      numCacheNodes: 1,
      vpcSecurityGroupIds: [this.securityGroup.securityGroupId],
      cacheSubnetGroupName: subnetGroup.ref,
      preferredMaintenanceWindow: 'sun:05:00-sun:06:00',
    });

    this.cluster.addDependency(subnetGroup);

    // Output
    new cdk.CfnOutput(this, 'RedisEndpoint', {
      value: this.cluster.attrRedisEndpointAddress,
      exportName: 'TheBrainRedisEndpoint',
    });
  }
}
\\\

#### 7. API Stack (\lib/api-stack.ts\)

\\\	ypescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import { Construct } from 'constructs';

export interface ApiStackProps extends cdk.StackProps {
  vpc: ec2.Vpc;
  database: rds.DatabaseCluster;
  redis: elasticache.CfnCacheCluster;
  uploadsBucket: s3.Bucket;
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  public readonly apiFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Lambda function for API
    this.apiFunction = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.PYTHON_3_11,
      handler: 'handler.main',
      code: lambda.Code.fromAsset('../apps/api'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      environment: {
        DATABASE_URL: \postgresql://\:\@\:5432/thebrain\,
        REDIS_URL: \edis://\:6379/0\,
        S3_BUCKET: props.uploadsBucket.bucketName,
      },
    });

    // Grant permissions
    props.uploadsBucket.grantReadWrite(this.apiFunction);
    props.database.secret?.grantRead(this.apiFunction);

    // API Gateway
    this.api = new apigateway.RestApi(this, 'Api', {
      restApiName: 'TheBrainApi',
      description: 'The Brain API Gateway',
      defaultCorsPreflightOptions: {
        allowOrigins: ['http://localhost:3000', 'https://thebrain.io'],
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Lambda integration
    const integration = new apigateway.LambdaIntegration(this.apiFunction);

    // Routes
    const v1 = this.api.root.addResource('api').addResource('v1');
    
    // Health check
    v1.addResource('health').addMethod('GET', integration);
    
    // Projects
    const projects = v1.addResource('projects');
    projects.addMethod('GET', integration);
    projects.addMethod('POST', integration);
    
    const project = projects.addResource('{id}');
    project.addMethod('GET', integration);
    project.addMethod('PUT', integration);
    project.addMethod('DELETE', integration);
    
    // Chapters
    const chapters = project.addResource('chapters');
    chapters.addMethod('GET', integration);
    chapters.addMethod('POST', integration);

    // Usage plan for rate limiting
    const usagePlan = this.api.addUsagePlan('StandardPlan', {
      name: 'Standard',
      throttle: {
        rateLimit: 100,
        burstLimit: 200,
      },
      quota: {
        limit: 10000,
        period: apigateway.Period.DAY,
      },
    });

    // Output
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      exportName: 'TheBrainApiUrl',
    });
  }
}
\\\

#### 8. CDK Configuration (\cdk.json\)

\\\json
{
  \"app\": \"npx ts-node --prefer-ts-exts bin/infra.ts\",
  \"watch\": {
    \"include\": [\"**\"],
    \"exclude\": [
      \"README.md\",
      \"cdk*.json\",
      \"**/*.d.ts\",
      \"**/*.js\",
      \"tsconfig.json\",
      \"package*.json\",
      \"yarn.lock\",
      \"node_modules\",
      \"test\"
    ]
  },
  \"context\": {
    \"@aws-cdk/aws-lambda:recognizeLayerVersion\": true,
    \"@aws-cdk/core:checkSecretUsage\": true,
    \"@aws-cdk/core:target-partitions\": [\"aws\", \"aws-cn\"]
  }
}
\\\

### LocalStack Deployment

#### 1. Install cdklocal

\\\ash
npm install -g aws-cdk-local aws-cdk
\\\

#### 2. Bootstrap LocalStack

\\\ash
cd infra
cdklocal bootstrap
\\\

#### 3. Deploy to LocalStack

\\\ash
cdklocal deploy --all --require-approval never
\\\

#### 4. Get API Gateway URL

\\\ash
awslocal apigateway get-rest-apis
# Use the API ID in frontend: http://localhost:4566/restapis/<api-id>/local/_user_request_/
\\\

### Production Deployment

\\\ash
cd infra

# Configure AWS credentials
export AWS_PROFILE=production

# Bootstrap (first time only)
cdk bootstrap aws://ACCOUNT-ID/REGION

# Deploy
cdk deploy --all --require-approval never
\\\

### Testing

\\\ash
# Synthesize CloudFormation
cd infra && cdk synth

# Check for differences
cdk diff

# Deploy specific stack
cdklocal deploy TheBrainApiStack

# Destroy all stacks (LocalStack)
cdklocal destroy --all
\\\

### Success Criteria

- ✅ All stacks deploy without errors
- ✅ API Gateway accessible
- ✅ Lambda can connect to Aurora
- ✅ Lambda can connect to Redis
- ✅ Lambda can access S3
- ✅ VPC networking configured
- ✅ Security groups properly configured
- ✅ LocalStack deployment working
- ✅ AWS production deployment working

### Next Steps

After CDK infrastructure is deployed:
1. Update frontend \NEXT_PUBLIC_API_URL\ with API Gateway URL
2. Deploy database schema (Issue #26)
3. Test API health endpoint
4. Configure CI/CD for automated deployments

---
## Issue #3 & #26: Database Setup and Schema Implementation

**Combined Priority**: CRITICAL - Blocks all data operations  
**Issue #3 Complexity**: Low (infrastructure)  
**Issue #26 Complexity**: Medium (schema design)  
**Estimated Time**: 2-3 days combined  
**Dependencies**: Issue #2 (CDK Infrastructure)

### Overview

Set up PostgreSQL database (covered in CDK Issue #2) and implement complete SQLAlchemy 2.0 schema with Alembic migrations.

### Database Models

All models in \pps/api/models/\:

#### Base Configuration (\ase.py\)

\\\python
from sqlalchemy.ext.asyncio import AsyncAttrs, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime
import uuid
import os

class Base(AsyncAttrs, DeclarativeBase):
    pass

def generate_uuid():
    return str(uuid.uuid4())

# Database connection
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql+asyncpg://postgres:postgres@localhost:5432/thebrain')
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
\\\

#### Complete Schema Implementation

See attached file \pps/api/models/schema_complete.py\ for full implementation including:

- User model with authentication fields
- Project model with soft delete
- Chapter model with versioning
- Version model for history
- ResearchNote model with tags
- Comment model with threading
- RefreshToken model for auth
- Citation model for bibliography

### Alembic Setup

\\\ash
cd apps/api

# Install dependencies
pip install sqlalchemy[asyncio] alembic asyncpg psycopg2-binary

# Initialize Alembic
alembic init alembic

# Edit alembic/env.py to use async engine
# Generate initial migration
DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/thebrain\" \\
  alembic revision --autogenerate -m \"initial schema\"

# Apply migration
DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/thebrain\" \\
  alembic upgrade head
\\\

### Key Indexes

\\\sql
-- Performance-critical indexes
CREATE INDEX idx_projects_owner ON projects(owner_user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_chapters_project ON chapters(project_id, \"order\") WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_chapter ON comments(chapter_id) WHERE resolved = false;
CREATE INDEX idx_versions_chapter_created ON versions(chapter_id, created_at DESC);
CREATE INDEX idx_research_notes_project_tags ON research_notes USING gin(tags);
\\\

### Success Criteria

- ✅ PostgreSQL running (local Docker, AWS Aurora)
- ✅ All models defined with relationships
- ✅ Alembic migrations working
- ✅ Indexes created
- ✅ Foreign key constraints enforced
- ✅ Soft delete working on all entities
- ✅ UUID primary keys
- ✅ Timestamps auto-updating

---
## Issue #5: Authentication System (JWT + Lambda Authorizer)

**Priority**: CRITICAL - Blocks all protected routes  
**Complexity**: Medium-High  
**Estimated Time**: 3-5 days  
**Dependencies**: Issues #3, #24, #26

### Overview

Implement JWT-based authentication with Lambda Authorizer, refresh tokens, and secure session management.

### Architecture

- **Access Tokens**: Short-lived JWT (15 min), stored in memory
- **Refresh Tokens**: Long-lived (30 days), httpOnly cookie, stored in database
- **Authorization**: AWS Lambda Authorizer validates JWT on API Gateway
- **Password Hashing**: bcrypt with 12 rounds
- **Rate Limiting**: Redis-based per endpoint

### Implementation Components

#### 1. JWT Utilities (\pps/api/services/auth/jwt.py\)

\\\python
import jwt
import os
from datetime import datetime, timedelta
from typing import Dict, Optional

JWT_SECRET = os.getenv('JWT_SECRET')
JWT_ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 30

def create_access_token(user_id: str, email: str) -> str:
    expires = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        'sub': user_id,
        'email': email,
        'exp': expires,
        'iat': datetime.utcnow(),
        'type': 'access'
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    expires = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        'sub': user_id,
        'exp': expires,
        'iat': datetime.utcnow(),
        'type': 'refresh'
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> Optional[Dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
\\\

#### 2. Password Hashing (\pps/api/services/auth/password.py\)

\\\python
import bcrypt

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())
\\\

#### 3. Auth Lambda Handler (\pps/api/handlers/auth.py\)

\\\python
import json
from services.auth.jwt import create_access_token, create_refresh_token, verify_token
from services.auth.password import hash_password, verify_password
from models.user import User
from models.refresh_token import RefreshToken
from database import get_db

async def signup(event, context):
    body = json.loads(event['body'])
    email = body['email']
    password = body['password']
    
    async for db in get_db():
        # Check if user exists
        existing = await db.execute(select(User).where(User.email == email))
        if existing.scalar_one_or_none():
            return response(409, {'error': 'Email already registered'})
        
        # Create user
        user = User(
            email=email,
            password_hash=hash_password(password),
            full_name=body.get('full_name')
        )
        db.add(user)
        await db.commit()
        
        # Generate tokens
        access_token = create_access_token(user.id, user.email)
        refresh_token = create_refresh_token(user.id)
        
        # Store refresh token
        refresh = RefreshToken(
            user_id=user.id,
            token_hash=hash_password(refresh_token),
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        db.add(refresh)
        await db.commit()
        
        return response(201, {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {'id': user.id, 'email': user.email}
        })

async def login(event, context):
    body = json.loads(event['body'])
    email = body['email']
    password = body['password']
    
    async for db in get_db():
        user = await db.execute(select(User).where(User.email == email))
        user = user.scalar_one_or_none()
        
        if not user or not verify_password(password, user.password_hash):
            return response(401, {'error': 'Invalid credentials'})
        
        # Generate tokens
        access_token = create_access_token(user.id, user.email)
        refresh_token = create_refresh_token(user.id)
        
        # Store refresh token
        refresh = RefreshToken(
            user_id=user.id,
            token_hash=hash_password(refresh_token),
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        db.add(refresh)
        await db.commit()
        
        return response(200, {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {'id': user.id, 'email': user.email}
        })

def response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(body)
    }
\\\

#### 4. Lambda Authorizer (\pps/api/handlers/authorizer.py\)

\\\python
from services.auth.jwt import verify_token

def handler(event, context):
    token = event['authorizationToken'].replace('Bearer ', '')
    
    payload = verify_token(token)
    if not payload:
        raise Exception('Unauthorized')
    
    return {
        'principalId': payload['sub'],
        'policyDocument': {
            'Version': '2012-10-17',
            'Statement': [{
                'Action': 'execute-api:Invoke',
                'Effect': 'Allow',
                'Resource': event['methodArn']
            }]
        },
        'context': {
            'userId': payload['sub'],
            'email': payload['email']
        }
    }
\\\

#### 5. Add to CDK API Stack

\\\	ypescript
// Lambda Authorizer
const authorizer = new lambda.Function(this, 'Authorizer', {
  runtime: lambda.Runtime.PYTHON_3_11,
  handler: 'handlers.authorizer.handler',
  code: lambda.Code.fromAsset('../apps/api'),
  timeout: cdk.Duration.seconds(5),
});

// API Gateway Authorizer
const auth = new apigateway.TokenAuthorizer(this, 'JwtAuthorizer', {
  handler: authorizer,
  identitySource: 'method.request.header.Authorization',
  resultsCacheTtl: cdk.Duration.minutes(5),
});

// Protected routes use authorizer
project.addMethod('GET', integration, { authorizer: auth });
\\\

#### 6. Frontend Auth Context (\pps/web/lib/auth.tsx\)

\\\	ypescript
'use client'

import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function login(email: string, password: string) {
    const response = await fetch(\\/api/v1/auth/login\, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    setUser(data.user);
  }

  async function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext)!;
\\\

### API Endpoints

- \POST /api/v1/auth/signup\ - Register new user
- \POST /api/v1/auth/login\ - Login and get tokens
- \POST /api/v1/auth/refresh\ - Refresh access token
- \POST /api/v1/auth/logout\ - Revoke refresh token
- \GET /api/v1/auth/me\ - Get current user (protected)

### Success Criteria

- ✅ Users can sign up with email/password
- ✅ Users can log in and receive tokens
- ✅ Access tokens expire after 15 minutes
- ✅ Refresh tokens work for 30 days
- ✅ Lambda Authorizer validates tokens
- ✅ Protected routes require authentication
- ✅ Passwords securely hashed with bcrypt
- ✅ Rate limiting prevents brute force
- ✅ Token blacklist on logout
- ✅ All tests passing

---
## Issue #22: AI Gateway Service

**Priority**: HIGH - Blocks all AI features  
**Complexity**: Medium  
**Estimated Time**: 2-3 days  
**Dependencies**: Issue #24 (Redis for caching)

### Quick Implementation Guide

**Location**: \pps/api/services/ai/\

**Key Components**:
1. **Base Provider Interface** - Abstract class for all LLMs
2. **OpenAI Provider** - GPT-4 implementation
3. **Anthropic Provider** - Claude implementation  
4. **Gateway Service** - Unified API with caching
5. **Lambda Handlers** - API endpoints

**Methods to Implement**:
- \generate_chapter(topic, purpose, style)\ - Create chapter outline
- \xpand_bullets(bullets, context)\ - Turn bullets into paragraphs
- \ewrite_text(text, style, operation)\ - Transform text
- \esearch_summary(text, length)\ - Summarize research
- \consistency_check(chapters)\ - Find contradictions

**Caching Strategy**:
- Cache all AI responses in Redis with 1-hour TTL
- Use SHA256 hash of (prompt + params) as cache key
- Skip cache for streaming responses

**Cost Optimization**:
- Rate limit: 10 AI requests/hour per user
- Max tokens: 2000 per request
- Timeout: 30 seconds
- Retry: 3 attempts with exponential backoff

**API Endpoints**:
- \POST /api/v1/ai/draft\
- \POST /api/v1/ai/expand\
- \POST /api/v1/ai/rewrite\
- \POST /api/v1/ai/summarize\

---

## Issue #23: Background Worker Queue (SQS + Fargate)

**Priority**: HIGH - Required for long AI operations  
**Complexity**: Medium  
**Estimated Time**: 2-3 days  
**Dependencies**: Issues #2, #22

### Quick Implementation Guide

**Architecture**: SQS → Fargate Worker (not Celery)

**Flow**:
1. API Lambda receives long-running request
2. Create job ID, store in Redis with status="queued"
3. Send message to SQS queue
4. Return job ID to client immediately
5. Fargate worker polls SQS, processes job
6. Update Redis with result and status="completed"
7. Client polls \GET /api/v1/jobs/{id}\ for status

**Key Files**:
- \pps/workers/ai_worker.py\ - Main worker loop
- \pps/workers/Dockerfile\ - Container definition
- \infra/lib/worker-stack.ts\ - CDK for SQS + Fargate

**Worker Loop**:
\\\python
while True:
    messages = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=1, WaitTimeSeconds=20)
    for msg in messages.get('Messages', []):
        process_job(msg)
        sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=msg['ReceiptHandle'])
    await asyncio.sleep(1)
\\\

**Success Criteria**:
- ✅ Jobs queue successfully
- ✅ Workers process jobs
- ✅ Results stored in Redis
- ✅ Client can poll status
- ✅ Failed jobs retried 3 times

---

## Issue #24: Redis Cache & Session Store

**Priority**: HIGH - Dependency for many features  
**Complexity**: Low  
**Estimated Time**: 1 day  
**Dependencies**: Issue #2

### Quick Implementation Guide

**Covered in CDK Issue #2** - See CacheStack

**Local Setup**:
\\\yaml
# docker-compose.yml
redis:
  image: redis:7-alpine
  ports:
    - \"6379:6379\"
  command: redis-server --appendonly yes --maxmemory 256mb
\\\

**Python Client**:
\\\python
from redis import Redis
redis_client = Redis.from_url(os.getenv('REDIS_URL'), decode_responses=True)
\\\

**Use Cases**:
1. AI response caching
2. Rate limiting counters
3. Job status tracking
4. Y.js document state
5. Session storage

**Success Criteria**:
- ✅ ElastiCache deployed in AWS
- ✅ Redis running locally
- ✅ Lambda can connect
- ✅ Y.js state persists

---

## Issue #25: WebSocket Infrastructure (Y.js on Fargate)

**Priority**: MEDIUM-HIGH - Required for collaboration  
**Complexity**: High  
**Estimated Time**: 3-4 days  
**Dependencies**: Issues #2, #24

### Quick Implementation Guide

**Architecture**: ALB → Fargate (Y.js WebSocket Server) → Redis

**Why Fargate + ALB (not API Gateway WebSocket)**:
- Long-lived connections (hours)
- Better performance for real-time
- Sticky sessions via ALB
- Always-on container

**Key Components**:
1. **Y.js Server** (\pps/collaboration/server.ts\) - Node.js WebSocket server
2. **ALB** - Routes WebSocket traffic
3. **Fargate Service** - Runs Y.js container (always-on)
4. **Redis** - Persists Y.js document state

**Frontend Integration**:
\\\	ypescript
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { useEditor } from '@tiptap/react';
import Collaboration from '@tiptap/extension-collaboration';

const doc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:4510', projectId, doc);

const editor = useEditor({
  extensions: [
    StarterKit.configure({ history: false }),
    Collaboration.configure({ document: doc })
  ]
});
\\\

**Success Criteria**:
- ✅ WebSocket server on Fargate
- ✅ ALB routes connections
- ✅ Multiple clients sync
- ✅ State persists to Redis
- ✅ Reconnection works

---

## Implementation Order & Timeline

### Week 1: Infrastructure Foundation
- **Days 1-2**: Issue #2 - CDK Infrastructure
- **Day 3**: Issue #3 - PostgreSQL Setup
- **Day 4**: Issue #24 - Redis Setup
- **Day 5**: Issue #26 - Database Schema

### Week 2: Core Services
- **Days 1-3**: Issue #5 - Authentication System
- **Days 4-5**: Issue #22 - AI Gateway Service

### Week 3: Advanced Features
- **Days 1-2**: Issue #23 - Background Workers
- **Days 3-5**: Issue #25 - WebSocket/Y.js Infrastructure

### Total: 3 Weeks for Critical Path

---

## Testing Strategy

### Local Testing Checklist
- [ ] All stacks deploy to LocalStack
- [ ] API Gateway accessible at localhost:4566
- [ ] Lambda functions invocable
- [ ] Database migrations run
- [ ] Redis connection works
- [ ] Authentication flow complete
- [ ] AI API calls succeed (with mocked responses)
- [ ] Background jobs process
- [ ] WebSocket connections establish

### Integration Tests
\\\ash
# Run full integration test suite
cd apps/api && pytest tests/integration/

# Test specific flow
pytest tests/integration/test_auth_flow.py -v
\\\

---

## Next Steps After High-Priority Issues

Once these 8 issues are complete, proceed with:

1. **Issue #18**: Distraction-Free Editor (TipTap)
2. **Issue #14**: Book Dashboard (Outline UI)
3. **Issues #6-9**: AI Drafting Features
4. **Issues #10-13**: Research Tools
5. **Issues #31-33**: Security Hardening

---

## Common Pitfalls & Solutions

### LocalStack Issues
**Problem**: CDK deploy fails  
**Solution**: Ensure LocalStack running, use \cdklocal\ not \cdk\

**Problem**: Lambda can't connect to RDS  
**Solution**: Check security group rules, VPC configuration

### Database Issues  
**Problem**: Migrations fail  
**Solution**: Ensure DATABASE_URL correct, PostgreSQL running

### Authentication Issues
**Problem**: JWT validation fails  
**Solution**: Check JWT_SECRET matches in Lambda and Authorizer

### Y.js Issues
**Problem**: Clients don't sync  
**Solution**: Verify WebSocket URL, check Fargate logs, Redis connection

---

**Document Complete**  
**Total Implementation Time**: 3 weeks for critical path  
**Next**: Begin with Issue #2 (CDK Infrastructure)
