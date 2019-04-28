import React, { Component } from 'react';
import './content.css'
import axios from 'axios';
// import CryptoJS from 'crypto-js';
var crypto = require('crypto');

// ハードこーどしちゃってる
const ETHHERSCAN_ENDPOINT = 'https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=';

export class Content extends Component {
    constructor(props) {
        super(props);


        this.state = {
            resp: "",
            key: "",
            con:""
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeKey = this.handleChangeKey.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault()
        const txHash = this.props.match.params.txHash
        axios.get(ETHHERSCAN_ENDPOINT+txHash)
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
                <p className="explain2">パートナーシップ証明書で得たパスワードを入力してください。<br />誓いの文字を確認しましょう。</p>
                <div className="form">
                    <form className="form1" name="myform" onSubmit={(e) => this.handleSubmit(e)}>
                        <div>
                            <input name="mytext" placeholder="復号化パスワード" type="text" className="input1" onChange={(e) => this.handleChangeKey(e)} />
                        </div>
                    
                        <button type="submit"  className="input2">送信</button>
                    </form>

                    <div　className="output">{"誓いの言葉："+ this.state.resp}</div>
                    <div className="output">{"誓いの言葉："+ this.state.con}</div>
                </div>
            </div>
        )
    }
}

export default Content;
