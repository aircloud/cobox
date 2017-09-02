/**
 * Created by Xiaotao.Nie on 24/08/2017.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */

import { h, render, Component } from 'preact';

import Bottom from './component/Bottom.js'
import Header from './component/Header.js'
import Main from './component/Main.js'

import onfire from 'onfire.js';

import {preURL} from './Config.js';

import './theme/QuiteCyan.less';
import './theme/common.less';
import './Box.less';

const TestImg = /^img.*?/;

export default class Box extends Component{
    constructor(props){
        super(props);

        this.updating = false;
        // 通过添加这个状态，可以使得在用户输入频率过高时及时截断系统输入

        this.state = {
            talkList : [],
            reply: [],
            beginTalk:["你好，欢迎来认识我"],
            beginReply:["你好，你能简单的介绍一下自己吗？", "啊，我只是不小心点进来的"],
        };
    }
    //
    // // 只要调用这个了,就是不可挽回
    // addTalkList(obj,ifLoading){
    //     if(ifLoading){
    //         // 先loading一会
    //
    //     }
    //
    // }
    //

    updateTalkList(obj,ifupdate){ // 同步更新TalkList
        let talkList = this.state.talkList;
        if(!ifupdate) {
            if (obj.type === 'loading') {
                talkList.push(Object.assign({}, obj));
            } else if (TestImg.test(obj.content) || obj.type === 'image') {
                obj.content = obj.content.replace('img:', '');
                talkList.push(Object.assign({}, obj, {type: 'image'}));
            } else {
                talkList.push(Object.assign({}, obj, {type: 'text'}));
            }
        } else {
            if (TestImg.test(obj.content)) {
                obj.content = obj.content.replace('img:', '');
                talkList[talkList.length - 1] = Object.assign({}, obj, {type: 'image'});
            } else {
                talkList[talkList.length - 1] = Object.assign({}, obj, {type: 'text'});
            }
        }
        this.setState({talkList});
        onfire.fire('reScroll');
    }

    // 初步更新了写法，但是感觉仍然麻烦
    updateTalkListAsync(obj){ // 异步更新TalkList
        if(obj.dir === 'left') {
            this.updateTalkList(Object.assign({}, {type: 'loading', dir: 'left'}));
            setTimeout(() => {
                this.updateTalkList(obj,true);
            }, 500);
        } else {
            this.updateTalkList(obj,false);
        }
    }

    componentDidMount() {
        let talkList = this.state.talkList;
        let reply = this.state.reply;
        for(let i = 0 ; i < this.state.beginTalk.length; i++) {
            talkList.push({
                circleId:101,
                dir: 'left',
                content: this.state.beginTalk[i]
            })
        }
        for(let i = 0 ; i < this.state.beginReply.length; i++) {
            reply.push({
                circleId:101,
                dir: 'right',
                content: this.state.beginReply[i]
            })
        }
        this.setState({
            talkList,reply
        });
        onfire.on('getNext', (circleId,content) => {
            this.updating = false;
            this.updateTalkListAsync({
                circleId:circleId,
                dir: 'right',
                content: content
            });
            let rawBody = {
                circleId,
                content
            };
            console.log('getNext');

            let minLoading = new Promise((resolve,reject) => {

                setTimeout(()=>{
                    this.updateTalkList(Object.assign({}, {type: 'loading', dir: 'left'}));
                },200);

                setTimeout(()=>{
                    resolve(0);
                },600)
            });

            let dataFetch = fetch(`${preURL}/message`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(rawBody)
            }).then((response) => {
                return response.json();
            });

            // 这个里面实际上是一个流式的数据控制与处理,虽然不够优雅,但是能解决问题
            Promise.all([minLoading,dataFetch]).then(([loading,response])=>{
                this.updating = true;
                console.log(response);
                if(response.exist){
                    let contents = response.result.content.split("||");
                    let reply = [];
                    let i = 0;
                    let that = this;

                    this.updateTalkList( Object.assign({}, {content:contents[0], dir: 'left'}),true);

                    contents.shift();

                    if(contents.length) {
                        function updateTalk() {
                            if (i < contents.length) {
                                if(that.updating) {
                                    that.updateTalkListAsync({
                                        circleId: response.result.circleId,
                                        dir: 'left',
                                        content: contents[i]
                                    });
                                    i++;
                                    setTimeout(updateTalk, 500);
                                } else {
                                    return 0;
                                }
                            }
                        }
                        setTimeout(updateTalk, 500);
                    }

                    let replys = response.result.reply.split("||");
                    if(replys.length) {
                        for (let i = 0; i < replys.length; i++) {
                            reply.push({
                                circleId: response.result.circleId,
                                dir: 'right',
                                content: replys[i]
                            });
                            this.setState({reply});
                        }
                    }
                }
                else{
                    this.updateTalkList({
                        circleId:101,
                        dir: 'left',
                        content: "对不起，这样的语言我还没办法处理"
                    },true);
                }
            });

        });
    }


    render(){
        return(
            <div className="cobox">
                <Header/>
                <Main talkList={this.state.talkList}/>
                <Bottom reply={this.state.reply}/>
            </div>
        )
    }
}