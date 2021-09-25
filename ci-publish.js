
/**
 * 1. 命令行参数
 * 2. 命令行交互
 * 3. 执行编译
 *      3.1 child_process执行
 *      3.2 cross-env / vue-cli-service - js 执行 
 *          // 不需要 vue-cli-service还是直接从命令行获取参数的 还是要通过child_process执行
 * 4. ci 配置
 * 5. sourceMap 保存
 * 6. git 对比
 * 7. 进度条
 * 8. 版本号自增加 版本号确认 git tag
 * 9. 依赖更新检查
 * 
 */

const ora = require('ora') // 进度条
const fs = require('fs')
const pfs = require('fs/promises')
const path = require('path')
const {exec,spawn} = require('child_process') // 命令行执行
const program = require('commander') // 命令行参数提示
const inquirer = require('inquirer') // 命令行交互
var requireJSON5 = require('require-json5'); // 导入json5文件
// const minimist = require('minimist') // 命令行参数解析 解析process.argv
const logSymbols = require('log-symbols')
require('colors') // 命令行输出颜色 // cli-color // todo colors-plue 参考 chalk
// shelljs?

const simpleGit = require( 'simple-git');


const args = require('minimist')(process.argv.slice(2))
// console.log('hello'.blue.bgWhite)

const APP_PLATFORM = 'mp-weixin'

function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

async function projBuildProcess() {
    console.log(`*** projBuildProcess ***`.blue.bgWhite,)
    // const spinner = ora('project building...')
    // spinner.start()
    // exec方法默认的最大允许输出到stdout和stderr的数据量不超过200K，如果超过了，子进程就会被杀死
    // await new Promise((resolve,reject)=>{
    //     exec(`npm run build:${APP_PLATFORM}`, (error, stdout, stderr) => {
    //         resolve({error, stdout, stderr})
    //     })
    // }) 
    await new Promise((resolve,reject)=>{
        const build = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['run', `build:${APP_PLATFORM}`], {
            stdio: [
                process.stdin, // Use parent’s stdin for child
                process.stdout, // Pipe child’s stdout to parent
                fs.openSync('./outinfo/err.out', 'w') // Direct child’s stderr to a file
            ]
        })
        build.on('exit', (code, signal) => { // signal 终止子进程的信号
            console.log('exit'.blue.bgWhite, code, signal)
            resolve({
                event:'exit',
                code, signal,
            })
        })
        build.on('disconnect', (code) => {
            console.log('disconnect'.blue.bgWhite, code)
            reject({
                event:'disconnect',
                code,
            })
        })
        build.on('error', (err) => {
            console.log('error'.blue.bgWhite, err)
            reject({
                event:'error',
                err,
            })
        })
    }) 
    // await delay(3000)
    // spinner.stop()
    // console.log('')
}

async function gitCheck(){

    const options = {
        binary: 'git',
        maxConcurrentProcesses: 6,
    };

    // when setting all options in a single object
    const git = simpleGit(process.cwd(), options);
    // logSymbols
    // 在主分支上
    const branch = await git.branchLocal()
    if(branch.current != 'main' && branch.current != 'master'){
        let msg = `branch is ${branch.current.cyan} not main or master`
        console.log(msg,logSymbols.error)
        throw new Error(msg)
    }
    const diff = await git.diff()
    console.log('aa',diff )
}

async function weiXinCi(){
    console.log(`*** weiXinCi ***`.blue.bgWhite,)
    const ci = require('miniprogram-ci')
    const platform = requireJSON5('./src/manifest.json')[APP_PLATFORM]
    // todo
    const project = new ci.Project({
        appid: platform.appid,
        type: 'miniProgram',
        projectPath: 'dist/dev/mp-weixin',
        privateKeyPath: 'keys/wx-private.key',
        ignores: ['node_modules/**/*'],
    })
    console.log(`ci.Project`.blue.bgWhite,project)
    const uploadResult = await ci.upload({
        project,
        version: '0.0.3',
        desc: 'hello',
        setting:{ // https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html#编译设置
            es6:platform.setting,
            minify:platform.minified,
        },
        onProgressUpdate: console.log,
    })
    console.log(`ci.upload`.blue.bgWhite,uploadResult)
}


/**
 * 
 * 
 */
const methods = {
    projBuild: projBuildProcess,
    gitCheck:gitCheck,
    ci:weiXinCi,
}

;
(async function main(){
    // await methods.projBuild()
    await methods.gitCheck()
    // await methods.ci()
})()