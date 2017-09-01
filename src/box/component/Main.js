/**
 * Created by Xiaotao.Nie on 24/08/2017.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import { h, render, Component } from 'preact';

import onfire from 'onfire.js';

import './Main.less';

export default class Main extends Component{
    constructor(props){
        super(props);
        this.state = {
            coboxMain:null
        };
    }

    componentDidMount() {
        onfire.on('reScroll',()=>{
            this.reScrollTop();
        });
        this.state.coboxMain = document.getElementById('cobox-main')
    }

    reScrollTop(){
        let scrollHeight = this.state.coboxMain.scrollHeight;
        let clientHeight = this.state.coboxMain.clientHeight;
        if(scrollHeight > clientHeight){
            this.state.coboxMain.scrollTop = scrollHeight - clientHeight;
        }

    }

    render(){
        return(
            <div className="cobox-main" id="cobox-main">
                {this.props.talkList.map((item,index)=> {
                    switch (item.type) {
                        case 'image':
                            return (
                                <div className="msg-row">
                                    <div className={`msg msg-bounce-in-${item.dir} msg-${item.dir}`}
                                         key={index}>
                                        <img src={item.content}/>
                                    </div>
                                </div>);

                        case 'text':
                            return (<div className="msg-row">
                                <div className={`msg msg-bounce-in-${item.dir} msg-${item.dir}`}
                                     key={index}>{item.content}
                                </div>
                            </div>);

                        case 'loading':
                            return (<div className="msg-row">
                                <div className={`msg msg-bounce-in-${item.dir} msg-${item.dir}`}
                                     key={index}>
                                    <div className="loading">
                                        <i/><i/><i/>
                                    </div>
                                </div>
                            </div>);

                        // default:
                        //     return (<div className="msg-row">
                        //         <div className={`msg msg-bounce-in-${item.dir} msg-${item.dir}`}
                        //              key={index}>
                        //             <div className="loading">
                        //                 <i/><i/><i/>
                        //             </div>
                        //         </div>
                        //     </div>);

                        default:
                            return (<div className="msg-row">
                                <div className={`msg msg-bounce-in-${item.dir} msg-${item.dir}`}
                                     key={index}>{item.content}
                                </div>
                            </div>);
                    }
                })}
            </div>
        )
    }
}