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
            sh "aws s3 sync ./build/ s3://cxengagelabs-jenkins/frontend/Agent-Desktop/${build_version}/ --delete"
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
      step([$class: 'WsCleanup'])
    }
  }
  stage ('Deploy - Dev') {
    timeout(time:5, unit:'DAYS') {
      input "Deploy to Dev?"
      node() {
        try {
          sh "aws s3 sync s3://cxengagelabs-jenkins/frontend/Agent-Desktop/${build_version}/ . --delete"
          writeFile file: 'robin.json', text: "{ \"version\": \"${build_version}\"} "
          writeFile file: 'config.json', text: "{ \"config\": { \"api\": \"dev-api.cxengagelabs.net/v1\", \"env\": \"dev\", \"domain\": \"cxengagelabs.net\", \"region\": \"us-east-1\", \"version\": \"${build_version}\" } }"
          sh "aws s3 rm s3://dev-desktop.cxengagelabs.net/ --recursive"
          sh "aws s3 sync . s3://dev-desktop.cxengagelabs.net/ --delete"
          sh "aws cloudfront create-invalidation --distribution-id E3MJXQEHZTM4FB --paths /*"
          hipchatSend color: 'GREEN',
                      credentialId: 'HipChat-API-Token',
                      message: "<a href=\"https://github.com/liveops/${serviceName}\"><b>${serviceName}</b></a> was upgraded to ${build_version} by <b>${BUILD_USER}</b> (@${BUILD_USER_ID}) (<a href="$URL">Open</a>)",
                      notify: true,
                      room: 'dev',
                      sendAs: 'Jenkins',
                      server: 'api.hipchat.com',
                      textFormat: false,
                      v2enabled: false
        }
        catch(err) {
          hipchatSend color: 'RED',
                      credentialId: 'HipChat-API-Token',
                      message: "Failed to upgrade <a href=\"https://github.com/liveops/${serviceName}\"><b>${serviceName}</b></a> to ${build_version}. Deployed by <b>${BUILD_USER}</b> (@${BUILD_USER_ID}) (<a href="$URL">Open</a>)",
                      notify: true,
                      room: 'dev',
                      sendAs: 'Jenkins',
                      server: 'api.hipchat.com',
                      textFormat: false,
                      v2enabled: false
          echo "Failed: ${err}"
          error "Failed: ${err}"
        }
        finally {
          step([$class: 'WsCleanup'])
        }
      }
    }
  }
}
else {
  stage 'error'
  error 'No Stage'
}
