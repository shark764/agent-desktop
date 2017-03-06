#!groovy​
@Library('sprockets@1.0.0') _
import node.pr
import node.build
import deploy.frontend
import testing.acme

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
            p.export()
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
            b.export()
            build_version = readFile('version')
            b.setDisplayName("${build_version}")
          }
          stage ('Build') { // Build Website
            b.build()
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
          d.hipchatSuccess("${service}", "dev", "${build_version}", "${env.BUILD_USER}")
        }
        catch(err) {
          d.hipchatFailure("${service}", "dev", "${build_version}", "${env.BUILD_USER}")
          echo "Failed: ${err}"
          error "Failed: ${err}"
        }
        finally {
          d.cleanup()
        }
      }
    }
  }
  stage ('Test - Dev') {
    timeout(time:5, unit:'DAYS') {
      input message: 'Test Dev?', submitterParameter: 'submitter'
      node() {
        def t = new testing.acme()
        try {
          t.singleTest("dev", "login")
          t.hipchatSuccess("${service}", "dev", "${build_version}")
        }
        catch(err) {
          t.hipchatFailure("${service}", "dev", "${build_version}")
          echo "Failed: ${err}"
          error "Failed: ${err}"
        }
        finally {
          t.cleanup()
        }
      }
    }
  }
  if (!build_version.contains("SNAPSHOT")) {
    echo "this is a RELEASE version and the pipeline will continue"
  }
  else if (build_version.contains("SNAPSHOT")) {
    echo "This is a SNAPSHOT, and therefore the end of its pipeline"
  }
  else {
    stage ('Error')
    error 'Could not determine SNAPSHOT'
  }
}
else {
  stage ('Error')
  error 'No Stage'
}
