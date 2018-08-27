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
    stage ('Export Properties') {
      steps {
        script {
          n.export()
          build_version = readFile('version')
          c.setDisplayName("${build_version}")
        }
      }
    }
    stage ('Test && Build') {
      steps {
        sh "mkdir build"
        sh "docker build -t ${docker_tag} -f Dockerfile-build ."
        sh "docker run --rm --mount type=bind,src=$HOME/.ssh,dst=/home/node/.ssh,readonly --mount type=bind,src=${pwd}/build,dst=/home/node/mount ${docker_tag}"
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
    stage ('Push to Github') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        git url: "git@github.com:SerenovaLLC/${service}"
        sh 'git checkout -b build-${BUILD_TAG}'
        sh 'git add -f build/* '
        sh "git commit -m 'release ${build_version}'"
        script {
          if (build_version.contains("SNAPSHOT")) {
            sh "if git tag --list | grep ${build_version}; then git tag -d ${build_version}; git push origin :refs/tags/${build_version}; fi"
          }
        }
        sh "git tag -a ${build_version} -m 'release ${build_version}, Jenkins tagged ${BUILD_TAG}'"
        sh "git push origin ${build_version}"
      }
    }
    stage ('Push to S3') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'release'; branch 'hotfix'}}
      steps {
        script {
          n.push("${service}", "${build_version}")
        }
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
      }
    }
    stage ('Notify Success') {
      steps {
        script {
          h.hipchatPullRequestSuccess("${service}", "${build_version}")
        }
      }
    }
  }
  post {
    failure {
      script {
        h.hipchatPullRequestFailure("${service}", "${build_version}")
      }
    }
    always {
      script {
        c.cleanup()
        try {
          sh "docker rmi ${docker_tag}"
        } catch (Exception e) {
          sh "echo 'WARN: The docker image we tried to remove does not exist. Continuing.'"
        }
      }
    }
  }
}
