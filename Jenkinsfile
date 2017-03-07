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
if (pwd ==~ /.*PR.*/ ) { // Run if Pull Request
  node() { // Allocate Executor
    def p = new node.pr()
    try {
      timeout(time: 1, unit: 'HOURS') {
        ansiColor('xterm') {
          stage ('SCM Checkout') { // Checkout SCM
            p.checkout()
          }
          stage ('Export Properties') { // Export Properties
            p.export()
            pr_version = readFile('version')
            p.setDisplayName("${pr_version}")
          }
          stage ('Notify Success') { // Hipchat Success
            p.hipchatSuccess("${service}", "${pr_version}")
          }
        }
      }
    }
    catch (err) {
      // Hipchat Failure
      p.hipchatFailure("${service}", "${pr_version}")
      echo "Failed: ${err}"
      error "Failed: ${err}"
    }
    finally { // Cleanup
      p.cleanup()
    }
  }
}
else if (pwd ==~ /.*master.*/ ) { // Run if Master Branch
  node() { // Allocate Executor
    def b = new node.build()
    try {
      timeout(time: 1, unit: 'HOURS') { // Timeout If Job is stuck
        ansiColor('xterm') { // Enable Color
          stage ('SCM Checkout') { // Checkout SCM
            checkout scm
          }
          stage ('Export Properties') { // Export Properties
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
          stage ('Notify Success') { // Hipchat Success
            b.hipchatSuccess("${service}", "${build_version}")
          }
        }
      }
    }
    catch (err) {
      // Hipchat Failure
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
          d.pull("${service}", "${build_version}") // pull down version of site from s3
          d.versionFile("${build_version}") // make version file
          d.confFile("dev", "${build_version}") // make conf file
          d.deploy("dev","desktop") // push to s3
          d.invalidate("E3MJXQEHZTM4FB") // invalidate cloudfront
          d.hipchatSuccess("${service}", "dev", "${build_version}", "${env.BUILD_USER}")
        }
        catch(err) {
          // Hipchat Failure
          d.hipchatFailure("${service}", "dev", "${build_version}", "${env.BUILD_USER}")
          echo "Failed: ${err}"
          error "Failed: ${err}"
        }
        finally {
          d.cleanup() // Cleanup
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
          git url: 'git@github.com:liveops/ACME'
          sh 'npm install'
          sh 'npm -g install webdriverio'
          sh 'npm -g install wdio-dot-reporter'
          sh 'npm -g install wdio-jasmine-framework'
          sh 'npm -g install wdio-spec-reporter'
          sh 'npm -g install node-uuid'
          sh 'docker run -d -P -p 4444:4444 --name selenium selenium/standalone-chrome'
          sh 'wdio webdriverio/wdio.conf.js --suite login'
          t.hipchatSuccess("${service}", "dev", "${build_version}") // Notify Success
        }
        catch(err) {
          t.hipchatFailure("${service}", "dev", "${build_version}") // Notify Failure
          echo "Failed: ${err}"
          error "Failed: ${err}"
        }
        finally {
          t.cleanup() // Cleanup
          sh 'docker stop selenium'
          sh 'docker rm selenium'
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
