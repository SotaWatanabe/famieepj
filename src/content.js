import React, { Component } from 'react';
import './content.css'
import axios from 'axios';

// ハードこーどしちゃってる
const ETHHERSCAN_ENDPOINT = 'https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=';

export class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            resp: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            text: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        axios.get(ETHHERSCAN_ENDPOINT+this.state.text)
        .then(results => {
            this.setState({
                resp: results.data.result.input
            })
        }).catch(e => {
            console.log(e)
        })
    }

    render() {
        return (
            <div className="Body">
                <p className="explain">番号を入力して愛の誓いを確認しよう</p>
                <p className="explain2">以下の入力欄に0xから始まるトランザクションIDを入力してください。証明書を発行する際に入力した誓いの言葉を確認することができます。</p>
                <div className="form">
                    <form name="myform" onSubmit={(e) => this.handleSubmit(e)}> 
                        <div>
                            <input name="mytext" type="text" className="input1" onChange={(e) => this.handleChange(e)} />
                        </div>
                        <div className="input2">
                            <input type="submit" value="送信" className="input3"/>
                        </div>
                    </form>
                    <div　className="output">{this.state.resp}</div> 
                </div>
            </div>
        )
    }
}

export default Content;