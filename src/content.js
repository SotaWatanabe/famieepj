import React, { Component } from 'react';
import './content.css'
import axios from 'axios';
// import CryptoJS from 'crypto-js';
var crypto = require('crypto');

// ハードこーどしちゃってる
const ETHHERSCAN_ENDPOINT = 'https://api-ropsten.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=';

export class Content extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            resp: "",
            key: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeKey = this.handleChangeKey.bind(this);
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
            const segments = results.data.result.input.toUpperCase().match(/.{2}/g);
            var encoded = ""
            for (var i = 0; i < segments.length; i++) {
                encoded += "%" + segments[i];
            }

            var key = new Buffer(this.state.key);
            var resp = decodeURI(encoded.slice(3)).replace(/%2C/g, ",").replace(/%2F/g, "/").replace(/%2B/g, "+")
            var buf = new Buffer(resp);
            var iv = buf.slice(0, 16).toString();
            var encryptedData  = buf.toString();

            var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
            var decrypted = decipher.update(encryptedData, 'base64', 'utf8');
            decrypted += decipher.final('utf8');

            this.setState({
                resp: decrypted
            })
        }).catch(e => {
            console.log(e)
        })
    }

    handleChangeKey(e) {
        e.preventDefault()
        this.setState({
            key: e.target.value
        })
    }

    render() {
        return (
            <div ref={el => (this.instance = el)} className="Body">
                <p className="explain">番号を入力して愛の誓いを確認しよう</p>
                <p className="explain2">以下の入力欄に0xから始まるトランザクションIDを入力してください。<br />その次にパートナーシップ証明書で得たパスワードを入力します。<br />誓いの文字を確認しましょう。</p>
                <div className="form">
                    <form className="form1" name="myform" onSubmit={(e) => this.handleSubmit(e)}> 
                        <div>
                            <input name="mytext" placeholder="0xから始まるトランザクションID" type="text" className="input1" onChange={(e) => this.handleChange(e)} />
                        </div>
                    
                        <div>
                            <input name="mytext" placeholder="復号化パスワード" type="text" className="input1" onChange={(e) => this.handleChangeKey(e)} />
                        </div>
                    
                        <button type="submit"  className="input2">送信</button>
                    </form>

                    <div　className="output">{"誓いの言葉："+ this.state.resp}</div>
                </div>
            </div>
        )
    }
}

export default Content;
