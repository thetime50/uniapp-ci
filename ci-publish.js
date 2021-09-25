
/**
 * 1. - 命令行参数
 * 2. √ 命令行交互
 * 3. √ 执行编译
 *      3.1 √ child_process执行
 *      3.2 - cross-env / vue-cli-service - js 执行 
 *          // 不需要 vue-cli-service还是直接从命令行获取参数的 还是要通过child_process执行
 * 4. √ ci 配置
 * 5. sourceMap 保存
 * 6. √ git 对比
 * 7. √ 进度条
 * 8. √ 版本号自增加 版本号确认 git tag
 * 9. 依赖更新检查
 * 
 */

const ora = require('ora') // 进度条
const fs = require('fs')
const pfs = require('fs/promises')
const path = require('path')
const {exec,spawn} = require('child_process') // 命令行程序执行
const program = require('commander') // 命令行交互提示
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
    let spinner
    try{
        const options = {
            binary: 'git',
            maxConcurrentProcesses: 6,
        };

        // when setting all options in a single object
        const git = simpleGit(process.cwd(), options);
        // logSymbols
        // 在主分支上
        const branch = await git.branchLocal()
        spinner = ora('check branch is main or master').start()
        if(branch.current != 'main' && branch.current != 'master'){
            let msg = `branch is ${branch.current.cyan} not main or master`
            spinner.stop()
            console.log(msg,logSymbolserror)
            throw new Error(msg)
        }
        spinner.stop()
        console.log('branch is '+ branch.current,logSymbols.success)

        // // 获取更新远端跟踪分支
        // spinner = ora('git fetch origin').start()
        // try{
        //     await git.fetch('origin')
        // }catch(e) {
        //     let msg = 'git fetch error'
        //     spinner.stop()
        //     console.log(msg,logSymbolserror)
        //     throw new Error(msg)
        // }
        // spinner.stop()
        // console.log('git fetch ok',logSymbols.success)

        // const diff = await git.diff('remotes/origin/'+branch.current)
        // spinner = ora('check idff').start()
        // if(diff){
        //     let msg = `There are file that have not been commit`
        //     spinner.stop()
        //     console.log(msg,logSymbols.error)
        //     throw new Error(msg)
        // }
        // spinner.stop()
        // console.log('diff remotes/origin/'+branch.current,logSymbols.success)

        
        // git tag -n --sort=taggerdate 
        // const tages = await git.tags() // 按字母顺序排序
        // const tages = await git.tags('-n',{'--sort': 'taggerdate'}) // 按打tag的时间从旧到新排序的
        const tages = await git.tags('-n',{'--sort': 'committerdate'}) // 按提交时间从旧到新排序的
        const lastTag =tages.all.find((v,i,a)=>{
            // https://docs.npmjs.com/cli/v6/configuring-npm/package-json#version
            return /^v?(\d+\.)+\d+(-.*)?\b$/.test( v)
        }) || '0.0.0'
        let tail = lastTag.replace(/^v?(\d+\.)+(\d+).*/,'$2')
        tail = Number(tail)+1
        let newTage = lastTag.replace(/^(v?(\d+\.)+)(\d+).*/,'$1'+tail)
        let tagParam = await inquirer.prompt([
            {
                type: 'input',
                message: '输入版本号:',
                name: 'tag',
                default: newTage // 默认值
            },
            {
                type: 'input',
                message: '输入更新信息：',
                name: 'message',
                validate(val){
                    if(val){
                        return true
                    }
                    return '请输入更新信息'
                },
            }
        ])
        await git.tag(['-a',tagParam.tag,'-m',`"${tagParam.message}"`])

            
        console.log('aa',tages )
        console.log()

    }catch(e){
        throw e
    }
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