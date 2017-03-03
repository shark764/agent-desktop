@Library('sprockets') _
import node.pr
import node.build
import deploy.frontend

node {
pwd = pwd()
}
def service = 'Agent-Desktop'
if (pwd ==~ /.*PR.*/ ) { // Run if Job is a Pull Request
  node() {
    def p = new node.pr()
    try {
      timeout(time: 1, unit: 'HOURS') {
        ansiColor('xterm') {
          stage ('SCM Checkout') { // Checkout Source Code
            p.checkout()
          }
          stage ('Export Properties') { // Export Properties
            sh "node -e  \"console.log(require('./package.json').version);\" | xargs echo -n > version"
            pr_version = readFile('version')
            p.setDisplayName("${pr_version}")
          }
          stage ('Notify Success') { // Hipchat Notification of Success
            p.hipchatSuccess("${service}", "${pr_version}")
          }
        }
      }
    }
    catch (err) {
      // Hipchat Notification of Failure
      p.hipchatFailure("${service}", "${pr_version}")
      echo "Failed: ${err}"
      error "Failed: ${err}"
    }
    finally {
      // Cleanup Workspace
      p.cleanup()
    }
  }
}
// Run Job on Commit to Master Branch
else if (pwd ==~ /.*master.*/ ) {
  node() {
    def b = new node.build()
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
            def nodeHome = tool name: 'Latest', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
            env.PATH = "${nodeHome}/bin:${env.PATH}"
            sh 'npm install'
            sh 'npm run build'
          }
          stage ('Push') { // Publish to S3
            b.push("${service}", "${build_version}")
          }
          stage ('Notify Success') { // Notify Hipchat of Success
            b.hipchatSuccess("${service}", "${build_version}")
          }
        }
      }
    }
    catch (err) {
      // Hipchat of Failure
      b.hipchatFailure("${service}", "${build_version}")
      echo "Failed: ${err}"
      error "Failed: ${err}"
    }
    finally {
      b.cleanup()
    }
  }
  stage ('Deploy - Dev') {
    timeout(time:5, unit:'DAYS') {
      input message: 'Deploy to Dev?', submitterParameter: 'submitter'
      node() {
        def d = new deploy.frontend()
        try {
          d.pull("${service}", "${build_version}")
          d.versionFile("${build_version}")
          d.confFile("dev", "${build_version}")
          d.deploy("dev","desktop")
          d.invalidate("E3MJXQEHZTM4FB")
          d.hipchatSuccess("${service}", "${build_version}", "${env.BUILD_USER}")
        }
        catch(err) {
          d.hipchatFailure("${service}", "${build_version}", "${env.BUILD_USER}")
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
