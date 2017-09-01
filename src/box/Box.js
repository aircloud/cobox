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
        this.state = {
            talkList : [],
            reply: [],
            beginTalk:["你好，欢迎来认识我"],
            beginReply:["你好，你能简单的介绍一下自己吗？", "啊，我只是不小心点进来的"],
        };
    }

    updateTalkList(obj){
        if(obj.dir === 'left') {

            let talkList = this.state.talkList;
            talkList.push(Object.assign({}, {type: 'loading', dir: 'left'}));
            this.setState({talkList});
            onfire.fire('reScroll');

            setTimeout(() => {
                if (TestImg.test(obj.content)) {
                    obj.content = obj.content.replace('img:', '');
                    talkList[talkList.length - 1] = Object.assign({}, obj, {type: 'image'});
                } else {
                    talkList[talkList.length - 1] = Object.assign({}, obj, {type: 'text'});
                }
                this.setState({talkList});
                onfire.fire('reScroll');
            }, 500);
        }

        else {
            let talkList = this.state.talkList;
            if (TestImg.test(obj.content)) {
                obj.content = obj.content.replace('img:', '');
                talkList.push(Object.assign({}, obj, {type: 'image'}));
            } else {
                talkList.push(Object.assign({}, obj, {type: 'text'}));
            }
            this.setState({talkList});
            onfire.fire('reScroll');
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
            console.log(this);
            this.updateTalkList({
                circleId:circleId,
                dir: 'right',
                content: content
            });
            let rawBody = {
                circleId,
                content
            };
            console.log('getNext');
            fetch(`${preURL}/message`,{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body:JSON.stringify(rawBody)
            }).then((response) => {
                return response.json();
            }).then((response) => {
                console.log(response);
                if(response.exist){
                    let contents = response.result.content.split("||");
                    let reply = [];
                    let i = 0;
                    let that = this;
                    function updateTalk(){
                        if(i<contents.length){
                            that.updateTalkList({
                                circleId:response.result.circleId,
                                dir: 'left',
                                content: contents[i]
                            });
                            i++;
                            setTimeout(updateTalk,500);
                        }
                    }
                    setTimeout(updateTalk,500);
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
                    setTimeout(()=>{
                        this.updateTalkList({
                            circleId:101,
                            dir: 'left',
                            content: "对不起，这样的语言我还没办法处理"
                        });
                    },500);
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