pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'healthcare-advisor'
        DOCKER_TAG = "${BUILD_NUMBER}"
        REGISTRY = 'your-docker-registry.com'
        AWS_REGION = 'us-west-2'
        EC2_HOST = 'your-ec2-host.com'
    }
    
    tools {
        nodejs '18'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Checking out code from repository...'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm ci'
            }
        }
        
        stage('Code Quality & Security') {
            parallel {
                stage('Lint') {
                    steps {
                        echo 'Running ESLint...'
                        sh 'npm run lint'
                    }
                }
                stage('Security Scan') {
                    steps {
                        echo 'Running security audit...'
                        sh 'npm audit --audit-level moderate'
                    }
                }
                stage('Type Check') {
                    steps {
                        echo 'Running TypeScript compiler...'
                        sh 'npx tsc --noEmit'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm run test -- --coverage'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'coverage/junit.xml'
                    publishCoverage adapters: [
                        istanbulCoberturaAdapter('coverage/cobertura-coverage.xml')
                    ]
                }
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: false
                }
            }
        }
        
        stage('Docker Build') {
            steps {
                echo 'Building Docker image...'
                script {
                    def image = docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    
                    // Tag as latest
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Docker Security Scan') {
            steps {
                echo 'Scanning Docker image for vulnerabilities...'
                sh """
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                    -v \$(pwd):/root/.cache/ aquasec/trivy:latest \
                    image --exit-code 0 --severity HIGH,CRITICAL \
                    --format template --template "@contrib/sarif.tpl\" \
                    -o trivy-results.sarif ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'trivy-results.sarif'
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo 'Pushing Docker image to registry...'
                script {
                    docker.withRegistry("https://${REGISTRY}", 'docker-registry-credentials') {
                        def image = docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}")
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to staging environment...'
                sh """
                    docker-compose -f docker-compose.staging.yml down || true
                    docker-compose -f docker-compose.staging.yml up -d
                """
            }
        }
        
        stage('Integration Tests') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Running integration tests...'
                sh 'npm run test:integration'
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production...'
                script {
                    // Deployment approval
                    def userInput = input(
                        id: 'Proceed1', 
                        message: 'Deploy to production?', 
                        parameters: [
                            [$class: 'BooleanParameterDefinition', 
                             defaultValue: false, 
                             description: 'Proceed with production deployment?', 
                             name: 'Deploy']
                        ]
                    )
                    
                    if (userInput) {
                        // Blue-Green deployment
                        sh """
                            # Deploy to green environment
                            ssh -i ~/.ssh/production.pem ubuntu@${EC2_HOST} '
                                cd /opt/healthcare-advisor &&
                                docker-compose -f docker-compose.prod.yml pull &&
                                docker-compose -f docker-compose.prod.yml up -d --scale frontend=2 &&
                                sleep 30 &&
                                docker-compose -f docker-compose.prod.yml scale frontend=1
                            '
                        """
                    }
                }
            }
        }
        
        stage('Performance Tests') {
            when {
                branch 'main'
            }
            steps {
                echo 'Running performance tests...'
                sh '''
                    # Install artillery if not present
                    npm install -g artillery
                    
                    # Run load tests
                    artillery run performance-tests/load-test.yml
                '''
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Performing health checks...'
                script {
                    retry(3) {
                        sh '''
                            sleep 10
                            curl -f http://${EC2_HOST}/health || exit 1
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh 'docker system prune -f'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "✅ Healthcare Advisor deployment successful - Build #${BUILD_NUMBER}"
            )
        }
        failure {
            echo 'Pipeline failed!'
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: "❌ Healthcare Advisor deployment failed - Build #${BUILD_NUMBER}"
            )
        }
        unstable {
            echo 'Pipeline completed with warnings'
            slackSend(
                channel: '#deployments',
                color: 'warning',
                message: "⚠️ Healthcare Advisor deployment unstable - Build #${BUILD_NUMBER}"
            )
        }
    }
}