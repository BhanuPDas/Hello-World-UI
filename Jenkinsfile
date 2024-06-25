pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "hello-world-ui"
        DOCKER_USER = "bhanupdas"
        DOCKER_PWD = "Midtown@12"
        DOCKERBUILD = "${env.BUILD_NUMBER}"
        DOCKERPATH = "bhanupdas/hello-world-ui"
    }
    tools {
                nodejs 'Node21'
            }

    stages {
        stage('Build') {
        when {
               branch "develop"
        }
            steps {
                sh "npm install"
            }
        }

        stage('Test') {
        when {
               branch "develop"
        }
            steps {
                sh "npm test"
            }
        }

        stage('Deploy-Dev') {
        when {
               branch "develop"
        }
            steps {
                script {
                        sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PWD}"
                        sh "docker build -t ${DOCKER_IMAGE}.${DOCKERBUILD} ."
                        sh "docker image tag ${DOCKER_IMAGE}.${DOCKERBUILD} ${DOCKERPATH}:${DOCKER_IMAGE}.${DOCKERBUILD}"
                        sh "docker image push ${DOCKERPATH}:${DOCKER_IMAGE}.${DOCKERBUILD}"
                        sh "docker image pull ${DOCKERPATH}:${DOCKER_IMAGE}.${DOCKERBUILD}"
                        sh "docker image tag ${DOCKER_IMAGE}.${DOCKERBUILD}:latest ${DOCKER_IMAGE}.${DOCKERBUILD}:dev"
                        def networkName = 'dev'
                        def networkExists = sh(script: "docker network inspect $networkName > /dev/null 2>&1", returnStatus: true)
                    
                    if (networkExists == 0) {
                        echo "Network '$networkName' exists."
                        sh "docker run -it --network dev -p 3000:3000 -d --env-file=dev.env ${DOCKER_IMAGE}.${DOCKERBUILD}:dev"
                    } else {
                        echo "Network '$networkName' does not exist."
                        echo "Create Network '$networkName'"
                        sh "docker network create dev"
                        sh "docker run -it --network dev -p 3000:3000 -d --env-file=dev.env ${DOCKER_IMAGE}.${DOCKERBUILD}:dev"
                    }
                }
            }
        }
        
        stage('Deploy-Qa') {
        when {
               branch "develop"
        }
            steps {
                script {
                        def networkName = 'qa'
                        sh "docker image pull ${DOCKERPATH}:${DOCKER_IMAGE}.${DOCKERBUILD}"
                        sh "docker image tag ${DOCKER_IMAGE}.${DOCKERBUILD}:latest ${DOCKER_IMAGE}.${DOCKERBUILD}:qa"
                        def networkExists = sh(script: "docker network inspect $networkName > /dev/null 2>&1", returnStatus: true)
                    
                    if (networkExists == 0) {
                        echo "Network '$networkName' exists."
                        sh "docker run -it --network qa -p 3001:3000 -d --env-file=qa.env ${DOCKER_IMAGE}.${DOCKERBUILD}:qa"
                    } else {
                        echo "Network '$networkName' does not exist."
                        echo "Create Network '$networkName'"
                        sh "docker network create qa"
                        sh "docker run -it --network qa -p 3001:3000 -d --env-file=qa.env ${DOCKER_IMAGE}.${DOCKERBUILD}:qa"
                    }
                }
            }
        }
        
        stage('Release') {
        when {
               branch "develop"
        }
            steps {
            	echo "Code is merged to Main branch."
            }
        }
        
        stage('Deploy-Stage') {
        when {
               branch "develop"
        }
            steps {
                script {
                        sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PWD}"
                        sh "docker image pull ${DOCKERPATH}:${DOCKER_IMAGE}.${DOCKERBUILD}"
                        sh "docker image tag ${DOCKER_IMAGE}.${DOCKERBUILD}:latest ${DOCKER_IMAGE}.${DOCKERBUILD}:stage"
                        def networkName = 'stage'
                        def networkExists = sh(script: "docker network inspect $networkName > /dev/null 2>&1", returnStatus: true)
                    
                    if (networkExists == 0) {
                        echo "Network '$networkName' exists."
                        sh "docker run -it --network stage -p 3002:3000 -d --env-file=stage.env ${DOCKER_IMAGE}.${DOCKERBUILD}:stage"
                    } else {
                        echo "Network '$networkName' does not exist."
                        echo "Create Network '$networkName'"
                        sh "docker network create stage"
                        sh "docker run -it --network stage -p 3002:3000 -d --env-file=stage.env ${DOCKER_IMAGE}.${DOCKERBUILD}:stage"
                    }
                }
            }
        }
        
        stage('Deploy-Prod') {
        when {
               branch "develop"
        }
            steps {
                script {
                        sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PWD}"
                        sh "docker image pull ${DOCKERPATH}:${DOCKER_IMAGE}.${DOCKERBUILD}"
                        sh "docker image tag ${DOCKER_IMAGE}.${DOCKERBUILD}:latest ${DOCKER_IMAGE}.${DOCKERBUILD}:prod"
                        def networkName = 'prod'
                        def networkExists = sh(script: "docker network inspect $networkName > /dev/null 2>&1", returnStatus: true)
                    
                    if (networkExists == 0) {
                        echo "Network '$networkName' exists."
                        sh "docker run -it --network prod -p 3003:3000 -d --env-file=prod.env ${DOCKER_IMAGE}.${DOCKERBUILD}:prod"
                    } else {
                        echo "Network '$networkName' does not exist."
                        echo "Create Network '$networkName'"
                        sh "docker network create prod"
                        sh "docker run -it --network prod -p 3003:3000 -d --env-file=prod.env ${DOCKER_IMAGE}.${DOCKERBUILD}:prod"
                    }
                    
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline has completed"
        }
    }
}