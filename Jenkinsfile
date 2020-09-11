#!groovy​
@Library('sprockets@2.9.4') _

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

//This will stop all old builds so that things are not running in parallel.
c.stop_previous_builds(env.JOB_NAME, env.BUILD_NUMBER.toInteger())

node(){
  pwd = pwd()
}

pipeline {
  agent any
  stages {
    stage ('Setup') {
      when { anyOf {changeRequest(); branch 'master'; branch 'develop'; branch 'hotfix'; branch 'feature'}}
      parallel {
        stage ('Set build version') {
          steps {
            sh 'echo "Stage Description: Set build version from package.json"'
            script {
              buildTool = c.getBuildTool()
              props = c.exportProperties(buildTool)
              n.export()
              build_version = readFile('version')
            }
          }
        }
        stage ('Setup Docker') {
          steps {
            sh 'echo "Stage Description: Sets up docker image for use in the next stages"'
            sh "rm -rf build; mkdir build -p"
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
          office365ConnectorSend status:"Ready for review", message:"<a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html\">Toolbar 2 Dev Preview</a> <br /> <a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html?desktop=true\">Desktop Dev Preview</a>", webhookUrl:"https://outlook.office.com/webhook/046fbedf-24a1-4c79-8e4a-3f73437d9de5@1d8e6215-577d-492c-9fe9-b3c9e7d65fdd/JenkinsCI/26ba2757836d431c8310fbfbfbb905dc/4060fcf8-0939-4695-932a-b8d400889db6"
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
            office365ConnectorSend status:"Ready for QE", color:"f6c342", message:"<a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html\">Toolbar 2 QE Preview</a> <br /> <a href=\"https://frontend-prs.cxengagelabs.net/tb2/${pr}/index.html?desktop=true\">Desktop QE Preview</a>", webhookUrl:"https://outlook.office.com/webhook/046fbedf-24a1-4c79-8e4a-3f73437d9de5@1d8e6215-577d-492c-9fe9-b3c9e7d65fdd/JenkinsCI/26ba2757836d431c8310fbfbfbb905dc/4060fcf8-0939-4695-932a-b8d400889db6"
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
            office365ConnectorSend status:"Ready to be merged", color:"67ab49", webhookUrl:"https://outlook.office.com/webhook/046fbedf-24a1-4c79-8e4a-3f73437d9de5@1d8e6215-577d-492c-9fe9-b3c9e7d65fdd/JenkinsCI/26ba2757836d431c8310fbfbfbb905dc/4060fcf8-0939-4695-932a-b8d400889db6"
          }
        }
      }
    }
    stage ('Push new tag'){
      when { anyOf {branch 'master'; branch 'develop'; branch 'hotfix'; branch 'feature'}}
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
      when { anyOf {branch 'master'; branch 'develop'; branch 'hotfix'; branch 'feature'}}
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
    // success {
    //   script {
    //     h.hipchatPullRequestSuccess("${service}", "${build_version}")
    //   }
    // }
    // failure {
    //   script {
    //     h.hipchatPullRequestFailure("${service}", "${build_version}")
    //   }
    // }
    unstable {
        echo 'This will run only if the run was marked as unstable'
    }
    changed {
        echo 'This will run only if the state of the Pipeline has changed'
        echo 'For example, if the Pipeline was previously failing but is now successful'
    }
  }
}