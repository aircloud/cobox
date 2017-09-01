/**
 * Created by Xiaotao.Nie on 24/08/2017.
 * All right reserved
 * IF you have any question please email onlythen@yeah.net
 */
import { h, render, Component } from 'preact';

import './Header.less';

export default class Header extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="cobox-header">
                <p>与<span className="ep">&nbsp;AirCloud&nbsp;</span>聊天</p>
            </div>
        )
    }
}