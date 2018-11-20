#!groovy​
@Library('sprockets@2.1.0') _

import common
import git
import hipchat
import node
import frontend

def service = 'Agent-Desktop'
def docker_tag = BUILD_TAG.toLowerCase()
def pr = env.CHANGE_ID
def c = new common()
def h = new hipchat()
def n = new node()
def f = new frontend()

@NonCPS
def stop_previous_builds(job_name, build_num) {
  def job = Jenkins.instance.getItemByFullName(job_name)
  def new_builds = job.getNewBuilds()

  for (int i = 0; i < new_builds.size(); i++) {
    def build = new_builds.get(i);
    if (build.getNumber().toInteger() != build_num) {
      if (build.isBuilding()) {
        build.doStop()
      }
    }
  }
}

try {
  stop_previous_builds(env.JOB_NAME, env.BUILD_NUMBER.toInteger())
} catch (Exception e) {}

node(){
  pwd = pwd()
}

pipeline {
  agent any
  stages {
    stage ('Set build version') {
      steps {
        sh 'echo "Stage Description: Set build version from package.json"'
        script {
          n.export()
          build_version = readFile('version')
        }
      }
    }
    stage ('Setup Docker') {
      steps {
        sh 'echo "Stage Description: Sets up docker image for use in the next stages"'
        sh "mkdir build -p"
        sh "docker build -t ${docker_tag} -f Dockerfile-build ."
        sh "docker run --rm -t -d --name=${docker_tag} ${docker_tag}"
      }
    }
    stage ('Unit Testing') {
      when { changeRequest() }
      steps {
        sh 'echo "Stage Description: Lints and runs the unit tests of the project"'
        sh "docker exec ${docker_tag} npm run test"
      }
    }
    stage ('Build') {
      steps {
        sh 'echo "Stage Description: Builds the production version of the app"'
        sh "docker exec ${docker_tag} npm run build"
        sh "docker exec ${docker_tag} mv app/config_pr.json build/config_pr.json"
        sh "docker cp ${docker_tag}:/home/node/app/build ."
      }
    }
    stage ('Preview PR') {
      when { changeRequest() }
      steps {
        sh "aws s3 rm s3://frontend-prs.cxengagelabs.net/tb2/${pr}/ --recursive"
        sh "sed -i 's/\\\"\\/main/\\\"\\/tb2\\/${pr}\\/main/g' build/index.html"
        sh "mv build/config_pr.json build/config.json"
        sh "aws s3 sync build/ s3://frontend-prs.cxengagelabs.net/tb2/${pr}/ --delete"
        script {
          f.invalidate("E23K7T1ARU8K88")
          hipchatSend(color: 'GRAY',
                      credentialId: 'HipChat-API-Token',
                      message: "<a href=\"${pullRequest.url}\"><b>${service}#${pr} - ${pullRequest.title} (${pullRequest.createdBy}) is ready for review</b></a> <br/> <a href=\"${BUILD_URL}\">Link to Build</a> <br/><a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html\">Toolbar 2 Dev Preview</a> <br /> <a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html?desktop=true\">Desktop Dev Preview</a>",
                      notify: true,
                      room: 'Agent Experience PRs',
                      sendAs: 'Jenkins',
                      server: 'api.hipchat.com',
                      textFormat: false,
                      v2enabled: false)
        }
      }
    }
    stage ('Ready for QE') {
      when { changeRequest() }
      steps {
        timeout(time: 5, unit: 'DAYS') {
          script {
            input message: 'Ready for QE?', submittedParameter: 'submitter'
          }
          sh "aws s3 rm s3://frontend-prs.cxengagelabs.net/tb2/${pr}/ --recursive"
          sh "sed -i 's/dev/qe/g' build/config.json"
          sh "aws s3 sync build/ s3://frontend-prs.cxengagelabs.net/tb2/${pr}/ --delete"
          script {
            f.invalidate("E23K7T1ARU8K88")
            hipchatSend(color: 'YELLOW',
                        credentialId: 'HipChat-API-Token',
                        message: "<a href=\"${pullRequest.url}\"><b>${service}#${pr} - ${pullRequest.title} (${pullRequest.createdBy}) is ready for QE</b></a> <br/> <a href=\"${BUILD_URL}\">Link to Build</a> <br/><a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html\">Toolbar 2 QE Preview</a> <br /> <a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html?desktop=true\">Desktop QE Preview</a>",
                        notify: true,
                        room: 'Agent Experience PRs',
                        sendAs: 'Jenkins',
                        server: 'api.hipchat.com',
                        textFormat: false,
                        v2enabled: false)
          }
        }
      }
    }
    stage ('QE Approval') {
      when { changeRequest() }
      steps {
        timeout(time: 5, unit: 'DAYS') {
          script {
            input message: 'Testing complete?', submittedParameter: 'submitter'
            hipchatSend(color: 'GREEN',
                        credentialId: 'HipChat-API-Token',
                        message: "<a href=\"${pullRequest.url}\"><b>${service}#${pr} - ${pullRequest.title} (${pullRequest.createdBy}) is ready to be merged</b></a> <br/> <a href=\"${BUILD_URL}\">Link to Build</a>",
                        notify: true,
                        room: 'Agent Experience PRs',
                        sendAs: 'Jenkins',
                        server: 'api.hipchat.com',
                        textFormat: false,
                        v2enabled: false)
          }
        }
      }
    }
    stage ('Push new tag'){
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        git url: "git@github.com:SerenovaLLC/${service}"
        script {
            if (build_version.contains("SNAPSHOT")) {
              sh "if git tag --list | grep ${build_version}; then git tag -d ${build_version}; git push origin :refs/tags/${build_version}; fi"
            }
          }
        sh "git tag -a ${build_version} -m 'release ${build_version}, Jenkins tagged ${BUILD_TAG}'"
        sh "git push origin ${build_version}"
      }
    }
    stage ('Upload source maps') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      environment {
        sentry_api_key = credentials('sentry-token')
      }
      steps {
        sh 'echo "Creates a release and then uploads the bundled code and source maps to Sentry"'
        sh "docker exec ${docker_tag} ./node_modules/.bin/sentry-cli --auth-token $sentry_api_key releases -o serenova -p skylight new ${build_version}"
        sh "docker exec ${docker_tag} ./node_modules/.bin/sentry-cli --auth-token $sentry_api_key releases -o serenova -p skylight files ${build_version} upload-sourcemaps build/"
      }
    }
    stage ('Push to S3') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        sh 'echo "Stage Description: Pushes build files to S3"'
        sh "aws s3 sync build/ s3://cxengagelabs-jenkins/frontend/${service}/${build_version}/ --exclude \"*.js.map\" --delete"
      }
    }
    stage ('Deploy') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        build job: 'Deploy - Front-End', parameters: [
            [$class: 'StringParameterValue', name: 'Service', value: 'Agent-Desktop'],
            [$class: 'StringParameterValue', name: 'Version', value: "${build_version}"],
            [$class: 'StringParameterValue', name: 'Environment', value: 'dev']
        ]
        build job: 'Deploy - Front-End', parameters: [
            [$class: 'StringParameterValue', name: 'Service', value: 'Agent-Desktop'],
            [$class: 'StringParameterValue', name: 'Version', value: "${build_version}"],
            [$class: 'StringParameterValue', name: 'Environment', value: 'qe']
        ]
      }
    }
  }
  post {
    always {
      script {
        try {
          sh "docker rmi ${docker_tag} --force"
        } catch (e) {
          sh 'echo "Failed to remove docker image"'
        }
        c.cleanup()
      }
    }
    success {
      script {
        h.hipchatPullRequestSuccess("${service}", "${build_version}")
      }
    }
    failure {
      script {
        h.hipchatPullRequestFailure("${service}", "${build_version}")
      }
    }
    unstable {
        echo 'This will run only if the run was marked as unstable'
    }
    changed {
        echo 'This will run only if the state of the Pipeline has changed'
        echo 'For example, if the Pipeline was previously failing but is now successful'
    }
  }
}