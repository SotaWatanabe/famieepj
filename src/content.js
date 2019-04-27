import React, { Component } from 'react';
import './content.css'
import axios from 'axios';
import CryptoJS from "crypto-js";

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
        this.handleDecrypt = this.handleDecrypt.bind(this);
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


            this.setState({
                resp: decodeURI(encoded.slice(3)).replace(/%2C/g, ",")
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

    handleDecrypt(e) {
        e.preventDefault()
        var encrypted = this.state.resp
        console.log(encrypted)
        var decrypted = CryptoJS.AES.decrypt(encrypted, this.state.key, {iv: "abcdefghijklmnop"});
        console.log(decrypted)
        // console.log(decrypted.toString(CryptoJS.enc.Utf8))
        // console.log(decrypted.toString(CryptoJS.enc.Utf8));
    }

    render() {
        return (
            <div ref={el => (this.instance = el)} className="Body">
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
                    
                    <form name="myform" onSubmit={(e) => this.handleDecrypt(e)}> 
                        <div>
                            <input name="mytext" type="text" className="input1" onChange={(e) => this.handleChangeKey(e)} />
                        </div>
                        <div className="input2">
                            <input type="submit" value="復号" className="input3"/>
                        </div>
                    </form>
                    <div　className="output">{this.state.resp}</div> 
                </div>
            </div>
        )
    }
}

export default Content;
