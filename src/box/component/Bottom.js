/**
 * Created by Xiaotao.Nie on 24/08/2017.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import { h, render, Component } from 'preact';

import onfire from 'onfire.js';

import './Bottom.less';

export default class Bottom extends Component{
    constructor(props){
        super(props);
        this.state = {
            promptDisplay:'none',
            customInput:'',
            customId:100
        }
    }

    showPrompt(){
        console.log(document.getElementById('prompt'));
        this.setState({
            promptDisplay:'flex'
        },()=>{
            onfire.fire('reScroll');
        })
    }

    getNext(circleId,content){
        this.setState({
            promptDisplay:'none'
        },()=>{
            onfire.fire('reScroll');
        });
        onfire.fire("getNext", circleId, content);
    }

    sendCustom(){
        // 这里需要更多的判断
        if(!this.state.customInput)return; // 消息不能为空
        onfire.fire("getNext", this.state.customId, this.state.customInput);
        this.setState({
            promptDisplay:'none',
            customInput:''
        },()=>{
            onfire.fire('reScroll');
        });
    }

    render(){
        return(
            <div className="cobox-bottom">
                <div id="input-hint" className="say-something" >
                    <span className="clickable"
                          onClick={()=>{this.showPrompt()}}
                          style={{display:this.state.promptDisplay === 'flex'? 'none':'block'}}> 说点什么……</span>
                    <input placeholder="说点什么…"
                           className="msg-input"
                           value={this.state.customInput}
                           style={{display:this.state.promptDisplay}}
                           onChange={(e)=>{this.setState({
                               customInput:e.target.value
                           })}}
                    />
                    <img className="send clickable noselect" src={require('./images/send.png')} onClick={()=>{this.sendCustom()}}/>
                </div>
                <div className="prompt" id="prompt" style={{display:this.state.promptDisplay}}>
                    {/*<div className="prompt-head">*/}
                    {/*<div className="say-something">说点什么……</div>*/}
                    {/*</div>*/}
                    <div className="prompt-body">
                        <ul className="responses noselect">
                            {this.props.reply.map((item,index)=>
                                <li><a href="javascript:;" onClick={()=>{this.getNext(item.circleId,item.content)}}>{item.content}</a></li>
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        )
    }
}