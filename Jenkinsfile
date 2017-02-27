@Library('sprockets') _
import clj.pr
import clj.build
node {
pwd = pwd()
}
// Fill in Service Name
def repoName = 'agent-desktop'
def serviceName = 'Agent-Desktop'
if (pwd ==~ /.*PR.*/ ) { // Run if Job is a Pull Request
  node() {
    def p = new clj.pr()
    try {
      timeout(time: 1, unit: 'HOURS') {
        ansiColor('xterm') {
          stage ('SCM Checkout') { // Checkout Source Code
            checkout scm
          }
          stage ('Export Properties') { // Export Properties
            sh "node -e  \"console.log(require('./package.json').version);\" | xargs echo -n > version"
            pr_version = readFile('version')
            p.setDisplayName("${pr_version}")
          }
          stage ('Notify Success') { // Hipchat Notification of Success
            p.hipchatSuccess("${serviceName}", "${pr_version}")
          }
        }
      }
    }
    catch (err) {
      // Hipchat Notification of Failure
      p.hipchatFailure("${serviceName}", "${pr_version}")
      echo "Failed: ${err}"
      error "Failed: ${err}"
    }
    finally {
      // Cleanup Workspace
      step([$class: 'WsCleanup'])
    }
  }
}
// Run Job on Commit to Master Branch
else if (pwd ==~ /.*master.*/ ) {
  node() {
    def b = new clj.build()
    try {
      timeout(time: 1, unit: 'HOURS') { // Timeout If Job is stuck
        ansiColor('xterm') { // Enable Color
          stage ('SCM Checkout') { // Checkout SCM
            checkout scm
          }
          stage ('Export Properties') { // Get Service Version
            sh "node -e  \"console.log(require('./package.json').version);\" | xargs echo -n > version"
            build_version = readFile('version')
            b.setDisplayName("${build_version}")
          }
          stage ('Build') { // Build Website
            def nodeHome = tool name: '5.3.0 and Gulp and Bower', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
            env.PATH = "${nodeHome}/bin:${env.PATH}"
            sh 'npm install'
            sh 'npm run build'
          }
          stage ('Push') { // Publish to S3
            sh "aws s3 sync ./build/ s3://cxengagelabs-jenkins/frontend/Agent-Desktop/noah-test/${build_version}/ --delete"
          }
          stage ('Notify Success') { // Notify Hipchat of Success
            b.hipchatSuccess("${serviceName}", "${build_version}")
          }
        }
      }
    }
    catch (err) {
      // Hipchat of Failure
      b.hipchatFailure("${serviceName}", "${build_version}")
      echo "Failed: ${err}"
      error "Failed: ${err}"
    }
    finally {
      // Cleanup Workspace
      step([$class: 'WsCleanup'])
    }
  }
  stage ('Deploy - Dev') {
    timeout(time:5, unit:'DAYS') {
      input "Deploy to Dev?"
      node() {
        echo "HE APPROVED"
      }
    }
  }
  stage ('Test') {
    timeout(time:5, unit:'DAYS') {
      input message: 'Test Dev?', parameters: [string(defaultValue: '', description: 'Which Test Suite Would You Like to Run?', name: 'Suite')]
      node() {
        echo "Running Tests in Dev"
      }
    }
  }
  stage ('Deploy - QE') {
    timeout(time:5, unit:'DAYS') {
      input "Deploy to QE?"
      node() {
        echo "Deployed to QE"
     }
    }
  }
}
else {
  stage 'error'
  error 'No Stage'
}
