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
    stage ('Setup') {
      parallel {
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
      }
    }
    stage ('Test and build') {
      when { changeRequest() }
      parallel {
        stage ('Unit Testing') {
          steps {
            sh 'echo "Stage Description: Runs the unit tests of the project"'
            sh "docker exec ${docker_tag} npm run test"
          }
        }
        stage ('Lint') {
          steps {
            sh 'echo "Stage Description: Lints the project"'
            sh "docker exec ${docker_tag} npm run lint"
          }
        }
        stage ('Build') {
          steps {
            sh 'echo "Stage Description: Builds the production version of the app"'
            sh "docker exec ${docker_tag} npm run build"
            sh "docker exec ${docker_tag} mv app/assets/favicons/favicon.ico build/favicon.ico"
            sh "docker cp ${docker_tag}:/home/node/app/build ."
          }
        }
      }
    }
    stage ('Build') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'hotfix'; branch 'feature'}}
      steps {
        sh 'echo "Stage Description: Builds the production version of the app"'
        sh "docker exec ${docker_tag} npm run build"
        sh "docker cp ${docker_tag}:/home/node/app/build ."
      }
    }
    stage ('Preview PR') {
      when { changeRequest() }
      steps {
        sh "aws s3 rm s3://frontend-prs.cxengagelabs.net/tb2/${pr}/ --recursive"
        sh "sed -i 's/\\\"\\/main/\\\"\\/tb2\\/${pr}\\/main/g' build/index.html"
        sh "cp app/configs/pr/config.json build"
        sh "aws s3 sync build/ s3://frontend-prs.cxengagelabs.net/tb2/${pr}/ --delete"
        script {
          f.invalidate("E23K7T1ARU8K88")
          office365ConnectorSend status:"Ready for review", message:"<a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html\">Toolbar 2 Dev Preview</a> <br /> <a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html?desktop=true\">Desktop Dev Preview</a>", webhookUrl:"https://outlook.office.com/webhook/2ca7c3d9-47be-4907-9669-0bbed835452d@6baa6e2a-52be-4677-a9b8-36d2ec6f6ebc/JenkinsCI/f19495112ef24fa1a2dbf894d8b19058/d56e9e1b-ab01-40fc-ad2e-71e0bcd5e373"
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
            office365ConnectorSend status:"Ready for QE", color:"f6c342", message:"<a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html\">Toolbar 2 QE Preview</a> <br /> <a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html?desktop=true\">Desktop QE Preview</a>", webhookUrl:"https://outlook.office.com/webhook/2ca7c3d9-47be-4907-9669-0bbed835452d@6baa6e2a-52be-4677-a9b8-36d2ec6f6ebc/JenkinsCI/f19495112ef24fa1a2dbf894d8b19058/d56e9e1b-ab01-40fc-ad2e-71e0bcd5e373"
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
            office365ConnectorSend status:"Ready to be merged", color:"67ab49", webhookUrl:"https://outlook.office.com/webhook/2ca7c3d9-47be-4907-9669-0bbed835452d@6baa6e2a-52be-4677-a9b8-36d2ec6f6ebc/JenkinsCI/f19495112ef24fa1a2dbf894d8b19058/d56e9e1b-ab01-40fc-ad2e-71e0bcd5e373"
          }
        }
      }
    }
    stage ('Push new tag'){
      when { anyOf {branch 'master'; branch 'develop'; branch 'hotfix'}}
      steps {
        script {
          try {
            git branch: BRANCH_NAME, url: "git@github.com:SerenovaLLC/${service}"
            if (build_version.contains("SNAPSHOT")) {
              sh "if git tag --list | grep ${build_version}; then git tag -d ${build_version}; git push origin :refs/tags/${build_version}; fi"
            }
            sh "git tag -a ${build_version} -m 'release ${build_version}, Jenkins tagged ${BUILD_TAG}'"
            sh "git push origin ${build_version}"
          } catch (e) {
            sh 'echo "Failed create git tag"'
          }
        }
      }
    }
    stage ('Upload source maps') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'hotfix'; branch 'feature'}}
      environment {
        sentry_api_key = credentials('sentry-token')
      }
      steps {
        sh 'echo "Creates a release and then uploads the bundled code and source maps to Sentry"'
        sh "docker exec ${docker_tag} ./node_modules/.bin/sentry-cli --auth-token $sentry_api_key releases -o serenova -p skylight new ${build_version}"
        sh "docker exec ${docker_tag} ./node_modules/.bin/sentry-cli --auth-token $sentry_api_key releases -o serenova -p skylight files ${build_version} upload-sourcemaps build/"
      }
    }
    stage ('Create dev build') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'hotfix'; branch 'feature';}}
      steps {
        sh 'echo "Stage Description: Pushes build files to S3"'
        sh "cp app/configs/dev/config.json build"
        sh "aws s3 sync build/ s3://frontend-prs.cxengagelabs.net/dev/builds/skylight/${build_version}/ --delete"
      }
    }
    stage ('Create qe build') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'hotfix'; branch 'feature';}}
      steps {
        sh 'echo "Stage Description: Pushes build files to S3"'
        sh "cp app/configs/qe/config.json build"
        sh "aws s3 sync build/ s3://frontend-prs.cxengagelabs.net/qe/builds/skylight/${build_version}/ --delete"
      }
    }
    stage ('Push to jenkins storage S3') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'hotfix'; branch 'feature';}}
      steps {
        sh 'echo "Stage Description: Pushes build files to S3"'
        sh "aws s3 sync build/ s3://cxengagelabs-jenkins/frontend/${service}/${build_version}/ --exclude \"*.js.map\" --delete"
      }
    }
    stage ('Deploy') {
      when { anyOf {branch 'master'; branch 'develop'; branch 'hotfix'}}
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